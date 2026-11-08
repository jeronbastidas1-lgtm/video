/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GenreType, VisualStyleType, VideoProject, IdeaItem, VideoScene } from './types/video';
import { buildProceduralProject } from './utils/videoLogic';
import { Navbar } from './components/Navbar';
import { GenreSelector } from './components/GenreSelector';
import { StyleSelector } from './components/StyleSelector';
import { PromptGeneratorForm } from './components/PromptGeneratorForm';
import { VideoStudio } from './components/VideoStudio';
import { AIConnectorsModal } from './components/AIConnectorsModal';
import { GuideModal } from './components/GuideModal';
import { Sparkles, Film, ArrowDown, ShieldCheck, Zap, Download } from 'lucide-react';

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState<GenreType>('motivacion');
  const [selectedStyle, setSelectedStyle] = useState<VisualStyleType>('real');
  const [topicText, setTopicText] = useState<string>('Nadie Puede Detenerte si Decides Continuar');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active Project (Initialized with a high-fidelity starter project)
  const [project, setProject] = useState<VideoProject>(() => {
    return buildProceduralProject(
      'Nadie Puede Detenerte si Decides Continuar',
      'motivacion',
      'real',
      45,
      '9:16'
    );
  });

  // Modals state
  const [isConnectorsOpen, setIsConnectorsOpen] = useState<boolean>(false);
  const [activeConnectorScene, setActiveConnectorScene] = useState<VideoScene | undefined>(undefined);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const handleApplyIdea = (idea: IdeaItem) => {
    setSelectedGenre(idea.genre);
    setSelectedStyle(idea.recommendedStyle);
    setTopicText(idea.title);

    // Auto-generate a project with this idea!
    const newProject = buildProceduralProject(
      idea.title,
      idea.genre,
      idea.recommendedStyle,
      45,
      '9:16'
    );
    setProject(newProject);

    // Smooth scroll down to the studio
    const studioEl = document.getElementById('estudio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenConnectors = (scene?: VideoScene) => {
    setActiveConnectorScene(scene);
    setIsConnectorsOpen(true);
  };

  const handleNewVideoFocus = () => {
    const generatorEl = document.getElementById('generador');
    if (generatorEl) {
      generatorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Bar following contract */}
      <Navbar
        onNewVideoClick={handleNewVideoFocus}
        onOpenConnectors={() => handleOpenConnectors()}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <section className="relative text-center py-6 sm:py-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Motor Inteligente de Videos Motivacionales de 30 a 60 Segundos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            Genera Videos Emotivos de Motivación, Amor y Consejos en Cualquier Estilo
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Crea escenas con personajes reales, animación 3D, anime 2D o monigotes de palo. 
            Visualiza en vivo con música orquestal, voz en español y exporta o conéctate directamente con <strong>OpenAI Sora</strong>, <strong>Kling AI</strong> y <strong>Grok</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleNewVideoFocus}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Empezar a Crear</span>
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenConnectors()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Conectores Sora / Kling</span>
            </button>
          </div>
        </section>

        {/* Step 1: Genre Selector & Dynamic AI Ideas */}
        <section>
          <GenreSelector
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
            onApplyIdea={handleApplyIdea}
          />
        </section>

        {/* Step 2: Visual Style Selector (Real, 3D, 2D, Monigote) */}
        <section>
          <StyleSelector
            selectedStyle={selectedStyle}
            onSelectStyle={(newStyle) => {
              setSelectedStyle(newStyle);
              // Re-render project with updated style
              const updated = buildProceduralProject(
                topicText || project.title,
                selectedGenre,
                newStyle,
                project.durationSeconds,
                project.aspectRatio
              );
              setProject(updated);
            }}
          />
        </section>

        {/* Step 3: Prompt & Duration Form */}
        <section>
          <PromptGeneratorForm
            selectedGenre={selectedGenre}
            selectedStyle={selectedStyle}
            topicText={topicText}
            setTopicText={setTopicText}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            onProjectGenerated={(newProj) => {
              setProject(newProj);
              const studioEl = document.getElementById('estudio');
              if (studioEl) {
                studioEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </section>

        {/* Step 4: Primary Video Studio & Canvas Player */}
        <section id="estudio">
          <div className="mb-4">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Paso 4 · Reproductor y Renderizador Cinemático
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
              Estudio de Reproducción, Voz y Descarga
            </h2>
          </div>

          <VideoStudio
            project={project}
            onUpdateProject={setProject}
            onOpenConnectors={handleOpenConnectors}
          />
        </section>

        {/* Trust Badges & Tech Specifications Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Renderizado Local a 60 FPS
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Renderizado en Canvas HTML5 sin marcas de agua con cámara dinámica (pan/zoom) y música sintetizada.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Conectores Sora, Kling y Grok
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Prompts profesionales estructurados con tokens de cámara, iluminación y coherencia listos para copiar.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                4 Estilos Cinematográficos
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Personajes reales, animación 3D Pixar, estética 2D anime tradicional y monigotes de palo en pizarra.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© InspiraVideo AI · Estudio Creativo de Videos Motivacionales</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Motivación</span>
            <span>·</span>
            <span>Esperanza</span>
            <span>·</span>
            <span>Amor</span>
            <span>·</span>
            <span>Sabiduría</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AIConnectorsModal
        isOpen={isConnectorsOpen}
        onClose={() => setIsConnectorsOpen(false)}
        project={project}
        activeScene={activeConnectorScene}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
