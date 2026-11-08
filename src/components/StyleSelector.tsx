import React from 'react';
import { VisualStyleType } from '../types/video';
import { VISUAL_STYLES } from '../utils/videoLogic';
import { Sparkles, Camera, Box, Palette, Smile } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: VisualStyleType;
  onSelectStyle: (style: VisualStyleType) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle
}) => {
  const getIcon = (id: VisualStyleType) => {
    switch (id) {
      case 'real':
        return <Camera className="w-5 h-5 text-amber-400" />;
      case '3d':
        return <Box className="w-5 h-5 text-indigo-400" />;
      case '2d':
        return <Palette className="w-5 h-5 text-pink-400" />;
      case 'monigote':
        return <Smile className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div id="estilos" className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Paso 2 · Elige el Estilo Visual
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
            4 Estilos Cinematográficos y Artísticos
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 md:mt-0 max-w-md">
          El motor adaptará los fondos, personajes, iluminación y los prompts para Kling/Sora según este estilo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VISUAL_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/15 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header with icon & badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                    {getIcon(style.id)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700/40">
                    {style.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white tracking-tight">
                  {style.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {style.description}
                </p>

                {/* Key visual bullets */}
                <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-800/60">
                  {style.visualCharacteristics.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection indicator pill-free button status */}
              <div className="mt-4 pt-2 flex items-center justify-between text-xs font-semibold">
                <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
                  {isSelected ? '✓ Estilo Seleccionado' : 'Seleccionar'}
                </span>
                {isSelected && (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
