import { GenreType, VisualStyleType, VideoScene, VideoProject, IdeaItem, CameraMotion } from '../types/video';

export const GENRES: {
  id: GenreType;
  name: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: 'motivacion',
    name: 'Motivación & Superación',
    tagline: 'Despierta tu fuerza interior para alcanzar tus metas',
    description: 'Enfoque en disciplina, perseverancia, romper barreras y el coraje de empezar de nuevo.'
  },
  {
    id: 'esperanza',
    name: 'Esperanza & Fe',
    tagline: 'Una luz en medio de las tormentas de la vida',
    description: 'Consuelo en momentos difíciles, certeza de que todo pasará y renovación espiritual.'
  },
  {
    id: 'amor',
    name: 'Amor Propio & Relaciones',
    tagline: 'Sana tu relación contigo y conecta con los demás',
    description: 'Autoaceptación, límites saludables, gratitud, ternura y el valor de ser auténtico.'
  },
  {
    id: 'consejos',
    name: 'Consejos & Sabiduría',
    tagline: 'Lecciones profundas para vivir con propósito y paz',
    description: 'Filosofía práctica, estoicismo moderno, toma de decisiones y madurez emocional.'
  },
  {
    id: 'resiliencia',
    name: 'Resiliencia & Voluntad',
    tagline: 'Caer siete veces y levantarse ocho',
    description: 'Transformar el dolor en poder, cicatrices como medallas y vencer la adversidad.'
  },
  {
    id: 'paz_mental',
    name: 'Paz Mental & Calma',
    tagline: 'Un respiro para calmar el ruido del mundo',
    description: 'Manejo de la ansiedad, presencia en el aquí y ahora, y soltar el control.'
  }
];

export const VISUAL_STYLES: {
  id: VisualStyleType;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  visualCharacteristics: string[];
}[] = [
  {
    id: 'real',
    name: 'Personajes Reales (Cinemático)',
    subtitle: 'Fotorrealismo cinematográfico',
    badge: 'Cine 4K / Realismo',
    description: 'Personas de carne y hueso en locaciones imponentes con iluminación natural dramática y fotografía anamórfica.',
    visualCharacteristics: [
      'Texturas de piel y miradas profundas',
      'Iluminación dorada (Golden Hour)',
      'Paisajes reales: montañas, acantilados, lluvia urbana',
      'Profundidad de campo suave (bokeh de 85mm)'
    ]
  },
  {
    id: '3d',
    name: 'Animación 3D (Pixar / Unreal)',
    subtitle: 'Modelado y render digital vibrante',
    badge: '3D CGI / Pixar Style',
    description: 'Personajes estilizados llenos de emoción, iluminación volumétrica suave y mundos llenos de magia visual.',
    visualCharacteristics: [
      'Expresividad facial cautivadora',
      'Iluminación volumétrica y partículas brillantes',
      'Mundos fantásticos y texturas suaves',
      'Cámara dinámica con movimientos fluidos'
    ]
  },
  {
    id: '2d',
    name: 'Animación 2D (Anime / Acuarela)',
    subtitle: 'Ilustración artística tradicional',
    badge: 'Anime & Watercolor',
    description: 'Trazos elegantes dibujados a mano, fondos con texturas de acuarela y la atmósfera emotiva del mejor cine de animación japonés.',
    visualCharacteristics: [
      'Líneas de tinta expresivas y sombreado cel',
      'Paletas de colores poéticas y degradados pastel',
      'Hojas de otoño, lluvia y viento visible',
      'Composiciones de alta carga poética'
    ]
  },
  {
    id: 'monigote',
    name: 'Monigotes (Stickman Doodle)',
    subtitle: 'Minimalismo y ternura en pizarra',
    badge: 'Doodle / Whiteboard',
    description: 'Figuras de palitos simples pero profundamente expresivas sobre fondos de pizarra o papel con garabatos animados.',
    visualCharacteristics: [
      'Personajes de palito minimalistas y universales',
      'Animación de tiza blanca o tinta negra',
      'Metáforas visuales: corazones dibujados, paraguas, rocas',
      'Conexión emocional directa y sin filtros'
    ]
  }
];

