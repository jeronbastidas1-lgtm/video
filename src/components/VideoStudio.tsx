import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoProject, VideoScene, VisualStyleType, AspectRatioType } from '../types/video';
import { renderVideoFrame } from '../utils/canvasRenderer';
import { audioSynthesizer } from '../utils/audioSynth';
import { videoRecorder } from '../utils/videoRecorder';
import { getCurrentSceneInfo } from '../utils/videoLogic';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Mic,
  MicOff,
  Maximize2,
  Smartphone,
  Monitor,
  Copy,
  Check,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Cpu,
  Zap,
  FileDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DownloadModal } from './DownloadModal';

interface VideoStudioProps {
  project: VideoProject;
  onUpdateProject: (updated: VideoProject) => void;
  onOpenConnectors: (initialScene?: VideoScene) => void;
  isDownloadOpen?: boolean;
  onToggleDownload?: (open: boolean) => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  project,
  onUpdateProject,
  onOpenConnectors,
  isDownloadOpen,
  onToggleDownload
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(project.aspectRatio || '9:16');
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [musicVolume, setMusicVolume] = useState<number>(0.35);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [internalDownloadOpen, setInternalDownloadOpen] = useState<boolean>(false);

  const isDownloadModalOpen = isDownloadOpen !== undefined ? isDownloadOpen : internalDownloadOpen;
  const setDownloadModalOpen = (open: boolean) => {
    if (onToggleDownload) {
      onToggleDownload(open);
    } else {
      setInternalDownloadOpen(open);
    }
  };

  const lastNarratedSceneRef = useRef<number>(-1);

  const totalDuration = project.durationSeconds || 45;

