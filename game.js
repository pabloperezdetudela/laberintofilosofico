// =====================================================
//  LA CAVERNA — Laberinto Filosófico
//  Engine: Canvas 2D + Vanilla JS
// =====================================================

'use strict';

// ── CONFIG ───────────────────────────────────────────

const CELL = 40;       // px por celda
const COLS = 17;       // columnas del laberinto (impar)
const ROWS = 13;       // filas del laberinto (impar)
const PLAYER_SPEED = 3; // px por frame

// ── NIVELES ──────────────────────────────────────────

const LEVELS = [
  {
    id: 0,
    name: 'Nivel I — Las Sombras',
    subtitle: 'Eikasía',
    desc: 'Solo percibes sombras. El mundo real te es invisible.',
    color: '#3a3a5c',
    wallColor: '#2a2a4a',
    floorColor: '#0d0d1a',
    playerColor: '#6060a0',
    fogRadius: 2.5,
    philosopher: 'Platón',
    philosopherEmoji: '🏛️',
    completedTitle: 'Has reconocido las sombras',
    completedQuote: '"Los encadenados solo ven sombras y creen que son la realidad."',
    completedDesc: 'Ahora sabes que lo que veías no era real. Das un paso hacia la luz.',
  },
  {
    id: 1,
    name: 'Nivel II — Los Reflejos',
    subtitle: 'Pistis',
    desc: 'Ves objetos reales por primera vez, aunque mediados por el agua.',
    color: '#3a5a5c',
    wallColor: '#1a3535',
    floorColor: '#0d1a1a',
    playerColor: '#40a0a0',
    fogRadius: 3.5,
    philosopher: 'Descartes',
    philosopherEmoji: '🪞',
    completedTitle: 'Has cruzado el umbral de la duda',
    completedQuote: '"Cogito, ergo sum."',
    completedDesc: 'Solo lo que puedes dudar sin contradicción es verdadero. Avanzas.',
  },
  {
    id: 2,
    name: 'Nivel III — La Razón',
    subtitle: 'Dianoia',
    desc: 'La razón es tu guía. El pensamiento abstracto abre caminos.',
    color: '#5c4a2a',
    wallColor: '#3a2a10',
    floorColor: '#1a1205',
    playerColor: '#c09030',
    fogRadius: 5,
    philosopher: 'Kant',
    philosopherEmoji: '⚖️',
    completedTitle: 'La razón te ha guiado',
    completedQuote: '"Actúa solo según aquella máxima que puedas desear sea ley universal."',
    completedDesc: 'Has aprendido que la razón pura tiene límites. La verdad espera afuera.',
  },
  {
    id: 3,
    name: 'Nivel IV — La Luz',
    subtitle: 'Noesis',
    desc: 'La verdad pura. El Bien. La salida de la caverna.',
    color: '#7c5c20',
    wallColor: '#4a3510',
    floorColor: '#1a1205',
    playerColor: '#f0c840',
    fogRadius: 99,
    philosopher: 'Sócrates',
    philosopherEmoji: '☀️',
    completedTitle: '¡Has salido!',
    completedQuote: '"Solo sé que no sé nada."',
    completedDesc: 'La sabiduría suprema es reconocer los límites del propio conocimiento.',
  },
];

// ── PREGUNTAS FILOSÓFICAS ─────────────────────────────