// Creative generative presets to ensure instant variety on every genre select
const IDEA_POOLS: Record<GenreType, { hooks: string[]; titles: string[]; messages: string[]; styles: VisualStyleType[] }> = {
  motivacion: {
    titles: [
      'El Despertar del Gigante',
      'Nadie Puede Detenerte',
      'Solo Necesitas un Paso',
      'El Precio de la Grandeza',
      'Tu Momento es Hoy',
      'Rompe tus Propias Cadenas',
      'La Disciplina Vence al Talento'
    ],
    hooks: [
      '¿Y si hoy fuera el día en que todo cambia?',
      'No estás cansado del trabajo, estás cansado de dudar de ti.',
      'El dolor que sientes hoy es la fuerza que tendrás mañana.',
      'Deja de esperar el momento perfecto; constrúyelo.',
      'Nadie vendrá a salvarte. La victoria depende de ti.'
    ],
    messages: [
      'Cada pequeño paso en silencio construye el imperio que otros llamarán suerte.',
      'No necesitas ver toda la escalera, solo atreverte a subir el primer peldaño con decisión.',
      'El fracaso no es lo contrario del éxito; es parte fundamental del camino hacia la cima.',
      'Tu mayor rival no está allá afuera, duerme en tu propia mente y hoy lo vas a superar.'
    ],
    styles: ['real', '3d', '2d', 'monigote']
  },
  esperanza: {
    titles: [
      'La Luz Tras la Tormenta',
      'Todo Va a Estar Bien',
      'Aún Quedan Días Felices',
      'La Promesa del Amanecer',
      'No Te Rindas en la Noche',
      'Un Suspiro de Fe',
      'Las Flores También Brotan en la Grieta'
    ],
    hooks: [
      'Sé que el peso que llevas hoy se siente insoportable...',
      'Respira hondo: la noche más oscura siempre precede al sol.',
      'Si hoy no pudiste más, sobrevivir ya fue una gran victoria.',
      'Hay una calma esperándote al otro lado de esta tormenta.'
    ],
    messages: [
      'Incluso las noches más largas e impenetrables terminan cediendo ante los primeros rayos del sol.',
      'Lo que hoy parece el final de tu historia, solo es el capítulo donde aprendes a volar.',
      'No perdiste todo; te tienes a ti, y con eso es suficiente para volver a florecer.'
    ],
    styles: ['2d', 'real', '3d', 'monigote']
  },
  amor: {
    titles: [
      'Primero Tú, Siempre Tú',
      'El Amor que Te Debes',
      'Abrazar Quien Eres',
      'Corazones Valientes',
      'La Paz de Poner Límites',
      'Aprender a Soltar con Ternura'
    ],
    hooks: [
      '¿Cuándo fue la última vez que te miraste al espejo con orgullo?',
      'Has cuidado de todos, pero ¿quién está cuidando de ti?',
      'El amor verdadero no duele, ni te pide que te hagas pequeño.',
      'No mendigues un lugar donde mereces ser celebrado.'
    ],
    messages: [
      'Amarte a ti mismo no es egoísmo, es el cimiento para poder amar sanamente al mundo.',
      'Eres suficiente tal como estás hoy: con tus cicatrices, tus dudas y tu luz inagotable.',
      'Deja ir a quien no sabe sostener tu corazón, para dar espacio a la paz que mereces.'
    ],
    styles: ['monigote', '2d', 'real', '3d']
  },
  consejos: {
    titles: [
      'Las Reglas del Sabio',
      'El Arte de Callar y Observar',
      'Lo que Nadie Te Dice de Crecer',
      'El Poder del Silencio',
      'Elige tus Batallas',
      'Vivir sin Prisa pero sin Pausa'
    ],
    hooks: [
      'Tres cosas que debes aprender antes de que sea demasiado tarde:',
      'No reacciones a todo: el silencio es la respuesta más elegante.',
      'Si quieres paz, deja de intentar cambiar a quienes no quieren cambiar.',
      'El tiempo que no disfrutas hoy, jamás regresará mañana.'
    ],
    messages: [
      'Controla lo que puedes controlar y aprende a soltar lo que está fuera de tus manos.',
      'El verdadero poder no es gritar más fuerte, sino mantener la calma cuando todos la pierden.',
      'Valora a quienes estuvieron contigo cuando no tenías nada que ofrecer más que tu compañía.'
    ],
    styles: ['real', 'monigote', '3d', '2d']
  },
  resiliencia: {
    titles: [
      'Inquebrantable',
      'Hecho de Fuego y Cenizas',
      'Levántate una Vez Más',
      'El Rugido del Guerrero',
      'De la Herida Nace el Poder'
    ],
    hooks: [
      'Te rompieron, pero olvidaron que el oro se funde en el fuego.',
      'Mírame a los ojos: rendirse no es una opción para ti.',
      'Cada golpe que recibiste te enseñó a cómo mantenerte en pie.',
      'No eres la víctima de lo que pasó, eres el héroe de tu rescate.'
    ],
    messages: [
      'Tus cicatrices no son motivos de vergüenza, son la prueba viviente de que sobreviviste.',
      'Podrán quitarte el aliento por un instante, pero tu voluntad es un río que nadie detiene.'
    ],
    styles: ['real', '3d', '2d', 'monigote']
  },
  paz_mental: {
    titles: [
      'Pausa en el Caos',
      'Desconecta para Conectar',
      'Suelta el Futuro',
      'El Santuario Interior',
      'Respira, Solo es Hoy'
    ],
    hooks: [
      'Baja los hombros, relaja la mandíbula y toma aire profundamente...',
      'El 90% de las cosas que te angustian nunca llegarán a pasar.',
      'No tienes que resolver toda tu vida hoy, solo vive este minuto.',
      'Tu paz mental es demasiado cara para regalársela a cualquiera.'
    ],
    messages: [
      'El presente es el único lugar donde la vida sucede. Regresa a este momento presente.',
      'Aprende a decir no sin culpas para poder decirte sí a tu propio bienestar y tranquilidad.'
    ],
    styles: ['2d', 'monigote', '3d', 'real']
  }
};

