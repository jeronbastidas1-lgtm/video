import React, { useState } from 'react';
import { VideoProject, VideoScene } from '../types/video';
import { AI_PLATFORMS, exportScreenplayForPlatform, getFreeAIVisualUrl } from '../utils/aiConnectors';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Sparkles,
  Download,
  Film,
  Camera,
  Play
} from 'lucide-react';

interface AIConnectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  activeScene?: VideoScene;
}

export const AIConnectorsModal: React.FC<AIConnectorsModalProps> = ({
  isOpen,
  onClose,
  project,
  activeScene
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'pollinations_free' | 'kling' | 'sora' | 'grok' | 'luma'>('pollinations_free');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [freePreviewSceneIdx, setFreePreviewSceneIdx] = useState<number>(0);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sceneToDisplay = activeScene || project.scenes[freePreviewSceneIdx] || project.scenes[0];

  const fullExportText = selectedPlatform !== 'pollinations_free' 
    ? exportScreenplayForPlatform(project, selectedPlatform)
    : '';

  const freeVisualUrl = sceneToDisplay
    ? getFreeAIVisualUrl(sceneToDisplay.visualDescription, project.style, 720, 1280)
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Conexión con Motores de Video IA
              </h3>
              <p className="text-xs text-slate-400">
                Renderizado libre con Pollinations AI y prompts optimizados para Sora, Kling, Grok y Luma
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

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-900/40 overflow-x-auto">
          {AI_PLATFORMS.map((platform) => {
            const isSelected = selectedPlatform === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 text-white bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                }`}
              >
                <span>{platform.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${platform.badgeColor}`}>
                  {platform.isFreeDirect ? 'Gratis' : 'Cine 4K'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: Pollinations Free AI Video Engine */}
          {selectedPlatform === 'pollinations_free' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed">
                <span className="font-bold text-white block mb-1">
                  ⚡ Generador Gratuito Inmediato (Sin API Key ni Registro)
                </span>
                Pollinations AI genera fotogramas y texturas visuales hiper-realistas mediante modelos abiertos de difusión. 
                Abajo puedes previsualizar en vivo cómo interpreta la IA la escena seleccionada en estilo <strong className="text-white capitalize">{project.style}</strong>.
              </div>

              {/* Scene picker */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-slate-400 font-semibold shrink-0">Escena a Generar:</span>
                {project.scenes.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => setFreePreviewSceneIdx(idx)}
                    className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
                      freePreviewSceneIdx === idx
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Escena {s.sceneNumber}
                  </button>
                ))}
              </div>

              {/* Free AI Image / Clip Visual Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="relative aspect-[9/16] max-h-[380px] mx-auto rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group">
                  <img
                    src={freeVisualUrl}
                    alt={sceneToDisplay?.headline || 'Visual escena'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white drop-shadow">
                      {sceneToDisplay?.headline}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-mono">
                    PROMPT GENERADO PARA LA IA:
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                    "{sceneToDisplay?.visualDescription}, estilo {project.style}"
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(freeVisualUrl, 'free-url')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'free-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copiar Enlace Directo</span>
                    </button>

                    <a
                      href={freeVisualUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>Abrir Imagen en HD</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2, 3, 4, 5: Kling, Sora, Grok, Luma */}
          {selectedPlatform !== 'pollinations_free' && (
            <div className="space-y-6">
              {/* Platform Info Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white capitalize">
                    Integración Profesional con {selectedPlatform.toUpperCase()}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Guion formateado con directivas de cámara, iluminación, física y duración lista para renderizar.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(fullExportText, 'full-script')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedKey === 'full-script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Guion Completo</span>
                  </button>

                  <a
                    href={AI_PLATFORMS.find(p => p.id === selectedPlatform)?.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>Ir a {selectedPlatform.toUpperCase()}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Scene Prompt Breakdown */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Prompts Individuales por Escena:
                </span>

                <div className="space-y-3">
                  {project.scenes.map((scene) => {
                    const prompt = selectedPlatform === 'kling'
                      ? scene.promptKling
                      : selectedPlatform === 'sora'
                      ? scene.promptSora
                      : selectedPlatform === 'grok'
                      ? scene.promptGrok
                      : scene.promptLuma;

                    return (
                      <div
                        key={scene.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-indigo-400">
                            Escena {scene.sceneNumber} ({scene.duration}s) · {scene.headline}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(prompt, `scene-${scene.sceneNumber}`)}
                            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                          >
                            {copiedKey === `scene-${scene.sceneNumber}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>Copiar Prompt</span>
                          </button>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
                          {prompt}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>InspiraVideo AI Studio · Compatible con Sora, Kling v1.5, Grok y Pollinations</span>
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