const QUESTIONS = {
  0: [ // Las Sombras — Platón, Apariencia vs Realidad
    {
      philosopher: 'Platón',
      emoji: '🏛️',
      question: 'Los prisioneros de la caverna confunden las sombras con la realidad. ¿Cuál es la primera forma del conocimiento según Platón?',
      options: [
        { text: 'Eikasía — la imaginación, el nivel más bajo', correct: true },
        { text: 'Noesis — el conocimiento puro de las Ideas', correct: false },
        { text: 'Episteme — el conocimiento científico', correct: false },
        { text: 'Doxa — la opinión razonada', correct: false },
      ],
      feedback: 'Correcto. Eikasía es el estado de quien toma las sombras (imágenes) por lo real. Debes superarlo para avanzar.',
      feedbackWrong: 'No exactamente. Eikasía es el primer peldaño: la mera imaginación que confunde copias con originales.',
    },
    {
      philosopher: 'Heráclito',
      emoji: '🔥',
      question: '"No puedes bañarte dos veces en el mismo río." ¿Qué afirma este fragmento sobre la realidad?',
      options: [
        { text: 'Todo es permanente; el cambio es ilusión', correct: false },
        { text: 'El cambio constante (Devenir) es la naturaleza de lo real', correct: true },
        { text: 'El agua no existe, solo la percepción de ella', correct: false },
        { text: 'Los ríos representan el caos sin orden', correct: false },
      ],
      feedback: 'Exacto. Para Heráclito el Logos ordena el flujo eterno del devenir. La realidad es proceso, no cosa fija.',
      feedbackWrong: 'Heráclito sostiene que el Devenir —el cambio perpetuo— define lo real. El río fluye; tú también.',
    },
    {
      philosopher: 'Platón',
      emoji: '🏛️',
      question: '¿Cuál es la diferencia entre el mundo sensible y el mundo de las Ideas?',
      options: [
        { text: 'El sensible es eterno; el de las Ideas, temporal', correct: false },
        { text: 'El sensible es copia imperfecta; las Ideas son arquetipos eternos', correct: true },
        { text: 'Ambos mundos son igualmente reales', correct: false },
        { text: 'Solo existe el mundo sensible', correct: false },
      ],
      feedback: 'Así es. La mesa que ves es una copia imperfecta de la Idea de Mesa. El mundo sensible es la caverna.',
      feedbackWrong: 'Para Platón las Ideas son los modelos eternos e inmutables; el mundo sensible las imita imperfectamente.',
    },
  ],
  1: [ // Los Reflejos — Descartes, Duda y Certeza
    {
      philosopher: 'Descartes',
      emoji: '🪞',
      question: 'Descartes duda de todo para encontrar certezas. ¿Cuál es la única cosa que no puede dudar?',
      options: [
        { text: 'La existencia de Dios', correct: false },
        { text: 'La existencia del mundo físico', correct: false },
        { text: 'Que está pensando en ese momento', correct: true },
        { text: 'La validez de las matemáticas', correct: false },
      ],
      feedback: '"Cogito ergo sum." Aunque todo lo demás fuera un sueño, el acto mismo de dudar prueba que hay un pensador.',
      feedbackWrong: 'El único anclaje indudable es el pensamiento mismo: si dudo, pienso; si pienso, existo.',
    },
    {
      philosopher: 'Hume',
      emoji: '🌊',
      question: 'Hume afirma que toda idea deriva de una impresión sensible. ¿Qué implica esto para el concepto de "causa"?',
      options: [
        { text: 'La causalidad es una ley racional necesaria', correct: false },
        { text: 'Solo percibimos sucesión; la causa es un hábito mental, no un hecho', correct: true },
        { text: 'La causa existe independientemente de la experiencia', correct: false },
        { text: 'El concepto de causa es innato', correct: false },
      ],
      feedback: 'Exacto. Hume demolió la causalidad: solo vemos A seguido de B repetidamente; la "necesidad" la pone la mente.',
      feedbackWrong: 'Hume: nunca percibimos la conexión necesaria, solo la conjunción constante. La causalidad es costumbre mental.',
    },
    {
      philosopher: 'Descartes',
      emoji: '🪞',
      question: 'El "genio maligno" de Descartes es un experimento mental que postula un ser que lo engaña todo. ¿Qué propósito tiene?',
      options: [
        { text: 'Demostrar que el conocimiento es imposible', correct: false },
        { text: 'Ilustrar el escepticismo pirrónico como posición final', correct: false },
        { text: 'Llevar la duda al extremo para encontrar algo absolutamente cierto', correct: true },
        { text: 'Probar la existencia del diablo', correct: false },
      ],
      feedback: 'Correcto. La duda hiperbólica es metodológica, no nihilista. Empujando la duda al límite aparece el cogito.',
      feedbackWrong: 'El genio maligno es una herramienta metodológica: dudar de todo para hallar lo indudable.',
    },
  ],
  2: [ // La Razón — Kant, Ética y Conocimiento
    {
      philosopher: 'Kant',
      emoji: '⚖️',
      question: '¿Qué distingue a un imperativo categórico de uno hipotético?',
      options: [
        { text: 'El categórico depende de las consecuencias; el hipotético no', correct: false },
        { text: 'El hipotético ordena incondicionalmente; el categórico con condición', correct: false },
        { text: 'El categórico ordena sin condición alguna; el hipotético depende de un deseo', correct: true },
        { text: 'Son equivalentes; Kant los usa indistintamente', correct: false },
      ],
      feedback: '"Actúa solo según la máxima que puedas universalizar." Sin excusas, sin "si quiero X, haz Y". Incondicionalmente.',
      feedbackWrong: 'El imperativo categórico manda por el deber mismo, no por el resultado. "No mentirás" —sin condiciones.',
    },
    {
      philosopher: 'Nietzsche',
      emoji: '🦅',
      question: '"Dios ha muerto." ¿Qué significa esta proclamación de Nietzsche?',
      options: [
        { text: 'Un dios literal murió en un hecho histórico', correct: false },
        { text: 'La cultura occidental ha perdido su fundamento de valores absolutos', correct: true },
        { text: 'El ateísmo es la posición correcta', correct: false },
        { text: 'La ciencia reemplazó a la religión con mejores verdades', correct: false },
      ],
      feedback: 'Exacto. No es un juicio teológico. Con la "muerte de Dios" colapsan todos los valores absolutos de Occidente.',
      feedbackWrong: 'Nietzsche diagnostica una crisis cultural: sin un fundamento trascendente, ¿en qué basamos el valor y el sentido?',
    },
    {
      philosopher: 'Kant',
      emoji: '⚖️',
      question: 'La "cosa en sí" (Ding an sich) de Kant es incognoscible. ¿Por qué?',
      options: [
        { text: 'Porque la cosa en sí no existe', correct: false },
        { text: 'Porque toda percepción pasa por las formas a priori de nuestra mente', correct: true },
        { text: 'Porque los sentidos son completamente engañosos', correct: false },
        { text: 'Porque solo Dios puede conocerla', correct: false },
      ],
      feedback: 'Correcto. Espacio, tiempo y categorías del entendimiento son el filtro. Jamás accedemos al objeto sin ese filtro.',
      feedbackWrong: 'Toda experiencia lleva el molde de nuestra mente: espacio, tiempo, causalidad. Lo que vemos es el fenómeno, no la cosa misma.',
    },
  ],
  3: [ // La Luz — Sócrates / Existencialismo
    {
      philosopher: 'Sócrates',
      emoji: '☀️',
      question: '"Una vida sin examen no merece ser vivida." ¿Qué método usaba Sócrates para examinar la vida?',
      options: [
        { text: 'La deducción formal lógica', correct: false },
        { text: 'La mayéutica — el diálogo como partera de verdades', correct: true },
        { text: 'La contemplación solitaria y el silencio', correct: false },
        { text: 'El experimento empírico', correct: false },
      ],
      feedback: 'La mayéutica: como una partera, Sócrates ayudaba a "parir" conocimiento latente en el interlocutor con preguntas.',
      feedbackWrong: 'La mayéutica socrática usa el diálogo y la ironía para que el otro descubra las contradicciones en sus propias creencias.',
    },
    {
      philosopher: 'Sartre',
      emoji: '🌑',
      question: '"La existencia precede a la esencia." ¿Qué implica esta tesis sartriana?',
      options: [
        { text: 'Primero existe la esencia divina que da forma al ser humano', correct: false },
        { text: 'La naturaleza humana determina nuestras acciones', correct: false },
        { text: 'No tenemos naturaleza fija; nos hacemos con nuestras elecciones', correct: true },
        { text: 'La existencia es ilusoria; solo la esencia es real', correct: false },
      ],
      feedback: 'Así es. Para Sartre, el ser humano es pura libertad: no hay esencia previa que nos defina. Somos lo que elegimos.',
      feedbackWrong: 'Sartre invierte el orden: no hay Dios ni naturaleza que nos defina antes. Primero existimos; luego nos definimos.',
    },
    {
      philosopher: 'Camus',
      emoji: '🌊',
      question: 'Según Camus, ¿cuál es la respuesta correcta al absurdo de la existencia?',
      options: [
        { text: 'El suicidio filosófico —abrazar la fe religiosa', correct: false },
        { text: 'El suicidio físico como única coherencia', correct: false },
        { text: 'La rebelión —vivir plenamente sabiendo que no hay respuesta', correct: true },
        { text: 'La indiferencia estoica ante el caos', correct: false },
      ],
      feedback: '"Hay que imaginar a Sísifo feliz." La rebelión lúcida: amar la vida sin negar su absurdidad. Eso eres tú ahora.',
      feedbackWrong: 'Camus rechaza el suicidio físico y el filosófico (fe). La respuesta es la rebelión: vivir con plenitud ante el absurdo.',
    },
  ],
};

