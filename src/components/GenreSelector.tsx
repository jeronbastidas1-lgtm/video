import React, { useState, useEffect } from 'react';
import { GenreType, VisualStyleType, IdeaItem } from '../types/video';
import { GENRES, generateIdeasForGenre } from '../utils/videoLogic';
import { Sparkles, RefreshCw, Compass, ArrowRight, Heart, Shield, Lightbulb, Smile, Flame, CloudSun } from 'lucide-react';

interface GenreSelectorProps {
  selectedGenre: GenreType;
  onSelectGenre: (genre: GenreType) => void;
  onApplyIdea: (idea: IdeaItem) => void;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenre,
  onSelectGenre,
  onApplyIdea
}) => {
  const [ideas, setIdeas] = useState<IdeaItem[]>(() => generateIdeasForGenre(selectedGenre, 4));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sourceLabel, setSourceLabel] = useState<string>('Ideas Creativas');

  const fetchIdeas = async (genre: GenreType) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, count: 4 })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ideas && data.ideas.length > 0) {
          const mapped: IdeaItem[] = data.ideas.map((item: any, idx: number) => ({
            id: `${genre}-ai-${Date.now()}-${idx}`,
            title: item.title,
            hook: item.hook,
            coreMessage: item.coreMessage,
            recommendedStyle: (item.recommendedStyle || 'real') as VisualStyleType,
            genre
          }));
          setIdeas(mapped);
          setSourceLabel('Generadas con Gemini 3.8 Flash');
          setIsLoading(false);
          return;
        }
      }
      // If server returned fallback or empty array, generate rich ideas immediately
      const fallbackIdeas = generateIdeasForGenre(genre, 4);
      setIdeas(fallbackIdeas);
      setSourceLabel('Ideas Creativas Seleccionadas');
      setIsLoading(false);
      return;
    } catch (err) {
      console.warn('Backend Gemini ideas not available, using procedural generator:', err);
    }

    // Procedural generation fallback: guarantees fresh unique ideas every time!
    const fallbackIdeas = generateIdeasForGenre(genre, 4);
    setIdeas(fallbackIdeas);
    setSourceLabel('Generador de Ideas Inteligente');
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIdeas(selectedGenre);
  }, [selectedGenre]);

  const handleGenreClick = (genre: GenreType) => {
    onSelectGenre(genre);
    // If clicking the currently active genre, regenerate ideas as requested!
    if (genre === selectedGenre) {
      fetchIdeas(genre);
    }
  };

  const getGenreIcon = (id: GenreType) => {
    switch (id) {
      case 'motivacion':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'esperanza':
        return <CloudSun className="w-4 h-4 text-sky-400" />;
      case 'amor':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'consejos':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case 'resiliencia':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      case 'paz_mental':
        return <Smile className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div id="generador" className="w-full">
      {/* Step 1 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Paso 1 · Elige el Género o Tema
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
            Mensajes que Tocan el Corazón
          </h2>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button
            type="button"
            onClick={() => fetchIdeas(selectedGenre)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Nuevas Ideas con IA</span>
          </button>
        </div>
      </div>

      {/* Genre Segmented Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
        {GENRES.map((genre) => {
          const isActive = selectedGenre === genre.id;
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => handleGenreClick(genre.id)}
              className={`p-2.5 rounded-lg text-left transition-all flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded bg-slate-950/50">
                  {getGenreIcon(genre.id)}
                </span>
                {isActive && (
                  <span className="text-[10px] text-indigo-400 font-mono">Activo</span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight truncate">
                  {genre.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Idea Cards Section */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">Opciones Inspiradoras Disponibles:</span>
            <span>·</span>
            <span className="text-slate-400 text-[11px]">{sourceLabel}</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Haz clic en "Usar esta idea" para auto-cargarla
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ideas.map((idea, idx) => (
            <div
              key={idea.id || idx}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-mono text-indigo-400">Opción {idx + 1}</span>
                  <span className="capitalize text-slate-400">Estilo: {idea.recommendedStyle}</span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {idea.title}
                </h4>

                <div className="mt-2 text-xs text-amber-300/90 italic bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg leading-relaxed">
                  "{idea.hook}"
                </div>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {idea.coreMessage}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">30-60 seg</span>
                <button
                  type="button"
                  onClick={() => onApplyIdea(idea)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Usar Idea</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