/**
 * Generate dynamic fresh ideas for a genre
 */
export function generateIdeasForGenre(genre: GenreType, count: number = 4): IdeaItem[] {
  const pool = IDEA_POOLS[genre] || IDEA_POOLS.motivacion;
  const items: IdeaItem[] = [];

  const shuffledTitles = [...pool.titles].sort(() => Math.random() - 0.5);
  const shuffledHooks = [...pool.hooks].sort(() => Math.random() - 0.5);
  const shuffledMessages = [...pool.messages].sort(() => Math.random() - 0.5);
  const styles = pool.styles;

  for (let i = 0; i < count; i++) {
    const title = shuffledTitles[i % shuffledTitles.length] || `Inspiración ${i + 1}`;
    const hook = shuffledHooks[i % shuffledHooks.length] || 'Un nuevo amanecer te espera.';
    const coreMessage = shuffledMessages[i % shuffledMessages.length] || 'Tu potencial es infinito si decides dar el primer paso hoy.';
    const style = styles[i % styles.length];

    items.push({
      id: `${genre}-${Date.now()}-${i}`,
      title,
      hook,
      coreMessage,
      recommendedStyle: style,
      genre
    });
  }

  return items;
}

/**
 * Calculate scene duration distribution for target total duration (30s to 60s)
 */
export function calculateSceneDurations(totalSeconds: number, sceneCount: number): number[] {
  const clampedTotal = Math.max(30, Math.min(60, totalSeconds));
  const base = Math.floor(clampedTotal / sceneCount);
  const remainder = clampedTotal % sceneCount;
  const durations: number[] = [];

  for (let i = 0; i < sceneCount; i++) {
    durations.push(base + (i < remainder ? 1 : 0));
  }
  return durations;
}

/**
 * Procedural fallback screenplay generator that builds high-fidelity scenes
 * when offline or without Gemini API key, tailored strictly to the selected style
 */
