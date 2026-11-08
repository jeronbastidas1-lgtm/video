import React, { useState } from 'react';
import { VideoProject } from '../types/video';
import {
  downloadTextFile,
  downloadJsonFile,
  downloadCanvasFrame,
  generateScriptText
} from '../utils/fileDownloader';
import {
  X,
  Download,
  Film,
  FileText,
  FileCode,
  Image,
  CheckCircle2,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onStartVideoExport: (mode: 'fast' | 'realtime') => void;
  isExporting: boolean;
  exportProgress: number;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  project,
  canvasRef,
  onStartVideoExport,
  isExporting,
  exportProgress
}) => {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadScript = () => {
    const content = generateScriptText(project);
    const filename = `guion-${project.genre}-${project.style}.txt`;
    downloadTextFile(filename, content);
    setDownloadedItem('script');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setDownloadedItem(null), 3000);
  };

  const handleDownloadJson = () => {
    const filename = `proyecto-${project.genre}-${project.style}.json`;
    downloadJsonFile(filename, project);
    setDownloadedItem('json');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setDownloadedItem(null), 3000);
  };

  const handleDownloadFrame = () => {
    if (canvasRef.current) {
      const filename = `fotograma-${project.title.slice(0, 20)}.png`;
      downloadCanvasFrame(canvasRef.current, filename);
      setDownloadedItem('frame');
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setDownloadedItem(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Centro de Descarga de Archivos
              </h3>
              <p className="text-xs text-slate-400">
                Descarga el video generado, el guion de locución o el paquete de prompts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Primary Action Card: Download Video */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30">
                  <Film className="w-3 h-3" />
                  <span>Video Cinemático Completo (.webm / .mp4)</span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  {project.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  Incluye animación en estilo <strong className="text-white capitalize">{project.style}</strong>, banda sonora orquestal sincronizada, subtítulos dinámicos y proporciones {project.aspectRatio}.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onStartVideoExport('fast')}
                  disabled={isExporting}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Zap className="w-4 h-4 text-emerald-200" />
                  <span>{isExporting ? `Renderizando (${exportProgress}%)...` : 'Descarga Rápida Directa'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartVideoExport('realtime')}
                  disabled={isExporting}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Graba mientras reproduces el video en tiempo real"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Grabar en Tiempo Real</span>
                </button>
              </div>
            </div>

            {/* Progress bar if exporting */}
            {isExporting && (
              <div className="mt-4 pt-3 border-t border-indigo-500/20">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span className="font-mono text-indigo-300">Generando archivo de video...</span>
                  <span className="font-mono font-bold text-white">{exportProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-400 transition-all duration-200"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Secondary Download Cards Grid */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Otros Archivos Listos para Descarga Inmediata:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Guion de Locución (.txt) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-400 mb-2.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-white">
                    Guion de Locución (.txt)
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Texto completo para teleprónter con tiempos por escena y desgloses.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadScript}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {downloadedItem === 'script' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Descargado!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar .txt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Paquete de Prompts IA (.json) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400 mb-2.5">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-white">
                    Prompts Sora/Kling (.json)
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Estructura técnica con prompts optimizados para IA externa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {downloadedItem === 'json' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Descargado!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar .json</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 3: Fotograma de Escena Actual (.png) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 mb-2.5">
                    <Image className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-white">
                    Fotograma HD (.png)
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Imagen de portada en alta resolución capturada del reproductor.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadFrame}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {downloadedItem === 'frame' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Descargado!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar .png</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Los archivos se descargan directamente en tu carpeta de Descargas</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