// ── ESTADO GLOBAL ─────────────────────────────────────

const state = {
  currentLevel: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  totalTime: 0,
  levelStartTime: 0,
  running: false,

  maze: [],
  doors: [],     // {col, row, locked, questionIdx, open}
  exit: { col: 0, row: 0 },

  player: { x: 0, y: 0, targetX: 0, targetY: 0 },
  keys: {},
  animFrame: null,
};

// ── UTILIDADES ───────────────────────────────────────

const $ = id => document.getElementById(id);

function px(cell) { return cell * CELL; }
function cellOf(px) { return Math.floor(px / CELL); }

function setCSSLevel(level) {
  document.documentElement.style.setProperty('--level-color', level.color);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  const el = $(id);
  el.classList.remove('hidden');
  requestAnimationFrame(() => el.classList.add('active'));
}

// ── GENERACIÓN DE LABERINTO (Recursive Backtracker DFS) ──

function generateMaze(cols, rows) {
  // Grid de celdas: 0=pared, 1=pasillo
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));

  function inBounds(c, r) {
    return c >= 0 && r >= 0 && c < cols && r < rows;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(c, r) {
    grid[r][c] = 1;
    const dirs = shuffle([[0, -2], [0, 2], [-2, 0], [2, 0]]);
    for (const [dc, dr] of dirs) {
      const nc = c + dc, nr = r + dr;
      if (inBounds(nc, nr) && grid[nr][nc] === 0) {
        grid[r + dr / 2][c + dc / 2] = 1; // knock down wall
        carve(nc, nr);
      }
    }
  }

  carve(1, 1);
  return grid;
}

