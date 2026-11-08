import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
// AI Studio requires dev server on port 3000 (nginx reverse proxy binds 8080)
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint: Generate dynamic creative ideas per genre
app.post('/api/gemini/generate-ideas', async (req, res) => {
  try {
    const { genre, count = 4 } = req.body;
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        ideas: [],
        message: 'No GEMINI_API_KEY configured; using client-side creative engine.',
      });
    }

    const prompt = `Genera ${count} ideas únicas y conmovedoras de video corto (30 a 60 segundos) en español para el tema: "${genre}".
Cada idea debe incluir:
- title: Título corto y potente (máximo 6 palabras)
- hook: Gancho inicial en los primeros 3 segundos (máximo 12 palabras)
- coreMessage: Mensaje central motivacional o reflexivo (máximo 20 palabras)
- recommendedStyle: uno de ["real", "3d", "2d", "monigote"]

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
[
  {
    "title": "...",
    "hook": "...",
    "coreMessage": "...",
    "recommendedStyle": "real"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    return res.json({ fallback: false, ideas: parsed });
  } catch (error: any) {
    console.error('Error generating ideas with Gemini:', error);
    return res.status(200).json({
      fallback: true,
      ideas: [],
      error: error.message || 'Error communicating with Gemini API',
    });
  }
});

// Endpoint: Generate complete structured screenplay and prompts for Sora/Kling/Grok
app.post('/api/gemini/generate-script', async (req, res) => {
  try {
    const { topic, genre, style, durationSeconds = 45 } = req.body;
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        script: null,
        message: 'No GEMINI_API_KEY configured; using internal creative synthesizer.',
      });
    }

    const sceneCount = durationSeconds <= 35 ? 4 : durationSeconds <= 50 ? 5 : 6;
    const prompt = `Actúa como un director de cine y guionista de videos virales de alta inspiración (TikTok, Reels, Shorts).
Crea un guion completo de ${durationSeconds} segundos dividido en exactamente ${sceneCount} escenas para:
Tema: "${topic}"
Género: "${genre}"
Estilo visual elegido: "${style}" (donde:
- 'real' = Cinemático fotorrealista con personas reales, iluminación cinematográfica
- '3d' = Animación 3D estilo Pixar / Unreal Engine, personajes estilizados
- '2d' = Animación 2D tradicional / anime acuarela
- 'monigote' = Monigotes de palo minimalistas (stick figures / whiteboard doodle art) con trazos expresivos y emotivos)

Para cada escena calcula su duración proporcional (la suma debe ser ${durationSeconds}s) y proporciona:
- sceneNumber: número de escena (1 a ${sceneCount})
- duration: duración en segundos
- headline: frase clave o subtítulo en pantalla (muy breve, 3 a 6 palabras)
- voiceover: texto de la locución que se escuchará en la escena (en español, emotivo, fluido)
- visualDescription: descripción de lo que se ve (lugar, personaje, acción, iluminación) en concordancia estricta con el estilo "${style}"
- cameraMotion: uno de ["pan_left", "pan_right", "zoom_in", "zoom_out", "tilt_up"]
- promptSora: Prompt en inglés hiper-detallado optimizado para OpenAI Sora (especificando estilo ${style}, cámara, iluminación, coherencia temporal)
- promptKling: Prompt en inglés optimizado para Kling AI v1.5 con tokens cinematográficos (ej. 4k, cinematic lighting, style ${style}, smooth camera)
- promptGrok: Prompt en inglés para Grok Imagine Video
- promptLuma: Prompt en inglés para Luma Dream Machine con dirección de toma

Devuelve ÚNICAMENTE un objeto JSON con este formato:
{
  "title": "Título sugerente del video",
  "fullScript": "Texto completo continuo de la narración",
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": 8,
      "headline": "...",
      "voiceover": "...",
      "visualDescription": "...",
      "cameraMotion": "zoom_in",
      "promptSora": "...",
      "promptKling": "...",
      "promptGrok": "...",
      "promptLuma": "..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ fallback: false, script: parsed });
  } catch (error: any) {
    console.error('Error generating script with Gemini:', error);
    return res.status(200).json({
      fallback: true,
      script: null,
      error: error.message || 'Error calling Gemini',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  VITE v8.3.0  ready in 150 ms\n`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${PORT}/\n`);
  });

  process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
  });
}

startServer();
