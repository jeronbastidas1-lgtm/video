import { VideoScene, VisualStyleType, VideoProject } from '../types/video';

export interface AIPlatformConfig {
  id: 'kling' | 'sora' | 'grok' | 'luma' | 'pollinations_free';
  name: string;
  badge: string;
  badgeColor: string;
  isFreeDirect: boolean;
  websiteUrl: string;
  description: string;
}

export const AI_PLATFORMS: AIPlatformConfig[] = [
  {
    id: 'pollinations_free',
    name: 'Pollinations AI Video',
    badge: '100% Gratis / Sin Registro',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    isFreeDirect: true,
    websiteUrl: 'https://pollinations.ai',
    description: 'Motor de Inteligencia Artificial abierto y gratuito para generación inmediata de visuales y clips en tiempo récord.'
  },
  {
    id: 'kling',
    name: 'Kling AI v1.5',
    badge: 'Ultra Realismo & Movimiento',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    isFreeDirect: false,
    websiteUrl: 'https://klingai.com',
    description: 'Generador de video de última generación con control de cámara cinematográfico y física de movimiento fluida.'
  },
  {
    id: 'sora',
    name: 'OpenAI Sora',
    badge: 'Coherencia Fotorrealista',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    isFreeDirect: false,
    websiteUrl: 'https://sora.com',
    description: 'Modelo de difusión de OpenAI para videos de alta fidelidad con simulación física y temporal precisa.'
  },
  {
    id: 'grok',
    name: 'Grok Imagine Video',
    badge: 'Rápido & Conceptual',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    isFreeDirect: false,
    websiteUrl: 'https://x.com/i/grok',
    description: 'Generación acelerada de escenas y dinamismo visual integrado en el ecosistema xAI.'
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    badge: 'Cámara Suave & Acción',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    isFreeDirect: false,
    websiteUrl: 'https://lumalabs.ai/dream-machine',
    description: 'Renderizado de video de alta calidad a partir de descripciones cinematográficas detalladas.'
  }
];

/**
 * Generate a free AI visual URL for a scene using Pollinations AI
 */
export function getFreeAIVisualUrl(
  prompt: string,
  style: VisualStyleType,
  width: number = 720,
  height: number = 1280
): string {
  const stylePromptMap: Record<VisualStyleType, string> = {
    real: 'photorealistic cinematic 35mm film photograph, golden hour, 4k, ultra detailed, depth of field',
    '3d': '3d pixar disney style animated movie render, octane render, soft subsurface scattering, vibrant lighting',
    '2d': 'makoto shinkai anime watercolor illustration, hand-drawn traditional 2d animation, clean lines',
    monigote: 'whiteboard chalkboard stickman doodle, chalk illustration on slate, minimalist heartfelt sketch'
  };

  const fullPrompt = `${prompt}, ${stylePromptMap[style]}`;
  const cleanPrompt = encodeURIComponent(fullPrompt.slice(0, 180));
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&nologo=true&enhance=true`;
}

/**
 * Format full screenplay ready to copy/paste into Kling, Sora or Grok
 */
export function exportScreenplayForPlatform(
  project: VideoProject,
  platformId: 'kling' | 'sora' | 'grok' | 'luma'
): string {
  let output = `🎬 GUION Y PROMPTS PARA ${platformId.toUpperCase()}\n`;
  output += `Título: ${project.title}\n`;
  output += `Género: ${project.genre.toUpperCase()} | Estilo: ${project.style.toUpperCase()}\n`;
  output += `Duración Total: ${project.durationSeconds} segundos (${project.scenes.length} escenas)\n`;
  output += `Relación de Aspecto: ${project.aspectRatio}\n`;
  output += `--------------------------------------------------\n\n`;

  project.scenes.forEach((scene) => {
    output += `[ESCENA ${scene.sceneNumber}] (${scene.duration} seg) - ${scene.headline}\n`;
    output += `Locución (Voz): "${scene.voiceover}"\n`;
    output += `Descripción: ${scene.visualDescription}\n`;
    output += `Cámara: ${scene.cameraMotion}\n`;

    if (platformId === 'kling') {
      output += `Prompt Kling AI:\n${scene.promptKling}\n`;
      output += `Negative Prompt: blurry, deformed, low quality, distorted anatomy, text, watermark\n`;
    } else if (platformId === 'sora') {
      output += `Prompt OpenAI Sora:\n${scene.promptSora}\n`;
    } else if (platformId === 'grok') {
      output += `Prompt Grok Video:\n${scene.promptGrok}\n`;
    } else if (platformId === 'luma') {
      output += `Prompt Luma Dream Machine:\n${scene.promptLuma}\n`;
    }
    output += `\n`;
  });

  output += `Texto Completo de Locución Continuo:\n"${project.fullScript}"\n`;
  return output;
}
