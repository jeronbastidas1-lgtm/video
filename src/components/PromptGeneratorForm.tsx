import React, { useState } from 'react';
import { GenreType, VisualStyleType, VideoProject } from '../types/video';
import { Sparkles, Clock, Music, Wand2, Loader2, ArrowRight } from 'lucide-react';
import { buildProceduralProject } from '../utils/videoLogic';

interface PromptGeneratorFormProps {
  selectedGenre: GenreType;
  selectedStyle: VisualStyleType;
  onProjectGenerated: (project: VideoProject) => void;
  isGenerating: boolean;
  setIsGenerating: (state: boolean) => void;
  topicText: string;
  setTopicText: (t: string) => void;
}

export const PromptGeneratorForm: React.FC<PromptGeneratorFormProps> = ({
  selectedGenre,
  selectedStyle,
  onProjectGenerated,
  isGenerating,
  setIsGenerating,
  topicText,
  setTopicText
}) => {
  const [duration, setDuration] = useState<number>(45); // 30, 45, 60
  const [musicTrack, setMusicTrack] = useState<'epic_orchestral' | 'ambient_piano' | 'cinematic_inspiring' | 'gentle_acoustic'>('cinematic_inspiring');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const effectiveTopic = topicText.trim() || `Mensaje profundo de ${selectedGenre.toUpperCase()}`;

    try {
      const response = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: effectiveTopic,
          genre: selectedGenre,
          style: selectedStyle,
          durationSeconds: duration
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.script && data.script.scenes && data.script.scenes.length > 0) {
          const project: VideoProject = {
            id: `project-${Date.now()}`,
            title: data.script.title || effectiveTopic,
            genre: selectedGenre,
            style: selectedStyle,
            durationSeconds: duration,
            aspectRatio: '9:16',
            musicTrack,
            scenes: data.script.scenes.map((s: any, idx: number) => ({
              id: `scene-${idx + 1}-${Date.now()}`,
              sceneNumber: s.sceneNumber || idx + 1,
              duration: s.duration || Math.round(duration / data.script.scenes.length),
              headline: s.headline || `Escena ${idx + 1}`,
              voiceover: s.voiceover || '',
              visualDescription: s.visualDescription || '',
              cameraMotion: s.cameraMotion || 'zoom_in',
              characterStyle: selectedStyle,
              promptSora: s.promptSora || '',
              promptKling: s.promptKling || '',
              promptGrok: s.promptGrok || '',
              promptLuma: s.promptLuma || ''
            })),
            fullScript: data.script.fullScript || '',
            createdAt: Date.now()
          };

          onProjectGenerated(project);
          setIsGenerating(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend generation failed, creating procedural screenplay:', err);
    }

    // Procedural generation fallback
    const fallbackProject = buildProceduralProject(
      effectiveTopic,
      selectedGenre,
      selectedStyle,
      duration,
      '9:16'
    );
    fallbackProject.musicTrack = musicTrack;
    onProjectGenerated(fallbackProject);
    setIsGenerating(false);
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-xl">
      <div className="mb-4">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Paso 3 · Personaliza tu Video
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight mt-1">
          Tema, Duración (30 a 60 Segundos) y Banda Sonora
        </h3>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Main Topic Input */}
        <div>
          <label htmlFor="topic-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
            ¿Cuál es el mensaje o lección central de este video?
          </label>
          <div className="relative">
            <input
              id="topic-input"
              type="text"
              value={topicText}
              onChange={(e) => setTopicText(e.target.value)}
              placeholder="Ej. El dolor de hoy es la fuerza de mañana; nunca es tarde para renacer..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Duration and Music Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Duration Selector (30s, 45s, 60s) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Duración del Video</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all border cursor-pointer ${
                    duration === d
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {d} Segundos
                </button>
              ))}
            </div>
          </div>

          {/* Music Track Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              <span>Banda Sonora Sintetizada</span>
            </label>
            <select
              value={musicTrack}
              onChange={(e) => setMusicTrack(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="cinematic_inspiring">Cinemática Inspiradora (Cuerdas y Piano)</option>
              <option value="epic_orchestral">Épica Orquestal (Progresión Heroica)</option>
              <option value="ambient_piano">Piano Acústico y Drone Cálido</option>
              <option value="gentle_acoustic">Acústica Suave y Reflexiva</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Escribiendo Guion y Renderizando Escenas ({duration}s)...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generar Video de {duration}s en Estilo {selectedStyle.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
