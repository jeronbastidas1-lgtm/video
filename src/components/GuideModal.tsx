import React from 'react';
import { X, Sparkles, Film, Clock, Cpu, Heart, CheckCircle2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Guía de Producción de Videos de Alto Impacto
              </h3>
              <p className="text-xs text-slate-400">
                Aprende a crear videos virales de 30 a 60 segundos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">1</span>
              <span>Elige el Género y Descubre Nuevas Ideas</span>
            </h4>
            <p className="text-slate-400 pl-7">
              Selecciona temas como <strong>Motivación, Esperanza, Amor, Consejos, Resiliencia o Paz Mental</strong>. Cada vez que toques el botón o el mismo género, el sistema creará ideas frescas con ganchos iniciales irresistibles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">2</span>
              <span>Selecciona tu Estilo Visual Favorito</span>
            </h4>
            <p className="text-slate-400 pl-7">
              Puedes elegir entre <strong>Personajes Reales</strong> (estética cinematográfica fotorrealista), <strong>Animación 3D</strong> (personajes expresivos estilo Pixar), <strong>Animación 2D</strong> (anime tradicional con acuarelas), o <strong>Monigotes</strong> (dibujos de palitos sobre pizarra llenos de ternura).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">3</span>
              <span>Reproduce y Descarga Directamente</span>
            </h4>
            <p className="text-slate-400 pl-7">
              El reproductor integrado sintetiza música ambiental orquestal y voz narrada en español con subtítulos dinámicos tipo karaoke. Pulsa <strong>"Descargar Video"</strong> para obtener tu video en formato WebM/MP4 listo para TikTok, Instagram Reels o Shorts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">4</span>
              <span>Conexión con Sora, Kling y Grok</span>
            </h4>
            <p className="text-slate-400 pl-7">
              Si deseas renderizar con supercomputación externa, pulsa <strong>"Prompts Sora / Kling"</strong> para copiar los guiones con parámetros de cámara y dirección listos para usar en Kling AI, OpenAI Sora, Grok o Pollinations gratuito.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            ¡Entendido, a Crear!
          </button>
        </div>
      </div>
    </div>
  );
};
