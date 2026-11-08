/**
 * Procedural Web Audio Synthesizer for InspiraVideo AI
 * Generates rich, emotional ambient and orchestral background music in real-time
 * without relying on external audio assets. Supports capturing output stream for video export.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private destNode: MediaStreamAudioDestinationNode | null = null;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private volume: number = 0.4;

  // Emotional chord progressions (frequencies in Hz)
  private chordProgressions: Record<string, number[][]> = {
    epic_orchestral: [
      [146.83, 220.00, 261.63, 329.63], // Dm9
      [116.54, 174.61, 233.08, 293.66], // Bbmaj7
      [130.81, 196.00, 261.63, 329.63], // C9
      [110.00, 164.81, 220.00, 261.63], // Am7
    ],
    ambient_piano: [
      [130.81, 196.00, 246.94, 329.63], // Cmaj7
      [110.00, 164.81, 220.00, 261.63], // Am7
      [87.31, 130.81, 174.61, 220.00],  // Fmaj7
      [98.00, 146.83, 196.00, 246.94],  // G6
    ],
    cinematic_inspiring: [
      [98.00, 146.83, 196.00, 293.66],  // Gsus4
      [110.00, 164.81, 220.00, 293.66], // D/F#
      [87.31, 130.81, 174.61, 261.63],  // Em7
      [130.81, 196.00, 261.63, 329.63], // Cmaj9
    ],
    gentle_acoustic: [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [110.00, 146.83, 174.61, 220.00], // Dm7
      [98.00, 146.83, 196.00, 246.94],  // G7
      [130.81, 164.81, 196.00, 261.63], // C
    ]
  };

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Media stream destination for video recorder
      this.destNode = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.destNode);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioStream(): MediaStream | null {
    this.initContext();
    return this.destNode ? this.destNode.stream : null;
  }

  public start(trackType: 'epic_orchestral' | 'ambient_piano' | 'cinematic_inspiring' | 'gentle_acoustic' | 'none' = 'cinematic_inspiring') {
    if (trackType === 'none') return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.isPlaying = true;
    this.currentStep = 0;

    const progression = this.chordProgressions[trackType] || this.chordProgressions.cinematic_inspiring;

    // Play next chord every 3.5 seconds with crossfade
    const stepDuration = 3.5;
    const playNext = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const chord = progression[this.currentStep % progression.length];
      const now = this.ctx.currentTime;

      // Pad chord (warm saw/triangle with low pass filter)
      chord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Filter for gentle cinema warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700 + i * 150, now);
        filter.Q.setValueAtTime(1.2, now);

        // Soft envelope: attack 1.2s, sustain, release 1.5s
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 1.2);
        gain.gain.setValueAtTime(0.08 / (i + 1), now + stepDuration - 1.2);
        gain.gain.linearRampToValueAtTime(0.001, now + stepDuration + 0.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + stepDuration + 1.0);
      });

      // Shimmer arpeggio note for magic
      const shimmerOsc = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();
      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(chord[chord.length - 1] * 2, now + 0.5);
      shimmerGain.gain.setValueAtTime(0.001, now + 0.5);
      shimmerGain.gain.linearRampToValueAtTime(0.02, now + 0.9);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(this.masterGain);
      shimmerOsc.start(now + 0.5);
      shimmerOsc.stop(now + 3.0);

      this.currentStep++;
      this.timerId = window.setTimeout(playNext, stepDuration * 1000);
    };

    playNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }
}

export const audioSynthesizer = new AudioSynthesizer();
