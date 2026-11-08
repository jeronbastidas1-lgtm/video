import { VideoScene, VisualStyleType, CameraMotion } from '../types/video';

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  scene: VideoScene | null;
  sceneIndex: number;
  totalScenes: number;
  sceneProgress: number; // 0 to 1
  totalProgress: number; // 0 to 1
  currentTime: number;
  totalDuration: number;
  style: VisualStyleType;
  aspectRatio: '9:16' | '16:9';
  showSubtitles?: boolean;
}

// Particle pool for ambient dust / sparkles
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  phase: number;
}

const particles: Particle[] = Array.from({ length: 45 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: Math.random() * 4 + 1.5,
  speedX: (Math.random() - 0.5) * 0.002,
  speedY: -Math.random() * 0.003 - 0.001,
  alpha: Math.random() * 0.7 + 0.3,
  phase: Math.random() * Math.PI * 2
}));

export function renderVideoFrame(options: RenderOptions) {
  const {
    canvas,
    scene,
    sceneIndex,
    totalScenes,
    sceneProgress,
    totalProgress,
    currentTime,
    totalDuration,
    style,
    aspectRatio,
    showSubtitles = true
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx || !scene) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Apply Camera Motion (Pan / Zoom / Tilt)
  applyCameraMotion(ctx, width, height, scene.cameraMotion, sceneProgress);

  // Render Background and Visual Style
  switch (style) {
    case 'real':
      renderRealStyle(ctx, width, height, scene, sceneProgress, currentTime);
      break;
    case '3d':
      render3DStyle(ctx, width, height, scene, sceneProgress, currentTime);
      break;
    case '2d':
      render2DStyle(ctx, width, height, scene, sceneProgress, currentTime);
      break;
    case 'monigote':
      renderMonigoteStyle(ctx, width, height, scene, sceneProgress, currentTime);
      break;
  }

  // Restore Camera transform before rendering HUD / Subtitles so text is pinned crisp and stable
  ctx.restore();

  // Render Cinematic Overlays (Vignette, Film Scrim)
  renderCinematicVignette(ctx, width, height, style);

  // Render Top Header / Scene HUD
  renderTopHUD(ctx, width, height, scene, sceneIndex, totalScenes, style);

  // Render Subtitles
  if (showSubtitles) {
    renderSubtitles(ctx, width, height, scene, sceneProgress, style);
  }

  // Render Bottom Progress Bar
  renderProgressBar(ctx, width, height, totalProgress, currentTime, totalDuration);
}

function applyCameraMotion(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  motion: CameraMotion,
  progress: number
) {
  const cx = width / 2;
  const cy = height / 2;

  let scale = 1.0;
  let offsetX = 0;
  let offsetY = 0;

  switch (motion) {
    case 'zoom_in':
      scale = 1.0 + progress * 0.12;
      break;
    case 'zoom_out':
      scale = 1.12 - progress * 0.12;
      break;
    case 'pan_left':
      scale = 1.08;
      offsetX = (1 - progress * 2) * 28;
      break;
    case 'pan_right':
      scale = 1.08;
      offsetX = (progress * 2 - 1) * 28;
      break;
    case 'tilt_up':
      scale = 1.08;
      offsetY = (1 - progress * 2) * 22;
      break;
  }

  ctx.translate(cx + offsetX, cy + offsetY);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);
}

// 1. PERSONAJES REALES (Cinemático 4K)
function renderRealStyle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: VideoScene,
  progress: number,
  time: number
) {
  // Golden Hour / Epic Dusk Gradient Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0c1427');
  skyGrad.addColorStop(0.35, '#1e1b4b');
  skyGrad.addColorStop(0.65, '#b45309');
  skyGrad.addColorStop(0.9, '#f59e0b');
  skyGrad.addColorStop(1, '#ea580c');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Glowing Sun / Light Source
  const sunX = width * 0.72;
  const sunY = height * 0.48;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.55);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  sunGlow.addColorStop(0.2, 'rgba(245, 158, 11, 0.45)');
  sunGlow.addColorStop(0.6, 'rgba(234, 88, 12, 0.12)');
  sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // Distant mountain ranges
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.72);
  ctx.lineTo(width * 0.25, height * 0.58);
  ctx.lineTo(width * 0.5, height * 0.65);
  ctx.lineTo(width * 0.8, height * 0.55);
  ctx.lineTo(width, height * 0.68);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Closer mountain ridge
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.78);
  ctx.lineTo(width * 0.35, height * 0.68);
  ctx.lineTo(width * 0.7, height * 0.76);
  ctx.lineTo(width, height * 0.72);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Foreground cliff / ground
  ctx.fillStyle = '#030712';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.86);
  ctx.bezierCurveTo(width * 0.3, height * 0.82, width * 0.6, height * 0.9, width, height * 0.85);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Cinematic Character Silhouette
  renderRealCharacterSilhouette(ctx, width, height, progress, time);

  // Lens Bokeh / Golden dust particles
  renderParticles(ctx, width, height, time, 'rgba(253, 224, 71, 0.5)');
}

