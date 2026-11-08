export type GenreType = 
  | 'motivacion'
  | 'esperanza'
  | 'amor'
  | 'consejos'
  | 'resiliencia'
  | 'paz_mental';

export type VisualStyleType = 'real' | '3d' | '2d' | 'monigote';

export type CameraMotion = 'pan_left' | 'pan_right' | 'zoom_in' | 'zoom_out' | 'tilt_up';

export type AspectRatioType = '9:16' | '16:9';

export interface GenreDefinition {
  id: GenreType;
  name: string;
  tagline: string;
  iconName: string;
  gradient: string;
  description: string;
}

export interface StyleDefinition {
  id: VisualStyleType;
  name: string;
  subtitle: string;
  badge: string;
  iconName: string;
  description: string;
  visualCharacteristics: string[];
}

export interface IdeaItem {
  id: string;
  title: string;
  hook: string;
  coreMessage: string;
  recommendedStyle: VisualStyleType;
  genre: GenreType;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  duration: number; // in seconds
  headline: string;
  voiceover: string;
  visualDescription: string;
  cameraMotion: CameraMotion;
  characterStyle: VisualStyleType;
  promptSora: string;
  promptKling: string;
  promptGrok: string;
  promptLuma: string;
  accentColor?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  genre: GenreType;
  style: VisualStyleType;
  durationSeconds: number; // 30, 45, or 60
  aspectRatio: AspectRatioType;
  musicTrack: 'epic_orchestral' | 'ambient_piano' | 'cinematic_inspiring' | 'gentle_acoustic' | 'none';
  scenes: VideoScene[];
  fullScript: string;
  createdAt: number;
}
