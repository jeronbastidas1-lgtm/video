import React from 'react';
import { Sparkles, Film, Cpu, HelpCircle, Download } from 'lucide-react';

interface NavbarProps {
  onNewVideoClick: () => void;
  onOpenConnectors: () => void;
  onOpenGuide: () => void;
  onOpenDownload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewVideoClick,
  onOpenConnectors,
  onOpenGuide,
  onOpenDownload
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark in display face */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-indigo-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span>InspiraVideo AI</span>
        </a>

        {/* Zone 2: clean single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#estilos"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Estilos Visuales
          </a>
          <a
            href="#generador"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Generador & Guion
          </a>
          <button
            type="button"
            onClick={onOpenConnectors}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
          >
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Conectar Sora / Kling</span>
          </button>
          {onOpenDownload && (
            <button
              type="button"
              onClick={onOpenDownload}
              className="text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Descargar Archivos</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenGuide}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Guía de Creación</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onNewVideoClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crear Video Ahora</span>
          </button>
        </div>
      </div>
    </header>
  );
};