function renderRealCharacterSilhouette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number
) {
  const cx = width * 0.45;
  const groundY = height * 0.86;
  const personHeight = height * 0.35;
  const headRadius = personHeight * 0.08;
  const headY = groundY - personHeight + headRadius;

  ctx.save();
  // Rim-light glow around character
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#090d16';

  // Head
  ctx.beginPath();
  ctx.arc(cx, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  // Neck & Shoulders
  ctx.beginPath();
  ctx.moveTo(cx - headRadius * 0.6, headY + headRadius * 0.8);
  ctx.lineTo(cx - headRadius * 2.2, headY + headRadius * 2.2); // Left shoulder
  ctx.lineTo(cx + headRadius * 2.2, headY + headRadius * 2.2); // Right shoulder
  ctx.lineTo(cx + headRadius * 0.6, headY + headRadius * 0.8);
  ctx.closePath();
  ctx.fill();

  // Body / Torso
  ctx.beginPath();
  ctx.moveTo(cx - headRadius * 2.2, headY + headRadius * 2.2);
  ctx.lineTo(cx + headRadius * 2.2, headY + headRadius * 2.2);
  ctx.lineTo(cx + headRadius * 1.5, groundY - personHeight * 0.4);
  ctx.lineTo(cx - headRadius * 1.5, groundY - personHeight * 0.4);
  ctx.closePath();
  ctx.fill();

  // Coat / Legs
  ctx.beginPath();
  ctx.moveTo(cx - headRadius * 1.5, groundY - personHeight * 0.4);
  ctx.lineTo(cx + headRadius * 1.5, groundY - personHeight * 0.4);
  ctx.lineTo(cx + headRadius * 1.8, groundY);
  ctx.lineTo(cx - headRadius * 1.8, groundY);
  ctx.closePath();
  ctx.fill();

  // Raised arm in determination if late in scene
  if (progress > 0.4) {
    const armRaise = Math.min(1, (progress - 0.4) / 0.3);
    ctx.lineWidth = headRadius * 0.9;
    ctx.strokeStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(cx + headRadius * 2.0, headY + headRadius * 2.2);
    ctx.lineTo(cx + headRadius * 3.5, headY + headRadius * (2.2 - armRaise * 2.5));
    ctx.stroke();
  }

  ctx.restore();
}

// 2. ANIMACIÓN 3D (Pixar / Unreal Style)
function render3DStyle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: VideoScene,
  progress: number,
  time: number
) {
  // Deep vibrant fantasy sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#1e1b4b');
  skyGrad.addColorStop(0.4, '#312e81');
  skyGrad.addColorStop(0.7, '#4338ca');
  skyGrad.addColorStop(1, '#065f46');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft reflective ground plane with 3D grid perspective
  render3DGroundGrid(ctx, width, height, time);

  // Floating 3D luminous crystals
  render3DFloatingCrystals(ctx, width, height, time);

  // 3D Character (Adorable Pixar-style Robot / Stylized Hero)
  render3DPixarCharacter(ctx, width, height, progress, time);

  // Magic glowing sparkles
  renderParticles(ctx, width, height, time, 'rgba(167, 139, 250, 0.7)');
}

function render3DGroundGrid(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const horizon = height * 0.72;
  const groundGrad = ctx.createLinearGradient(0, horizon, 0, height);
  groundGrad.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
  groundGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, horizon, width, height - horizon);

  // Glowing horizon line
  ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  ctx.lineTo(width, horizon);
  ctx.stroke();

  // 3D Perspective lines
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
  ctx.lineWidth = 1.5;
  for (let i = -5; i <= 15; i++) {
    const x = (width / 10) * i;
    ctx.beginPath();
    ctx.moveTo(width / 2, horizon);
    ctx.lineTo(x * 2.2, height);
    ctx.stroke();
  }
}