  // Speak voiceover line when a new scene enters
  const narrateScene = useCallback((scene: VideoScene) => {
    if (!voiceoverEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scene.voiceover);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))) 
      || voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [voiceoverEnabled]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas internal resolution based on aspect ratio
    if (aspectRatio === '9:16') {
      canvas.width = 720;
      canvas.height = 1280;
    } else {
      canvas.width = 1280;
      canvas.height = 720;
    }

    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setCurrentTime((prevTime) => {
        let newTime = prevTime;
        if (isPlaying) {
          newTime = prevTime + delta;
          if (newTime >= totalDuration) {
            newTime = totalDuration;
            setIsPlaying(false);
            audioSynthesizer.stop();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          }
        }

        const sceneInfo = getCurrentSceneInfo(project.scenes, newTime);
        const activeScene = sceneInfo.currentScene || project.scenes[0];

        // Trigger voice narration on scene change while playing
        if (isPlaying && sceneInfo.sceneIndex !== lastNarratedSceneRef.current) {
          lastNarratedSceneRef.current = sceneInfo.sceneIndex;
          setSelectedSceneIndex(sceneInfo.sceneIndex);
          if (activeScene) {
            narrateScene(activeScene);
          }
        }

        renderVideoFrame({
          canvas,
          scene: activeScene,
          sceneIndex: sceneInfo.sceneIndex,
          totalScenes: project.scenes.length,
          sceneProgress: sceneInfo.sceneProgress,
          totalProgress: Math.min(1, newTime / totalDuration),
          currentTime: newTime,
          totalDuration,
          style: project.style,
          aspectRatio,
          showSubtitles: true
        });

        return newTime;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, project, totalDuration, aspectRatio, narrateScene]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioSynthesizer.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      if (currentTime >= totalDuration - 0.5) {
        setCurrentTime(0);
        lastNarratedSceneRef.current = -1;
      }
      setIsPlaying(true);
      if (musicEnabled) {
        audioSynthesizer.start(project.musicTrack);
      }
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    lastNarratedSceneRef.current = -1;
    if (isPlaying) {
      if (musicEnabled) audioSynthesizer.start(project.musicTrack);
      const firstScene = project.scenes[0];
      if (firstScene) narrateScene(firstScene);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    const sceneInfo = getCurrentSceneInfo(project.scenes, newTime);
    setSelectedSceneIndex(sceneInfo.sceneIndex);
    lastNarratedSceneRef.current = sceneInfo.sceneIndex;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const jumpToScene = (index: number) => {
    let accumulated = 0;
    for (let i = 0; i < index; i++) {
      accumulated += project.scenes[i].duration;
    }
    handleSeek(accumulated + 0.1);
    setSelectedSceneIndex(index);
    if (isPlaying && project.scenes[index]) {
      narrateScene(project.scenes[index]);
    }
  };

  // Music Volume & Toggle
  const toggleMusic = () => {
    const nextState = !musicEnabled;
    setMusicEnabled(nextState);
    if (!nextState) {
      audioSynthesizer.stop();
    } else if (isPlaying) {
      audioSynthesizer.start(project.musicTrack);
    }
  };

  const handleVolumeChange = (v: number) => {
    setMusicVolume(v);
    audioSynthesizer.setVolume(v);
  };

  // Voiceover Toggle
  const toggleVoiceover = () => {
    const nextState = !voiceoverEnabled;
    setVoiceoverEnabled(nextState);
    if (!nextState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Export video (WebM/MP4) with fast rendering mode (3-4s) or real-time playback
  const handleExportVideo = async (mode: 'fast' | 'realtime' = 'fast') => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;

    setIsExporting(true);
    setExportProgress(0);

    // Stop normal playback, reset to start
    setIsPlaying(false);
    setCurrentTime(0);
    lastNarratedSceneRef.current = -1;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    // Start audio synthesizer stream
    audioSynthesizer.start(project.musicTrack);
    const audioStream = audioSynthesizer.getAudioStream();

    const started = videoRecorder.startRecording(canvas, audioStream, 30);
    if (!started) {
      setIsExporting(false);
      alert('Tu navegador no permite la grabación por MediaRecorder.');
      return;
    }

    const filename = `video-${project.genre}-${project.style}.webm`;

    if (mode === 'fast') {
      // Fast simulation: step through all scenes across ~3.2 seconds
      const totalSteps = 32;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const simulatedTime = (step / totalSteps) * totalDuration;
        setCurrentTime(simulatedTime);

        // Explicitly render this frame to ensure canvas captures all visual layers
        const sceneInfo = getCurrentSceneInfo(project.scenes, simulatedTime);
        const activeScene = sceneInfo.currentScene || project.scenes[0];
        renderVideoFrame({
          canvas,
          scene: activeScene,
          sceneIndex: sceneInfo.sceneIndex,
          totalScenes: project.scenes.length,
          sceneProgress: sceneInfo.sceneProgress,
          totalProgress: Math.min(1, simulatedTime / totalDuration),
          currentTime: simulatedTime,
          totalDuration,
          style: project.style,
          aspectRatio,
          showSubtitles: true
        });

        const pct = Math.floor((step / totalSteps) * 100);
        setExportProgress(Math.min(99, pct));

        if (step >= totalSteps) {
          clearInterval(interval);
          setTimeout(async () => {
            await videoRecorder.stopRecording(filename);
            audioSynthesizer.stop();
            setIsPlaying(false);
            setIsExporting(false);
            setExportProgress(100);
            confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });
          }, 250);
        }
      }, 100);
    } else {
      // Playback and record in real-time
      setIsPlaying(true);
      const checkInterval = setInterval(() => {
        setCurrentTime(curr => {
          const pct = Math.floor((curr / totalDuration) * 100);
          setExportProgress(Math.min(99, pct));

          if (curr >= totalDuration) {
            clearInterval(checkInterval);
            setTimeout(async () => {
              await videoRecorder.stopRecording(filename);
              audioSynthesizer.stop();
              setIsPlaying(false);
              setIsExporting(false);
              setExportProgress(100);
              confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
            }, 300);
          }
          return curr;
        });
      }, 250);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const activeSceneInfo = getCurrentSceneInfo(project.scenes, currentTime);
  const currentScene = activeSceneInfo.currentScene || project.scenes[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-sm">
      {/* Studio Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="uppercase text-indigo-400 font-bold">{project.genre}</span>
            <span>·</span>
            <span className="capitalize">{project.style}</span>
            <span>·</span>
            <span>{totalDuration} segundos</span>
            <span>·</span>
            <span>{project.scenes.length} escenas</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
            {project.title}
          </h2>
        </div>

        {/* Action Controls in Header */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Aspect Ratio Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setAspectRatio('9:16')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                aspectRatio === '9:16'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Formato vertical 9:16 para TikTok, Instagram Reels y YouTube Shorts"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 Vertical</span>
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('16:9')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Formato horizontal 16:9 para YouTube clásico y pantallas"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9 Panorámico</span>
            </button>
          </div>

          {/* Connectors button */}
          <button
            type="button"
            onClick={() => onOpenConnectors(currentScene)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Prompts Sora / Kling</span>
          </button>

          {/* Quick Direct Video Download */}
          <button
            type="button"
            onClick={() => handleExportVideo('fast')}
            disabled={isExporting}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            title="Genera y descarga el archivo de video (.webm / .mp4) inmediatamente"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? `Exportando (${exportProgress}%)...` : 'Descargar Video'}</span>
          </button>

          {/* Download Center Modal button */}
          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Abrir centro de descarga de archivos (Video, Guion .txt, Prompts .json, Fotograma .png)"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Descargar Archivos</span>
          </button>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left: Interactive Canvas Video Player (Cols 1-7 or 1-6) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            ref={containerRef}
            className={`relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 flex items-center justify-center transition-all ${
              aspectRatio === '9:16'
                ? 'w-full max-w-[340px] aspect-[9/16]'
                : 'w-full aspect-[16/9]'
            }`}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block cursor-pointer"
              onClick={togglePlay}
            />

            {/* Play Overlay if paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 hover:bg-indigo-500 transition-all backdrop-blur-sm cursor-pointer z-10"
                aria-label="Reproducir video"
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            )}

            {/* Live Recording Badge */}
            {isExporting && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse z-20">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>GRABANDO {exportProgress}%</span>
              </div>
            )}
          </div>

          {/* Player Playback Controls Bar */}
          <div className="w-full max-w-lg mt-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 shadow-md">
            {/* Timeline Scrub Slider */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {formatTime(totalDuration)}
              </span>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Reiniciar video desde el inicio"
                  aria-label="Reiniciar video"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Audio & Voiceover Toggles */}
              <div className="flex items-center gap-3">
                {/* Voiceover Speech Toggle */}
                <button
                  type="button"
                  onClick={toggleVoiceover}
                  className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                    voiceoverEnabled
                      ? 'bg-slate-800 border-indigo-500/50 text-indigo-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title={voiceoverEnabled ? 'Voz de narración activada (español)' : 'Voz de narración silenciada'}
                >
                  {voiceoverEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Voz IA</span>
                </button>

                {/* Music Synthesizer Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMusic}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      musicEnabled
                        ? 'bg-slate-800 border-indigo-500/50 text-indigo-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                    title={musicEnabled ? 'Banda sonora activada' : 'Banda sonora silenciada'}
                  >
                    {musicEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                  {musicEnabled && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={musicVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hidden sm:inline-block"
                      title="Volumen de música"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Storyboard Scenes & Specialized Prompts (Cols 7-12) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Storyboard de Escenas ({project.scenes.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Escena activa: #{activeSceneInfo.sceneIndex + 1}
            </span>
          </div>

          {/* Scene Cards List */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {project.scenes.map((scene, idx) => {
              const isActive = activeSceneInfo.sceneIndex === idx;
              return (
                <div
                  key={scene.id || idx}
                  onClick={() => jumpToScene(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-850/90 border-indigo-500/90 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  {/* Scene Header */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">
                        Escena {scene.sceneNumber}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">{scene.duration} seg</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 capitalize">{scene.cameraMotion.replace('_', ' ')}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenConnectors(scene);
                      }}
                      className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Ver Prompts</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Headline & Voiceover */}
                  <h4 className="text-sm font-bold text-white mb-1">
                    "{scene.headline}"
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    🔊 {scene.voiceover}
                  </p>

                  {/* Visual Description */}
                  <div className="mt-2 text-[11px] text-slate-400 flex items-start gap-1.5">
                    <span className="text-slate-500 shrink-0 font-medium">Visual:</span>
                    <span className="line-clamp-2">{scene.visualDescription}</span>
                  </div>

                  {/* Quick Copy Prompts Bar */}
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(scene.promptKling, `kling-${idx}`);
                        }}
                        className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copiar prompt listo para Kling AI"
                      >
                        {copiedPromptId === `kling-${idx}` ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>Kling AI</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(scene.promptSora, `sora-${idx}`);
                        }}
                        className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 hover:bg-purple-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copiar prompt listo para OpenAI Sora"
                      >
                        {copiedPromptId === `sora-${idx}` ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>Sora</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(scene.promptGrok, `grok-${idx}`);
                        }}
                        className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 hover:bg-amber-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copiar prompt listo para Grok Imagine"
                      >
                        {copiedPromptId === `grok-${idx}` ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>Grok</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500">
                      {isActive ? '● En reproducción' : 'Clic para saltar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Download Center Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        project={project}
        canvasRef={canvasRef}
        onStartVideoExport={handleExportVideo}
        isExporting={isExporting}
        exportProgress={exportProgress}
      />
    </div>
  );
};
