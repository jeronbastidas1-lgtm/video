import { VideoProject } from '../types/video';

/**
 * Utility for instant file generation and download (Video, Text Script, JSON Prompts, PNG Poster)
 */

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export function downloadJsonFile(filename: string, data: any) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export function downloadCanvasFrame(canvas: HTMLCanvasElement, filename: string = 'fotograma-escena.png') {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }, 'image/png');
}

/**
 * Generates formatted readable text file for voice actors, teleprompter and video editors
 */
export function generateScriptText(project: VideoProject): string {
  let text = `====================================================================\n`;
  text += `🎬 INSPIRAVISION AI - GUION DE VIDEO MOTIVACIONAL\n`;
  text += `====================================================================\n`;
  text += `TÍTULO: ${project.title}\n`;
  text += `GÉNERO: ${project.genre.toUpperCase()}\n`;
  text += `ESTILO VISUAL: ${project.style.toUpperCase()}\n`;
  text += `DURACIÓN TOTAL: ${project.durationSeconds} SEGUNDOS\n`;
  text += `RELACIÓN DE ASPECTO: ${project.aspectRatio}\n`;
  text += `FECHA DE CREACIÓN: ${new Date(project.createdAt).toLocaleString()}\n`;
  text += `====================================================================\n\n`;

  text += `[LOCUCIÓN CONTINUA COMPLETA / VOICEOVER]\n`;
  text += `"${project.fullScript}"\n\n`;
  text += `--------------------------------------------------------------------\n`;
  text += `DESGLOSE ESCENA POR ESCENA CON TIEMPOS Y PROMPTS\n`;
  text += `--------------------------------------------------------------------\n\n`;

  let currentTime = 0;
  project.scenes.forEach((scene) => {
    const startTime = currentTime;
    const endTime = currentTime + scene.duration;
    currentTime = endTime;

    text += `▶ ESCENA ${scene.sceneNumber}: "${scene.headline}"\n`;
    text += `  Tiempo: [${formatSeconds(startTime)} -> ${formatSeconds(endTime)}] (${scene.duration} seg)\n`;
    text += `  Cámara: ${scene.cameraMotion}\n`;
    text += `  Voz en Off: "${scene.voiceover}"\n`;
    text += `  Descripción Visual: ${scene.visualDescription}\n`;
    text += `  ---\n`;
    text += `  PROMPT SORA: ${scene.promptSora}\n`;
    text += `  PROMPT KLING AI: ${scene.promptKling}\n`;
    text += `  PROMPT GROK: ${scene.promptGrok}\n`;
    text += `\n`;
  });

  text += `====================================================================\n`;
  text += `Generado automáticamente por InspiraVideo AI Studio\n`;
  return text;
}

function formatSeconds(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