export function buildProceduralProject(
  topic: string,
  genre: GenreType,
  style: VisualStyleType,
  durationSeconds: number = 45,
  aspectRatio: '9:16' | '16:9' = '9:16'
): VideoProject {
  const sceneCount = durationSeconds <= 35 ? 4 : durationSeconds <= 50 ? 5 : 6;
  const durations = calculateSceneDurations(durationSeconds, sceneCount);

  const styleNames: Record<VisualStyleType, string> = {
    real: 'Cinemático Fotorrealista',
    '3d': 'Animación 3D Pixar / CGI',
    '2d': 'Anime Acuarela 2D',
    monigote: 'Monigotes Doodle en Pizarra'
  };

  const cameraMotions: CameraMotion[] = ['zoom_in', 'pan_right', 'zoom_out', 'pan_left', 'tilt_up', 'zoom_in'];

  // Style-specific visual scripts
  const styleScripts: Record<VisualStyleType, Array<{ headline: string; voiceover: string; visual: string; color: string }>> = {
    real: [
      {
        headline: 'El punto de quiebre',
        voiceover: 'A veces el camino se torna empinado y sientes que tus fuerzas se agotan.',
        visual: 'Primer plano dramático de un rostro humano bajo una lluvia suave en una calle solitaria al atardecer, luz cálida de farolas reflejada en el asfalto.',
        color: '#f59e0b'
      },
      {
        headline: 'La duda silenciada',
        voiceover: 'La mente te dirá que pares, que nadie nota tu esfuerzo en silencio.',
        visual: 'Toma cinematográfica amplia de una persona solitaria frente a una cordillera inmensa cubierta de niebla dorada.',
        color: '#3b82f6'
      },
      {
        headline: 'El fuego interior',
        voiceover: 'Pero dentro de ti late una llama que ninguna tormenta puede apagar.',
        visual: 'Cámara lenta: la persona respira hondo, aprieta los puños y levanta la mirada con una determinación inquebrantable.',
        color: '#ef4444'
      },
      {
        headline: 'El primer paso',
        voiceover: 'No necesitas ver todo el trayecto, solo tener el valor de dar el siguiente paso.',
        visual: 'Pies avanzando con paso firme sobre un sendero de tierra y hojas doradas mientras los rayos de sol filtran el bosque.',
        color: '#10b981'
      },
      {
        headline: 'Tu victoria eterna',
        voiceover: 'Hoy no te detengas. Porque tu historia apenas está comenzando.',
        visual: 'Toma panorámica aérea de la persona en la cima de la montaña al amanecer con los brazos abiertos ante un horizonte infinito.',
        color: '#8b5cf6'
      },
      {
        headline: 'Eres imparable',
        voiceover: 'Cree en ti, porque el mundo necesita tu luz.',
        visual: 'Retrato sereno con una sonrisa sincera y mirada brillante mirando directamente a la cámara 4k anamórfica.',
        color: '#ec4899'
      }
    ],
    '3d': [
      {
        headline: 'Un pequeño comienzo',
        voiceover: 'En un mundo que parece demasiado grande, cada paso cuenta.',
        visual: 'Personaje 3D adorable y estilizado (estilo Pixar) con ojos luminosos mirando una gigantesca torre de engranajes flotantes.',
        color: '#6366f1'
      },
      {
        headline: 'El peso del miedo',
        voiceover: 'El miedo querrá convencerte de que tus sueños son imposibles.',
        visual: 'El personaje 3D abraza una esfera de cristal apagada mientras nubes oscuras de tormenta estilizada giran en el cielo.',
        color: '#a855f7'
      },
      {
        headline: 'La chispa se enciende',
        voiceover: 'Pero un solo latido de fe tiene más fuerza que mil temores.',
        visual: 'La esfera de cristal se ilumina con partículas doradas mágicas que iluminan el rostro expresivo del personaje.',
        color: '#eab308'
      },
      {
        headline: 'Alza el vuelo',
        voiceover: 'Despliega tus alas y confía en el viento que tú mismo creas.',
        visual: 'Alas de luz se abren en la espalda del personaje 3D mientras salta hacia el cielo estrellado con estela de luciérnagas.',
        color: '#06b6d4'
      },
      {
        headline: 'Un nuevo horizonte',
        voiceover: 'El futuro es brillante cuando decides no rendirte jamás.',
        visual: 'El personaje 3D aterriza sobre una nube dorada contemplando una ciudad mágica llena de luces cálidas y fuegos artificiales.',
        color: '#10b981'
      },
      {
        headline: 'Tu luz es infinita',
        voiceover: 'Nunca dejes de soñar en grande.',
        visual: 'El personaje guiña el ojo a la cámara con una sonrisa radiante y saluda mientras la luz del amanecer baña la escena.',
        color: '#f97316'
      }
    ],
    '2d': [
      {
        headline: 'El viento del destino',
        voiceover: 'Bajo el cielo inmenso, a veces nos sentimos como una hoja en el vendaval.',
        visual: 'Escena estilo anime tradicional con acuarelas: un joven con bufanda al viento bajo pétalos de cerezo flotando en una tarde melancólica.',
        color: '#ec4899'
      },
      {
        headline: 'Lágrimas que limpian',
        voiceover: 'Las lágrimas no son debilidad, son el agua que hace germinar tu alma.',
        visual: 'Toma de perfil en sombreado cel-shaded: una gota resbala por la mejilla mientras el sol comienza a romper las nubes grises.',
        color: '#38bdf8'
      },
      {
        headline: 'El pacto con tu corazón',
        voiceover: 'Prométete hoy que no te abandonarás, pase lo que pase.',
        visual: 'Mano con trazo de tinta que se cierra con fuerza sobre el pecho mientras un halo de luz acuarela se expande suavemente.',
        color: '#f59e0b'
      },
      {
        headline: 'Correr hacia el sol',
        voiceover: 'El dolor se transforma en el combustible que te llevará más lejos.',
        visual: 'El personaje corre a toda velocidad hacia una colina verde donde el sol brilla como una explosión de colores vibrantes.',
        color: '#10b981'
      },
      {
        headline: 'La promesa cumplida',
        voiceover: 'Descubrirás que eras mucho más fuerte de lo que imaginabas.',
        visual: 'El personaje alcanza la cima y contempla un mar resplandeciente con gaviotas y cometas flotando en el cielo crepuscular.',
        color: '#8b5cf6'
      },
      {
        headline: 'Florece sin miedo',
        voiceover: 'Tu tiempo ha llegado. Brilla con toda tu fuerza.',
        visual: 'Plano detalle del rostro en arte 2D con una mirada llena de paz y una sonrisa esperanzadora.',
        color: '#f43f5e'
      }
    ],
    monigote: [
      {
        headline: 'Un peso pesado',
        voiceover: 'A veces la vida te pone una roca que parece demasiado grande para mover.',
        visual: 'Fondo de pizarra negra: un monigote de palitos con trazos de tiza blanca empujando con esfuerzo una roca redonda dibujada con garabatos.',
        color: '#38bdf8'
      },
      {
        headline: 'El cansancio',
        voiceover: 'Te sientas en el suelo y crees que no vas a poder continuar.',
        visual: 'El monigote se sienta en el suelo al lado de la roca, con su cabecita inclinada y pequeñas gotas de sudor dibujadas.',
        color: '#94a3b8'
      },
      {
        headline: 'Una nueva mirada',
        voiceover: 'Pero entonces recuerdas por qué empezaste y tomas un lápiz imaginario.',
        visual: 'El monigote saca una tiza mágica brillante y le dibuja una cuerda y un globo gigante a la roca.',
        color: '#fbbf24'
      },
      {
        headline: 'La carga se eleva',
        voiceover: 'Cuando cambias la forma de ver las cosas, lo que te pesaba empieza a volar.',
        visual: 'La roca se convierte en un globo con carita feliz y se eleva hacia el cielo mientras el monigote salta de alegría.',
        color: '#4ade80'
      },
      {
        headline: 'Caminar juntos',
        voiceover: 'Aparece otro monigote y se dan la mano con un gran corazón flotando.',
        visual: 'Dos monigotes tomados de la mano caminando hacia un sol sonriente dibujado con rayos de tiza amarilla.',
        color: '#f472b6'
      },
      {
        headline: 'Todo va a salir bien',
        voiceover: 'Una simple sonrisa puede cambiarlo todo. No te rindas.',
        visual: 'El monigote dibuja una gran carita sonriente en la pantalla y saluda con su mano de palito.',
        color: '#a78bfa'
      }
    ]
  };

  const selectedPack = styleScripts[style];
  const scenes: VideoScene[] = [];
  let scriptAccumulator = '';

  for (let i = 0; i < sceneCount; i++) {
    const template = selectedPack[i % selectedPack.length];
    const duration = durations[i];
    const camera = cameraMotions[i % cameraMotions.length];

    scriptAccumulator += ` ${template.voiceover}`;

    // Generate prompt for Sora, Kling, Grok, Luma
    const promptSora = buildSoraPrompt(template.visual, style, camera, topic);
    const promptKling = buildKlingPrompt(template.visual, style, camera);
    const promptGrok = buildGrokPrompt(template.visual, style);
    const promptLuma = buildLumaPrompt(template.visual, style, camera);

    scenes.push({
      id: `scene-${i + 1}-${Date.now()}`,
      sceneNumber: i + 1,
      duration,
      headline: template.headline,
      voiceover: template.voiceover,
      visualDescription: template.visual,
      cameraMotion: camera,
      characterStyle: style,
      promptSora,
      promptKling,
      promptGrok,
      promptLuma,
      accentColor: template.color
    });
  }

  return {
    id: `project-${Date.now()}`,
    title: topic.trim() || `Mensaje de ${genre.toUpperCase()}`,
    genre,
    style,
    durationSeconds,
    aspectRatio,
    musicTrack: genre === 'paz_mental' ? 'ambient_piano' : genre === 'amor' ? 'gentle_acoustic' : 'epic_orchestral',
    scenes,
    fullScript: scriptAccumulator.trim(),
    createdAt: Date.now()
  };
}