// ── PUERTAS: colocar N puertas en pasillos ────────────

function placeDoors(grid, count) {
  const candidates = [];
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (grid[r][c] !== 1) continue;
      // Es un pasillo: verificar que tenga exactamente 2 vecinos pasillo en eje ortogonal
      const h = grid[r][c - 1] === 1 && grid[r][c + 1] === 1;
      const v = grid[r - 1] && grid[r - 1][c] === 1 && grid[r + 1] && grid[r + 1][c] === 1;
      if ((h || v) && !(h && v)) {
        // Evitar colocar cerca del inicio (1,1) o la salida
        if (c > 3 || r > 3) candidates.push({ col: c, row: r });
      }
    }
  }

  // Mezclar y seleccionar
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return candidates.slice(0, count).map((d, i) => ({
    col: d.col,
    row: d.row,
    locked: true,
    open: false,
    questionIdx: i,
  }));
}

// ── CANVAS SETUP ─────────────────────────────────────

const canvas = $('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;
  // Center canvas area considering HUD (38px top) and desc bar (~30px bottom)
  const available = window.innerHeight - 68;
  const scale = Math.min(1, available / canvas.height, (window.innerWidth - 20) / canvas.width);
  canvas.style.width = canvas.width * scale + 'px';
  canvas.style.height = canvas.height * scale + 'px';
}

window.addEventListener('resize', resizeCanvas);

// ── RENDER ───────────────────────────────────────────