function render3DFloatingCrystals(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const crystals = [
    { x: width * 0.18, y: height * 0.38, size: 28, color: '#38bdf8' },
    { x: width * 0.82, y: height * 0.32, size: 36, color: '#f43f5e' },
    { x: width * 0.88, y: height * 0.62, size: 22, color: '#fbbf24' },
    { x: width * 0.12, y: height * 0.60, size: 20, color: '#34d399' }
  ];

  crystals.forEach((c, idx) => {
    const floatY = c.y + Math.sin(time * 2 + idx) * 12;
    ctx.save();
    ctx.translate(c.x, floatY);
    ctx.rotate(time * 0.5 + idx);

    // Glowing diamond
    ctx.shadowColor = c.color;
    ctx.shadowBlur = 20;

    const grad = ctx.createLinearGradient(-c.size, -c.size, c.size, c.size);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, c.color);
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -c.size);
    ctx.lineTo(c.size * 0.7, 0);
    ctx.lineTo(0, c.size);
    ctx.lineTo(-c.size * 0.7, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  });
}

function render3DPixarCharacter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number
) {
  const cx = width * 0.5;
  const cy = height * 0.64 + Math.sin(time * 3) * 6;
  const radius = width * 0.14;

  ctx.save();

  // Cast shadow on floor
  const shadowGrad = ctx.createRadialGradient(cx, height * 0.82, 5, cx, height * 0.82, radius * 1.5);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, height * 0.82, radius * 1.2, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Spherical Head (Subsurface scattering & gloss)
  const sphereGrad = ctx.createRadialGradient(
    cx - radius * 0.35,
    cy - radius * 0.35,
    radius * 0.1,
    cx,
    cy,
    radius
  );
  sphereGrad.addColorStop(0, '#ffffff');
  sphereGrad.addColorStop(0.3, '#c7d2fe');
  sphereGrad.addColorStop(0.7, '#6366f1');
  sphereGrad.addColorStop(1, '#312e81');

  ctx.shadowColor = '#818cf8';
  ctx.shadowBlur = 25;
  ctx.fillStyle = sphereGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Cute 3D glowing eyes
  const eyeRadius = radius * 0.28;
  const eyeSpacing = radius * 0.52;
  const blink = Math.sin(time * 4) > 0.95 ? 0.15 : 1.0;

  [-1, 1].forEach((dir) => {
    const eyeX = cx + dir * eyeSpacing;
    const eyeY = cy - radius * 0.08;

    // Eye socket
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, eyeRadius, eyeRadius * blink, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing cyan pupil
    if (blink > 0.3) {
      const pupilGrad = ctx.createRadialGradient(eyeX, eyeY, 2, eyeX, eyeY, eyeRadius * 0.8);
      pupilGrad.addColorStop(0, '#ffffff');
      pupilGrad.addColorStop(0.5, '#38bdf8');
      pupilGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = pupilGrad;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX - eyeRadius * 0.2, eyeY - eyeRadius * 0.25, eyeRadius * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Cheerful smile
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy + radius * 0.22, radius * 0.28, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Little floating antenna orb
  const antX = cx;
  const antY = cy - radius * 1.35;
  ctx.strokeStyle = '#c7d2fe';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(antX, antY);
  ctx.stroke();

  ctx.shadowColor = '#f43f5e';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(antX, antY, radius * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. ANIMACIÓN 2D (Anime / Acuarela Japonesa)
function render2DStyle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: VideoScene,
  progress: number,
  time: number
) {
  // Watercolor Anime Sky (Gradient wash)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#38bdf8');
  skyGrad.addColorStop(0.35, '#bae6fd');
  skyGrad.addColorStop(0.7, '#fed7aa');
  skyGrad.addColorStop(1, '#f472b6');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Stylized painterly clouds
  renderAnimeClouds(ctx, width, height, time);

  // Soft emerald hill
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.82);
  ctx.quadraticCurveTo(width * 0.4, height * 0.72, width, height * 0.78);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Foreground hill with cherry tree trunk
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.88);
  ctx.quadraticCurveTo(width * 0.6, height * 0.8, width, height * 0.9);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Cherry Tree Silhouetted Branch
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.2);
  ctx.quadraticCurveTo(width * 0.25, height * 0.22, width * 0.45, height * 0.35);
  ctx.stroke();

  // 2D Anime Hero Silhouette with waving scarf
  renderAnimeCharacter(ctx, width, height, progress, time);

  // Fluttering Sakura (Cherry Blossom) Petals
  renderSakuraPetals(ctx, width, height, time);
}

function renderAnimeClouds(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  const cloudOffset = (time * 12) % (width + 300);

  // Cloud 1
  ctx.beginPath();
  ctx.arc(cloudOffset - 100, height * 0.35, 60, 0, Math.PI * 2);
  ctx.arc(cloudOffset - 50, height * 0.3, 85, 0, Math.PI * 2);
  ctx.arc(cloudOffset + 20, height * 0.35, 65, 0, Math.PI * 2);
  ctx.fill();
}

function renderAnimeCharacter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number
) {
  const cx = width * 0.52;
  const groundY = height * 0.82;
  const charH = height * 0.28;

  ctx.save();
  ctx.fillStyle = '#1e1b4b';

  // Legs & Body
  ctx.beginPath();
  ctx.moveTo(cx - 15, groundY);
  ctx.lineTo(cx - 20, groundY - charH * 0.5);
  ctx.lineTo(cx + 20, groundY - charH * 0.5);
  ctx.lineTo(cx + 15, groundY);
  ctx.closePath();
  ctx.fill();

  // Torso / Jacket
  ctx.beginPath();
  ctx.moveTo(cx - 22, groundY - charH * 0.5);
  ctx.lineTo(cx - 28, groundY - charH * 0.8);
  ctx.lineTo(cx + 28, groundY - charH * 0.8);
  ctx.lineTo(cx + 22, groundY - charH * 0.5);
  ctx.closePath();
  ctx.fill();

  // Head with Anime Hair Tufts
  const headY = groundY - charH + 18;
  ctx.beginPath();
  ctx.arc(cx, headY, 18, 0, Math.PI * 2);
  ctx.fill();

  // Hair spikes
  ctx.beginPath();
  ctx.moveTo(cx - 18, headY);
  ctx.lineTo(cx - 28, headY - 8);
  ctx.lineTo(cx - 15, headY - 14);
  ctx.lineTo(cx - 5, headY - 26);
  ctx.lineTo(cx + 12, headY - 16);
  ctx.lineTo(cx + 24, headY - 8);
  ctx.lineTo(cx + 18, headY);
  ctx.closePath();
  ctx.fill();

  // Waving Red Scarf (Signature Anime Motif)
  const wave = Math.sin(time * 6) * 12;
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.moveTo(cx + 10, headY + 12);
  ctx.quadraticCurveTo(cx + 50, headY + 8 + wave, cx + 95, headY + 20 + wave * 1.5);
  ctx.lineTo(cx + 90, headY + 34 + wave * 1.5);
  ctx.quadraticCurveTo(cx + 45, headY + 20 + wave, cx + 10, headY + 22);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function renderSakuraPetals(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(251, 113, 133, 0.85)';
  for (let i = 0; i < 24; i++) {
    const x = ((i * 57 + time * 65) % (width + 60)) - 30;
    const y = ((i * 83 + time * 45) % (height + 60)) - 30;
    const rot = time * 2 + i;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// 4. MONIGOTES (Stickman Doodle / Whiteboard)
function renderMonigoteStyle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: VideoScene,
  progress: number,
  time: number
) {
  // Chalkboard dark slate texture with chalk smudges
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#111827');
  bgGrad.addColorStop(0.5, '#1e293b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Chalk smudges
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.beginPath();
  ctx.arc(width * 0.3, height * 0.4, width * 0.4, 0, Math.PI * 2);
  ctx.arc(width * 0.7, height * 0.7, width * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Hand-drawn ground chalk line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.setLineDash([12, 4, 8, 3]);
  ctx.beginPath();
  ctx.moveTo(width * 0.05, height * 0.78);
  ctx.lineTo(width * 0.95, height * 0.78);
  ctx.stroke();
  ctx.setLineDash([]);

  // Doodle Sun with rotating rays in top right
  renderDoodleSun(ctx, width, height, time);

  // Animated Monigote (Stick figure that walks/jumps/celebrates)
  renderAnimatedMonigote(ctx, width, height, progress, time);

  // Floating drawn heart / balloon
  renderDoodleMetaphors(ctx, width, height, progress, time);
}

function renderDoodleSun(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const sunX = width * 0.82;
  const sunY = height * 0.22;
  const radius = 28;

  ctx.save();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 3.5;
  ctx.fillStyle = 'rgba(253, 224, 71, 0.15)';

  // Sun face
  ctx.beginPath();
  ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Sun smile
  ctx.beginPath();
  ctx.arc(sunX, sunY + 4, 12, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  // Eyes
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(sunX - 7, sunY - 4, 2.5, 0, Math.PI * 2);
  ctx.arc(sunX + 7, sunY - 4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Rotating rays
  const rays = 8;
  for (let i = 0; i < rays; i++) {
    const angle = (Math.PI * 2 * i) / rays + time * 0.8;
    const r1 = radius + 8;
    const r2 = radius + 20 + Math.sin(time * 4 + i) * 4;
    ctx.beginPath();
    ctx.moveTo(sunX + Math.cos(angle) * r1, sunY + Math.sin(angle) * r1);
    ctx.lineTo(sunX + Math.cos(angle) * r2, sunY + Math.sin(angle) * r2);
    ctx.stroke();
  }

  ctx.restore();
}

function renderAnimatedMonigote(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number
) {
  // Monigote position animates horizontally across the screen
  const cx = width * (0.35 + progress * 0.3);
  const groundY = height * 0.78;
  const legLen = 50;
  const bodyLen = 65;
  const headR = 24;

  const walkCycle = Math.sin(time * 8);

  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Head (Circle with cute hand-drawn eyes and smile)
  const hipY = groundY - legLen;
  const neckY = hipY - bodyLen;
  const headY = neckY - headR;

  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.stroke();

  // Dot eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 7, headY - 3, 3, 0, Math.PI * 2);
  ctx.arc(cx + 7, headY - 3, 3, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.beginPath();
  ctx.arc(cx, headY + 3, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Spine / Body line
  ctx.beginPath();
  ctx.moveTo(cx, neckY);
  ctx.lineTo(cx, hipY);
  ctx.stroke();

  // Legs (Animated walk cycle)
  const leftLegAngle = walkCycle * 0.45;
  const rightLegAngle = -walkCycle * 0.45;

  // Left Leg
  ctx.beginPath();
  ctx.moveTo(cx, hipY);
  ctx.lineTo(cx + Math.sin(leftLegAngle) * legLen, hipY + Math.cos(leftLegAngle) * legLen);
  ctx.stroke();

  // Right Leg
  ctx.beginPath();
  ctx.moveTo(cx, hipY);
  ctx.lineTo(cx + Math.sin(rightLegAngle) * legLen, hipY + Math.cos(rightLegAngle) * legLen);
  ctx.stroke();

  // Arms (Animated swing or raising in victory)
  const armY = neckY + 18;
  const isCheering = progress > 0.65;

  if (isCheering) {
    // Both arms raised high in victory!
    ctx.beginPath();
    ctx.moveTo(cx, armY);
    ctx.lineTo(cx - 35, armY - 45 + Math.sin(time * 8) * 6);
    ctx.moveTo(cx, armY);
    ctx.lineTo(cx + 35, armY - 45 - Math.sin(time * 8) * 6);
    ctx.stroke();
  } else {
    // Walking arm swing
    ctx.beginPath();
    ctx.moveTo(cx, armY);
    ctx.lineTo(cx - walkCycle * 25, armY + 35);
    ctx.moveTo(cx, armY);
    ctx.lineTo(cx + walkCycle * 25, armY + 35);
    ctx.stroke();
  }

  ctx.restore();
}

function renderDoodleMetaphors(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number
) {
  // Drawn glowing heart floating above
  const hx = width * 0.5 + Math.sin(time * 2) * 20;
  const hy = height * 0.38 + Math.cos(time * 2.5) * 15;
  const hScale = 1.0 + Math.sin(time * 5) * 0.12;

  ctx.save();
  ctx.translate(hx, hy);
  ctx.scale(hScale, hScale);

  ctx.strokeStyle = '#f43f5e';
  ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(-18, -15, -35, 10, 0, 36);
  ctx.bezierCurveTo(35, 10, 18, -15, 0, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// AMBIENT PARTICLES (Bokeh, dust, or stars)
function renderParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  particles.forEach((p, idx) => {
    const x = ((p.x * width + Math.sin(time + p.phase) * 15) % width + width) % width;
    const y = (((p.y + p.speedY * time * 20) % 1 + 1) % 1) * height;
    const alpha = p.alpha * (0.6 + Math.sin(time * 2 + p.phase) * 0.4);

    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// VIGNETTE & FILM SCRIM
function renderCinematicVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: VisualStyleType
) {
  const vigGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.3,
    width / 2,
    height / 2,
    width * 0.85
  );
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(1, style === 'monigote' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.75)');
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, width, height);

  // Bottom text scrim gradient to guarantee subtitle legibility
  const bottomScrim = ctx.createLinearGradient(0, height * 0.65, 0, height);
  bottomScrim.addColorStop(0, 'rgba(0,0,0,0)');
  bottomScrim.addColorStop(0.5, 'rgba(0,0,0,0.6)');
  bottomScrim.addColorStop(1, 'rgba(0,0,0,0.92)');
  ctx.fillStyle = bottomScrim;
  ctx.fillRect(0, height * 0.65, width, height * 0.35);
}

// TOP HUD / HEADLINE
function renderTopHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: VideoScene,
  sceneIndex: number,
  totalScenes: number,
  style: VisualStyleType
) {
  ctx.save();

  // Upper Scene Badge (quiet unboxed metadata per Frontend Constitution)
  ctx.font = '600 13px var(--font-display, sans-serif)';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  const badgeText = `ESCENA ${sceneIndex + 1} DE ${totalScenes} · ${style.toUpperCase()}`;
  ctx.fillText(badgeText, width / 2, height * 0.08);

  // Scene Punch Headline
  ctx.font = '800 24px var(--font-display, sans-serif)';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 12;
  ctx.fillText(scene.headline.toUpperCase(), width / 2, height * 0.13);

  ctx.restore();
}

// SUBTITLES (High-contrast, karaoke word highlighting)
function renderSubtitles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: VideoScene,
  sceneProgress: number,
  style: VisualStyleType
) {
  const text = scene.voiceover;
  const words = text.split(' ');
  const totalWords = words.length;
  const activeWordIdx = Math.floor(sceneProgress * totalWords);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '700 20px var(--font-sans, sans-serif)';

  // Calculate wrap lines
  const maxLineW = width * 0.84;
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((w) => {
    const testLine = currentLine ? `${currentLine} ${w}` : w;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxLineW) {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);

  // Render Subtitle Background Glass Container
  const lineH = 28;
  const boxH = lines.length * lineH + 24;
  const boxY = height * 0.78 - boxH / 2;
  const boxW = width * 0.9;
  const boxX = (width - boxW) / 2;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;

  // Rounded rectangle
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 16);
  ctx.fill();
  ctx.stroke();

  // Render Subtitle Text lines with highlight
  let wordCounter = 0;
  lines.forEach((line, lineIdx) => {
    const lineY = boxY + 22 + lineIdx * lineH;
    const lineWords = line.split(' ');

    // Calculate start X to align centered
    const totalLineW = ctx.measureText(line).width;
    let curX = width / 2 - totalLineW / 2;

    lineWords.forEach((word) => {
      const isRead = wordCounter <= activeWordIdx;
      const isCurrent = wordCounter === activeWordIdx;

      if (isCurrent) {
        ctx.fillStyle = '#fbbf24'; // Active golden word
        ctx.font = '800 21px var(--font-sans, sans-serif)';
      } else if (isRead) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 20px var(--font-sans, sans-serif)';
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 20px var(--font-sans, sans-serif)';
      }

      ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 6;
      ctx.fillText(word, curX, lineY);

      const wordW = ctx.measureText(word + ' ').width;
      curX += wordW;
      wordCounter++;
    });
  });

  ctx.restore();
}

// BOTTOM TIMELINE BAR
function renderProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  totalProgress: number,
  currentTime: number,
  totalDuration: number
) {
  const barY = height - 12;
  const barH = 5;

  ctx.save();
  // Background track
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, barY, width, barH);

  // Active progress
  const fillW = Math.max(0, Math.min(width, width * totalProgress));
  const grad = ctx.createLinearGradient(0, barY, fillW, barY);
  grad.addColorStop(0, '#6366f1');
  grad.addColorStop(0.5, '#ec4899');
  grad.addColorStop(1, '#fbbf24');
  ctx.fillStyle = grad;
  ctx.fillRect(0, barY, fillW, barH);

  ctx.restore();
}