function buildSoraPrompt(visual: string, style: VisualStyleType, camera: CameraMotion, topic: string): string {
  const styleModifiers: Record<VisualStyleType, string> = {
    real: 'Photorealistic 35mm film still, anamorphic lens, shallow depth of field, 4k cinematic lighting, volumetric mist, golden hour.',
    '3d': 'Pixar and Disney 3D animation style, Unreal Engine 5 render, subsurface scattering, stylized character, clean studio lighting, 8k resolution.',
    '2d': 'Makoto Shinkai anime aesthetic, hand-drawn traditional 2D animation, vibrant watercolor textures, painterly sky, delicate line art.',
    monigote: 'Minimalist animated chalkboard doodle, chalk stick figure on dark textured slate, expressive sketch strokes, heartfelt simple animation.'
  };

  const cameraTags: Record<CameraMotion, string> = {
    zoom_in: 'smooth cinematic push-in camera movement towards subject',
    zoom_out: 'gentle slow pull-back camera reveal',
    pan_left: 'smooth horizontal pan from right to left',
    pan_right: 'smooth horizontal tracking pan from left to right',
    tilt_up: 'slow vertical tilt-up from ground level towards the sky'
  };

  return `Cinematic short video scene: "${visual}". Theme: ${topic}. ${styleModifiers[style]} ${cameraTags[camera]}, 60fps high temporal coherence, emotionally evocative.`;
}