function render() {
  const lvl = LEVELS[state.currentLevel];
  const px_ = state.player.x;
  const py_ = state.player.y;
  const pcx = px_ / CELL; // player center in cells
  const pcy = py_ / CELL;
  const fog = lvl.fogRadius;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw maze cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dx = c + 0.5 - pcx;
      const dy = r + 0.5 - pcy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const visibility = fog < 99
        ? Math.max(0, 1 - (dist / fog) ** 2)
        : 1;

      if (visibility <= 0) continue;

      const cell = state.maze[r][c];

      if (cell === 0) {
        // Wall
        const base = lvl.wallColor;
        ctx.fillStyle = blendWithFog(base, visibility);
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
        // Wall highlight edge
        if (visibility > 0.3) {
          ctx.strokeStyle = `rgba(255,255,255,${0.04 * visibility})`;
          ctx.strokeRect(c * CELL + 0.5, r * CELL + 0.5, CELL - 1, CELL - 1);
        }
      } else {
        // Floor
        ctx.fillStyle = blendWithFog(lvl.floorColor, visibility);
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }
  }

  // Draw exit
  const ex = state.exit.col * CELL;
  const ey = state.exit.row * CELL;
  const exitDist = Math.sqrt((state.exit.col + 0.5 - pcx) ** 2 + (state.exit.row + 0.5 - pcy) ** 2);
  const exitVis = fog < 99 ? Math.max(0, 1 - (exitDist / fog) ** 2) : 1;
  if (exitVis > 0) {
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 400);
    ctx.fillStyle = `rgba(201,168,76,${exitVis * pulse})`;
    ctx.fillRect(ex, ey, CELL, CELL);
    // Star/exit symbol
    ctx.font = `${CELL * 0.6}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = exitVis * pulse;
    ctx.fillText('✦', ex + CELL / 2, ey + CELL / 2);
    ctx.globalAlpha = 1;
  }

  // Draw doors
  for (const door of state.doors) {
    const dx = door.col * CELL;
    const dy = door.row * CELL;
    const ddist = Math.sqrt((door.col + 0.5 - pcx) ** 2 + (door.row + 0.5 - pcy) ** 2);
    const dvis = fog < 99 ? Math.max(0, 1 - (ddist / fog) ** 2) : 1;
    if (dvis <= 0 || door.open) continue;

    ctx.fillStyle = `rgba(80,40,120,${dvis * 0.9})`;
    ctx.fillRect(dx, dy, CELL, CELL);
    ctx.strokeStyle = `rgba(168,128,240,${dvis})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(dx + 2, dy + 2, CELL - 4, CELL - 4);

    ctx.font = `${CELL * 0.55}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = dvis;
    ctx.fillStyle = '#c890ff';
    ctx.fillText('🔒', dx + CELL / 2, dy + CELL / 2);
    ctx.globalAlpha = 1;
  }

  // Draw player
  const grd = ctx.createRadialGradient(px_, py_, 0, px_, py_, CELL * 0.45);
  grd.addColorStop(0, lvl.playerColor);
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(px_, py_, CELL * 0.42, 0, Math.PI * 2);
  ctx.fill();

  // Glow
  ctx.shadowColor = lvl.playerColor;
  ctx.shadowBlur = 12;
  ctx.fillStyle = lvl.playerColor;
  ctx.beginPath();
  ctx.arc(px_, py_, CELL * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function blendWithFog(hexColor, visibility) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const alpha = Math.max(0.05, visibility);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── MOVIMIENTO ───────────────────────────────────────

function isWalkable(x, y) {
  // Check 4 corners of player bounding box (shrunk by margin)
  const m = 4;
  const corners = [
    [x - m, y - m],
    [x + m, y - m],
    [x - m, y + m],
    [x + m, y + m],
  ];
  for (const [cx, cy] of corners) {
    const col = Math.floor(cx / CELL);
    const row = Math.floor(cy / CELL);
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return false;
    if (state.maze[row][col] === 0) return false;
    // Check locked doors
    for (const door of state.doors) {
      if (door.locked && !door.open && door.col === col && door.row === row) return false;
    }
  }
  return true;
}

function movePlayer() {
  const speed = PLAYER_SPEED;
  let dx = 0, dy = 0;

  if (state.keys['ArrowUp']    || state.keys['w'] || state.keys['W']) dy -= speed;
  if (state.keys['ArrowDown']  || state.keys['s'] || state.keys['S']) dy += speed;
  if (state.keys['ArrowLeft']  || state.keys['a'] || state.keys['A']) dx -= speed;
  if (state.keys['ArrowRight'] || state.keys['d'] || state.keys['D']) dx += speed;

  if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

  if (dx !== 0 && isWalkable(state.player.x + dx, state.player.y)) {
    state.player.x += dx;
  }
  if (dy !== 0 && isWalkable(state.player.x, state.player.y + dy)) {
    state.player.y += dy;
  }
}

function checkInteractions() {
  const pc = cellOf(state.player.x);
  const pr = cellOf(state.player.y);

  // Check doors (adjacent)
  for (const door of state.doors) {
    if (door.open || !door.locked) continue;
    const dist = Math.max(Math.abs(door.col - pc), Math.abs(door.row - pr));
    if (dist <= 1) {
      openQuestionModal(door);
      return;
    }
  }

  // Check exit
  if (pc === state.exit.col && pr === state.exit.row) {
    finishLevel();
  }
}

// ── LOOP PRINCIPAL ───────────────────────────────────

function loop() {
  if (!state.running) return;
  movePlayer();
  render();
  checkInteractions();
  state.animFrame = requestAnimationFrame(loop);
}

// ── MODAL DE PREGUNTAS ───────────────────────────────

let activeQuestionDoor = null;
let questionAnswered = false;

function openQuestionModal(door) {
  if (activeQuestionDoor === door) return;
  state.running = false;
  activeQuestionDoor = door;
  questionAnswered = false;

  const lvlQuestions = QUESTIONS[state.currentLevel];
  const q = lvlQuestions[door.questionIdx % lvlQuestions.length];

  $('philosopher-name').textContent = q.philosopher;

  // Replace img with emoji div
  const phil = document.querySelector('.modal-philosopher');
  let avatar = phil.querySelector('.philosopher-avatar');
  if (!avatar) {
    avatar = document.createElement('div');
    avatar.className = 'philosopher-avatar';
    phil.insertBefore(avatar, phil.firstChild);
  }
  const imgEl = $('philosopher-icon');
  if (imgEl) imgEl.remove();
  avatar.textContent = q.emoji;

  $('question-text').textContent = q.question;
  $('question-feedback').classList.add('hidden');
  $('btn-continue').classList.add('hidden');

  const opts = $('question-options');
  opts.innerHTML = '';

  // Shuffle options
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);

  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.text;
    btn.addEventListener('click', () => handleAnswer(opt, q, btn, shuffled));
    opts.appendChild(btn);
  });

  $('modal-question').classList.remove('hidden');
}

function handleAnswer(opt, q, clickedBtn, allOpts) {
  if (questionAnswered) return;
  questionAnswered = true;
  state.questionsAnswered++;

  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => b.disabled = true);

  if (opt.correct) {
    clickedBtn.classList.add('correct');
    state.correctAnswers++;
    $('question-feedback').textContent = q.feedback;
  } else {
    clickedBtn.classList.add('incorrect');
    // Reveal correct
    const correctText = allOpts.find(o => o.correct).text;
    btns.forEach(b => {
      if (b.textContent === correctText) b.classList.add('reveal');
    });
    $('question-feedback').textContent = q.feedbackWrong + ' ' + q.feedback;
  }

  $('question-feedback').classList.remove('hidden');
  $('btn-continue').classList.remove('hidden');
}

$('btn-continue').addEventListener('click', () => {
  $('modal-question').classList.add('hidden');
  // Open the door regardless of correct/incorrect (knowledge unlocks, not perfection)
  activeQuestionDoor.locked = false;
  activeQuestionDoor.open = true;
  activeQuestionDoor = null;
  state.running = true;
  loop();
});

// ── NIVEL: INICIAR ───────────────────────────────────

function startLevel(levelIdx) {
  state.currentLevel = levelIdx;
  const lvl = LEVELS[levelIdx];

  setCSSLevel(lvl);
  $('level-name').textContent = lvl.name;
  $('level-desc').textContent = `${lvl.subtitle} — ${lvl.desc}`;

  // Generate maze
  state.maze = generateMaze(COLS, ROWS);

  // Doors: 3 por nivel
  state.doors = placeDoors(state.maze, 3);

  // Exit: bottom-right area
  let ex = COLS - 2, er = ROWS - 2;
  while (state.maze[er][ex] !== 1) {
    ex--;
    if (ex < COLS / 2) { ex = COLS - 2; er--; }
  }
  state.exit = { col: ex, row: er };

  // Player start: top-left
  state.player.x = px(1) + CELL / 2;
  state.player.y = px(1) + CELL / 2;

  resizeCanvas();
  showScreen('screen-game');

  state.levelStartTime = Date.now();
  state.running = true;
  cancelAnimationFrame(state.animFrame);
  loop();
}

// ── NIVEL: TERMINAR ───────────────────────────────────

function finishLevel() {
  state.running = false;
  state.totalTime += (Date.now() - state.levelStartTime) / 1000;

  const lvl = LEVELS[state.currentLevel];

  if (state.currentLevel >= LEVELS.length - 1) {
    showEndScreen();
    return;
  }

  // Show level complete
  $('level-complete-title').textContent = lvl.completedTitle;
  $('level-complete-quote').textContent = lvl.completedQuote;
  $('level-complete-desc').textContent = lvl.completedDesc;

  showScreen('screen-level-complete');
}

$('btn-next-level').addEventListener('click', () => {
  startLevel(state.currentLevel + 1);
});

// ── PANTALLA FINAL ───────────────────────────────────

function showEndScreen() {
  const pct = Math.round((state.correctAnswers / Math.max(state.questionsAnswered, 1)) * 100);
  const mins = Math.floor(state.totalTime / 60);
  const secs = Math.round(state.totalTime % 60);

  $('end-story').innerHTML = `
    <p>Has recorrido las cuatro capas de la realidad según Platón:</p>
    <p style="margin:1rem 0; color: var(--gold)">
      Eikasía → Pistis → Dianoia → Noesis
    </p>
    <p>Como el prisionero que sale de la caverna, al principio la luz te cegaba.
    Pero perseveraste, respondiste las preguntas de los filósofos, y ahora
    <strong style="color:var(--gold-light)">ves el mundo tal como es</strong>.</p>
    <p style="margin-top:1rem">La pregunta que te deja Sócrates:</p>
    <p style="color:var(--text-dim); font-style:italic; margin-top:0.5rem">
      ¿Ahora que has visto la luz, volverás a la caverna para liberar a los demás?
    </p>
  `;

  const wisdom = pct >= 80 ? 'Filósofo-Rey' : pct >= 60 ? 'Amante de la Sabiduría' : 'Aprendiz de la Razón';

  $('end-stats').innerHTML = `
    <div class="stat-box">
      <span class="stat-value">${pct}%</span>
      <span class="stat-label">Aciertos filosóficos</span>
    </div>
    <div class="stat-box">
      <span class="stat-value">${mins}m ${secs}s</span>
      <span class="stat-label">Tiempo total</span>
    </div>
    <div class="stat-box">
      <span class="stat-value">${wisdom}</span>
      <span class="stat-label">Tu rango</span>
    </div>
  `;

  $('end-quote').innerHTML = `"Solo sé que no sé nada." <cite>— Sócrates</cite>`;

  showScreen('screen-end');
}

$('btn-restart').addEventListener('click', () => {
  state.questionsAnswered = 0;
  state.correctAnswers = 0;
  state.totalTime = 0;
  showScreen('screen-intro');
});

// ── CONTROLES ────────────────────────────────────────

document.addEventListener('keydown', e => {
  state.keys[e.key] = true;
  // Prevent page scroll with arrow keys
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {
  state.keys[e.key] = false;
});

// Touch controls (mobile swipe)
let touchStart = null;
canvas.addEventListener('touchstart', e => {
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

canvas.addEventListener('touchmove', e => {
  if (!touchStart) return;
  const dx = e.touches[0].clientX - touchStart.x;
  const dy = e.touches[0].clientY - touchStart.y;
  const threshold = 15;
  state.keys['ArrowLeft']  = dx < -threshold;
  state.keys['ArrowRight'] = dx >  threshold;
  state.keys['ArrowUp']    = dy < -threshold;
  state.keys['ArrowDown']  = dy >  threshold;
}, { passive: true });

canvas.addEventListener('touchend', () => {
  touchStart = null;
  state.keys['ArrowLeft'] = state.keys['ArrowRight'] =
  state.keys['ArrowUp']   = state.keys['ArrowDown']   = false;
}, { passive: true });

// ── ARRANQUE ─────────────────────────────────────────

$('btn-start').addEventListener('click', () => {
  startLevel(0);
});
