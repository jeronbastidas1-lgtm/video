/**
 * Video recording utility that captures the HTML5 canvas and synthesized audio
 * and exports a real WebM/MP4 video file.
 */

export interface ExportProgressCallback {
  (progressPercent: number, statusText: string): void;
}

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  public startRecording(
    canvas: HTMLCanvasElement,
    audioStream: MediaStream | null,
    fps: number = 30
  ): boolean {
    try {
      this.recordedChunks = [];
      const canvasStream = canvas.captureStream(fps);

      const combinedTracks: MediaStreamTrack[] = [
        ...canvasStream.getVideoTracks()
      ];

      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => combinedTracks.push(track));
      }

      const combinedStream = new MediaStream(combinedTracks);

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 4000000 // 4 Mbps high quality
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250);
      return true;
    } catch (err) {
      console.error('Error starting video recording:', err);
      return false;
    }
  }

  public stopRecording(filename: string = 'video-motivacional.webm'): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        if (this.recordedChunks.length === 0) {
          resolve(null);
          return;
        }

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  public isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}

export const videoRecorder = new VideoRecorder();