function buildKlingPrompt(visual: string, style: VisualStyleType, camera: CameraMotion): string {
  const styleTags: Record<VisualStyleType, string> = {
    real: 'cinematic realism, 8k raw footage, natural dramatic lighting, photoreal',
    '3d': '3d cgi render, pixar aesthetic, octane render, vivid colors',
    '2d': 'anime illustration, studio ghibli inspired, high quality 2d animation',
    monigote: 'whiteboard stickman doodle, chalk illustration, minimalist clean lines'
  };

  return `${visual}, ${styleTags[style]} --camera ${camera.replace('_', '-')} --motion 6 --quality high --ar 9:16`;
}

function buildGrokPrompt(visual: string, style: VisualStyleType): string {
  return `Generate an evocative high-resolution video of ${visual} in ${style} visual aesthetic, ultra-clean motion and uplifting atmosphere.`;
}

function buildLumaPrompt(visual: string, style: VisualStyleType, camera: CameraMotion): string {
  return `Keyframe action: ${visual}. Style: ${style}. Camera: ${camera}. Masterpiece cinematography with smooth organic physics.`;
}

/**
 * Helper to find current scene index and scene progress based on elapsed seconds
 */
export function getCurrentSceneInfo(scenes: VideoScene[], elapsedSeconds: number): {
  sceneIndex: number;
  currentScene: VideoScene | null;
  sceneProgress: number; // 0 to 1
  sceneTimeLeft: number;
} {
  if (!scenes || scenes.length === 0) {
    return { sceneIndex: 0, currentScene: null, sceneProgress: 0, sceneTimeLeft: 0 };
  }

  let accumulated = 0;
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneStart = accumulated;
    const sceneEnd = accumulated + scene.duration;

    if (elapsedSeconds >= sceneStart && (elapsedSeconds < sceneEnd || i === scenes.length - 1)) {
      const progress = Math.max(0, Math.min(1, (elapsedSeconds - sceneStart) / scene.duration));
      const timeLeft = Math.max(0, sceneEnd - elapsedSeconds);
      return {
        sceneIndex: i,
        currentScene: scene,
        sceneProgress: progress,
        sceneTimeLeft: timeLeft
      };
    }
    accumulated += scene.duration;
  }

  return {
    sceneIndex: scenes.length - 1,
    currentScene: scenes[scenes.length - 1],
    sceneProgress: 1,
    sceneTimeLeft: 0
  };
}
