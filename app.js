'use strict';

const CHAPTERS = [
  { id: 'easy',   name: 'Kolay',  place: 'Akşam Parkı',   bg: 'evening',  host: 'ash',      item: 'flowers',  clues: 40, base: 200,  mult: 1,   par: 6 * 60 },
  { id: 'medium', name: 'Orta',   place: 'Park',          bg: 'park',     host: 'liza',     item: 'choco',    clues: 33, base: 400,  mult: 1.5, par: 10 * 60 },
  { id: 'hard',   name: 'Zor',    place: 'Hastane',       bg: 'hospital', host: 'chloe',    item: 'potion_3', clues: 28, base: 700,  mult: 2,   par: 15 * 60 },
  { id: 'expert', name: 'Uzman',  place: 'Kolej',         bg: 'college',  host: 'scarlett', item: 'wine',     clues: 24, base: 1000, mult: 3,   par: 22 * 60 },
  { id: 'master', name: 'Efsane', place: 'Cadı Kulübesi', bg: 'witch',    host: 'luna',     item: 'mushroom', clues: 22, base: 1500, mult: 4,   par: 30 * 60 },
];
const CH = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));

const CAST = {
  ava: {
    name: 'Ava', role: 'Şirket müdürü · Baş karakter', always: true,
    quote: 'Bir fincan kahve, bir bulmaca… gerisi kolay.',
    hello: [
      'Hoş geldin! Bugün hangi bulmacayı çözüyoruz?',
      'Kahvem hazır, bulmacalar da. Başlayalım mı?',
      'Ofiste sakin bir gün… tam sudoku havası.',
      'Toplantılar bekleyebilir. Önce bir bulmaca!',
      'Seni görmek güzel. Zihnini biraz çalıştıralım mı?',
    ],
    poke: ['Hey! Beni değil, bulmacaları çöz.', 'Ne o, utandırma beni…', 'Odaklan bakalım!'],
    win: ['Harikaydın! Seninle gurur duyuyorum.', 'İşte buna profesyonellik derim!', 'Bu performansla seni terfi ettirmeliyim.', 'Kusursuz bir iş çıkardın.'],
    lose: ['Olsun, en iyiler de hata yapar.', 'Bir kahve molası ve yeniden başlarız.', 'Pes etmek yok, birlikte tekrar deneyelim.'],
  },
  ash: {
    name: 'Ash', role: 'Gotik oyuncu kız', chapter: 0,
    quote: 'Sıkıldım… bir tur daha?',
    hello: ['Hey. Burada genelde yalnız takılırım… ama bir tur atabiliriz.', 'Sıkıldım. Hadi bir bulmaca çözelim.', 'Tutorial seviyesi. Isınma turu diyelim.'],
    good: ['Fena değil… hiç fena değil.', 'Combo!', 'Temiz hamle.'],
    bad: ['Oof. Game over\'a bir adım daha.', 'Lag mı yaptın?'],
    cheer: ['Bu oyunu speedrun yapmalısın.', 'GG. Bir tur daha?'],
  },
  liza: {
    name: 'Liza', role: 'Kolejin kraliçesi', chapter: 1,
    quote: 'Bakalım parkımda ne yapabileceksin.',
    hello: ['Parkta benim alanımdasın. Bakalım ne yapabileceksin.', 'Yine mi sen? Peki, göster kendini.'],
    good: ['Hmph, fena değil.', 'Şans eseri mi oldu bu?', 'Tamam, bunu kabul ediyorum.'],
    bad: ['Cidden mi? O rakam oraya mı?', 'Gülmemek için kendimi zor tutuyorum.'],
    cheer: ['Hmph… fena değildi, itiraf ediyorum.'],
  },
  chloe: {
    name: 'Chloe', role: 'Hemşire', chapter: 2,
    quote: 'Bugün hasta yok. O halde sudoku.',
    hello: ['Bugün hasta yok. O halde sudoku.', 'Sessizlik… bulmaca için ideal ortam.'],
    good: ['Nabzın normal, hamlen doğru.', 'Klinik olarak mükemmel.', 'Teşhis: dahi.'],
    bad: ['Teşhis: dikkatsizlik.', 'Bir aspirin ister misin?'],
    cheer: ['Raporuna "mükemmel" yazdım.'],
  },
  scarlett: {
    name: 'Scarlett', role: 'Kolej müdürü', chapter: 3,
    quote: 'Kurallar açık: her rakam bir kez.',
    hello: ['Odama izinsiz girdin. Cezan: bu bulmacayı çözmek.', 'Disiplin, dikkat, sabır. Başla.'],
    good: ['Kurallara uygun. Devam.', 'Disiplinli, beğendim.', 'Kabul edilebilir.'],
    bad: ['Bu kabul edilemez!', 'Kurallar açık: her rakam bir kez!'],
    cheer: ['Disiplinin takdire şayan.'],
  },
  luna: {
    name: 'Luna', role: 'Orman cadısı', chapter: 4,
    quote: 'Davetsiz geldin. Zekânı kanıtla.',
    hello: ['Kulübeme davetsiz mi geldin? O zaman zekânı kanıtla.', 'Kazanım kaynıyor… sen de beynini kaynat.'],
    good: ['Hmm… sezgilerin güçlü.', 'Büyü gibi!', 'Ruhların seni seviyor.'],
    bad: ['Seni kurbağaya çevirmeliyim!', 'Yanlış iksir, yanlış rakam.'],
    cheer: ['Bu kez lanetten kurtuldun.'],
  },
  mia: {
    name: 'Mia', role: 'Öğretmen · Ava\'nın en yakın arkadaşı', stars: 5,
    quote: 'Kendini evinde hisset, canım.',
    cheer: ['Aferin canım, harikasın!', 'Ava sana hayran, biliyor musun?'],
  },
  roxy: {
    name: 'Roxy', role: 'Huysuz kuzen', stars: 15,
    quote: 'Umurumda değil… ama iyiydin.',
    cheer: ['Tamam, kabul… iyiydi. Abartma ama.', 'Hmph. Bir dahakine ben daha hızlı çözerim.'],
  },
  claire: {
    name: 'Claire', role: 'Ava\'nın sekreteri', stars: 30,
    quote: 'Her şey düzenli ve kayıt altında.',
    cheer: ['Sonuçlar kayda geçirildi. Mükemmel.', 'Ava Hanım\'a raporunu ilettim.'],
  },
};
const CAST_ORDER = ['ava', 'ash', 'liza', 'chloe', 'scarlett', 'luna', 'mia', 'roxy', 'claire'];

const UNLOCK_AFTER = 3;
const REWARD_AFTER = 10;
const MAX_MISTAKES = 3;
const MAX_HINTS = 3;
const STORE_KEY = 'ava-sudoku-v2';

const $ = (id) => document.getElementById(id);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const avatar = (id) => `assets/avatars/${id}.webp`;
const bgUrl = (name) => `url(assets/bg/${name}.webp)`;
const fmtNum = (n) => n.toLocaleString('tr-TR');

/* ---------- Storage ---------- */

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

const store = Object.assign({ stats: {}, current: null, opts: {} }, load());
store.opts = Object.assign({ sfx: true, music: true, vibe: true, same: true }, store.opts);

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

function statsOf(id) {
  return (store.stats[id] ||= { played: 0, won: 0, score: 0, stars: 0, best: 0, bestTime: null });
}

function chapterUnlocked(index) {
  return index === 0 || statsOf(CHAPTERS[index - 1].id).won >= UNLOCK_AFTER;
}

function totals() {
  let score = 0, won = 0, stars = 0;
  for (const c of CHAPTERS) {
    const s = statsOf(c.id);
    score += s.score; won += s.won; stars += s.stars;
  }
  return { score, won, stars };
}

function charUnlocked(id) {
  const c = CAST[id];
  if (c.always) return true;
  if (c.chapter != null) return chapterUnlocked(c.chapter);
  return totals().stars >= c.stars;
}

/* ---------- Audio & haptics ---------- */

const SFX = { click: 'click', bad: 'knock', win: 'fun_run' };
const SFX_MAX_MS = { click: 400, bad: 700, win: 2500 };
const sfxCache = {};
let music = null;
let audioCtx = null;

// soft two-note chime, synthesized so it needs no file
function chime() {
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  const t0 = audioCtx.currentTime;
  [[880, 0], [1318.5, 0.08]].forEach(([freq, delay]) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t0 + delay);
    gain.gain.linearRampToValueAtTime(0.18, t0 + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + delay + 0.45);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t0 + delay);
    osc.stop(t0 + delay + 0.5);
  });
}

function sfx(name) {
  if (!store.opts.sfx) return;
  if (name === 'good') {
    try { chime(); } catch {}
    return;
  }
  const src = (sfxCache[name] ||= new Audio(`assets/audio/${SFX[name]}.ogg`));
  const a = src.cloneNode();
  a.volume = name === 'click' ? 0.35 : 0.6;
  a.play().catch(() => {});
  setTimeout(() => a.pause(), SFX_MAX_MS[name]);
}

function vibe(ms) {
  if (store.opts.vibe && navigator.vibrate) navigator.vibrate(ms);
}

function updateMusic() {
  if (store.opts.music && !document.hidden) {
    if (!music) {
      music = new Audio('assets/audio/music.ogg');
      music.loop = true;
      music.volume = 0.3;
    }
    music.play().catch(() => {});
  } else if (music) {
    music.pause();
  }
}

/* ---------- Full screen ---------- */

const fsEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
if (!fsEnabled) document.documentElement.classList.add('no-fs');

function toggleFullscreen() {
  const el = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  } else {
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    Promise.resolve(req.call(el, { navigationUI: 'hide' })).catch(() => {});
  }
}

/* ---------- Effects ---------- */

function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function fxNode(cls, x, y, html = '') {
  const n = document.createElement('div');
  n.className = cls;
  n.style.left = `${x}px`;
  n.style.top = `${y}px`;
  n.innerHTML = html;
  n.addEventListener('animationend', () => n.remove(), { once: true });
  $('fx').appendChild(n);
  return n;
}

function floatText(el, text, bad) {
  const { x, y } = centerOf(el);
  fxNode('float-txt' + (bad ? ' bad' : ''), x, y, text);
}

function burst(el, count = 8) {
  const { x, y } = centerOf(el);
  for (let k = 0; k < count; k++) {
    const angle = (Math.PI * 2 * k) / count + Math.random() * 0.5;
    const dist = 26 + Math.random() * 22;
    const n = fxNode('spark', x, y, Math.random() < 0.5 ? '✦' : '★');
    n.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    n.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
  }
}

function confetti(item) {
  const colors = ['#e0a650', '#f3c46e', '#c0532f', '#8fbf74', '#f6e6cc', '#d98e5f'];
  const w = window.innerWidth;
  for (let k = 0; k < 70; k++) {
    const isItem = item && k % 9 === 0;
    const n = fxNode('confetti' + (isItem ? ' item' : ''), Math.random() * w, 0);
    if (isItem) n.style.backgroundImage = `url(assets/items/${item}.webp)`;
    else n.style.background = pick(colors);
    n.style.setProperty('--dx', `${(Math.random() - 0.5) * 200}px`);
    n.style.setProperty('--r', `${(Math.random() - 0.5) * 1440}deg`);
    n.style.setProperty('--t', `${2.2 + Math.random() * 1.8}s`);
    n.style.setProperty('--d', `${Math.random() * 0.8}s`);
  }
}

function restartAnim(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', () => {
    el.classList.remove(cls);
    el.style.animationDelay = '';
  }, { once: true });
}

function countUp(el, to, ms = 900) {
  const start = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - start) / ms);
    el.textContent = fmtNum(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Puzzle generator ---------- */

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rnd) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function candidates(g, i) {
  const r = (i / 9) | 0, c = i % 9, br = r - (r % 3), bc = c - (c % 3);
  let used = 0;
  for (let k = 0; k < 9; k++) {
    used |= 1 << g[r * 9 + k];
    used |= 1 << g[k * 9 + c];
    used |= 1 << g[(br + ((k / 3) | 0)) * 9 + bc + (k % 3)];
  }
  return ~used & 0x3fe;
}

function bitCount(m) {
  let n = 0;
  while (m) { m &= m - 1; n++; }
  return n;
}

function mostConstrained(g) {
  let best = -1, mask = 0, min = 10;
  for (let i = 0; i < 81; i++) {
    if (g[i]) continue;
    const m = candidates(g, i);
    const n = bitCount(m);
    if (n < min) {
      min = n; best = i; mask = m;
      if (n <= 1) break;
    }
  }
  return { best, mask };
}

function fillGrid(g, rnd) {
  const { best, mask } = mostConstrained(g);
  if (best < 0) return true;
  for (const d of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rnd)) {
    if (!(mask & (1 << d))) continue;
    g[best] = d;
    if (fillGrid(g, rnd)) return true;
  }
  g[best] = 0;
  return false;
}

function countSolutions(g, limit) {
  const { best, mask } = mostConstrained(g);
  if (best < 0) return 1;
  let total = 0;
  for (let d = 1; d <= 9 && total < limit; d++) {
    if (!(mask & (1 << d))) continue;
    g[best] = d;
    total += countSolutions(g, limit - total);
  }
  g[best] = 0;
  return total;
}

function generate(chapterId, seed) {
  const rnd = mulberry32(seed);
  const solution = new Array(81).fill(0);
  fillGrid(solution, rnd);

  const target = CH[chapterId].clues;
  const attempts = target < 30 ? 30 : 1;
  let best = null, bestFilled = 82;
  for (let a = 0; a < attempts && bestFilled > target; a++) {
    const puzzle = solution.slice();
    let filled = 81;
    for (const i of shuffle([...Array(81).keys()], rnd)) {
      if (filled <= target) break;
      const keep = puzzle[i];
      puzzle[i] = 0;
      if (countSolutions(puzzle.slice(), 2) !== 1) puzzle[i] = keep;
      else filled--;
    }
    if (filled < bestFilled) { best = puzzle; bestFilled = filled; }
  }
  return { puzzle: best, solution };
}

/* ---------- Navigation ---------- */

const SCREENS = ['home', 'chapter', 'game', 'cast', 'settings'];
const TAB_SCREENS = ['home', 'cast', 'settings'];
let current = 'home';
let openChapterId = 'easy';

function show(name, push) {
  const prev = current;
  if (prev !== name) {
    const old = $(prev);
    old.classList.add('leaving');
    setTimeout(() => {
      old.classList.remove('leaving');
      if (current !== prev) old.hidden = true;
    }, 220);
  }
  for (const s of SCREENS) if (s !== prev || s === name) $(s).hidden = s !== name;
  current = name;
  $('tabbar').hidden = !TAB_SCREENS.includes(name);
  for (const b of $('tabbar').children) b.classList.toggle('active', b.dataset.tab === name);
  if (push) history.pushState({ screen: name }, '');
  if (name !== 'game') stopTimer();
  if (name === 'home') renderHome();
  if (name === 'cast') renderCast();
  if (name === 'settings') renderSettings();
}

function goBack() {
  if (!$('modal').hidden) return;
  if (current === 'game') {
    if (S && !S.over) save();
    openChapter(S ? S.chapter : openChapterId, false);
  } else if (current === 'chapter') {
    show('home');
  }
}

window.addEventListener('popstate', goBack);

/* ---------- Game state ---------- */

let S = null;
let timerId = null;
let paused = false;
let bubbleTimer = null;

function newGame(chapterId) {
  S = null;
  stopTimer();
  $('loading').hidden = false;
  $('pauseOverlay').hidden = true;
  const stats = statsOf(chapterId);
  stats.played++;
  setupGameChrome(chapterId, stats.played);
  setTimeout(() => {
    const seed = (Math.random() * 2 ** 31) | 0;
    const { puzzle, solution } = generate(chapterId, seed);
    S = {
      chapter: chapterId, game: stats.played, seed, solution,
      given: puzzle.map(Boolean),
      board: puzzle.slice(),
      notes: new Array(81).fill(0),
      time: 0, score: 0, mistakes: 0, hints: 0,
      history: [], selected: -1, notesMode: false, over: false,
    };
    store.current = S;
    save();
    $('loading').hidden = true;
    startPlaying(true);
    hostSay(pick(CAST[CH[chapterId].host].hello), 4000);
  }, 60);
}

function resumeGame(saved) {
  S = saved;
  $('loading').hidden = true;
  setupGameChrome(S.chapter, S.game);
  startPlaying(true);
  hostSay('Kaldığımız yerden devam!', 2500);
}

function setupGameChrome(chapterId, gameNo) {
  const ch = CH[chapterId];
  openChapterId = chapterId;
  $('gameScene').style.backgroundImage = bgUrl(ch.bg);
  $('gPlace').textContent = ch.place;
  $('gLevel').textContent = `${ch.name} · Oyun #${gameNo}`;
  $('gHost').src = avatar(ch.host);
  $('gBubble').classList.add('hide');
  if (current !== 'game') show('game', true);
  buildBoard();
}

function startPlaying(reveal) {
  paused = false;
  $('pauseOverlay').hidden = true;
  render();
  if (reveal) {
    [...$('board').children].forEach((el, i) => {
      el.style.animationDelay = `${(((i / 9) | 0) + (i % 9)) * 22}ms`;
      restartAnim(el, 'reveal');
    });
  }
  startTimer();
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (paused || !S || S.over) return;
    S.time++;
    $('gTime').textContent = fmtTime(S.time);
    if (S.time % 5 === 0) save();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function setPaused(p) {
  if (!S || S.over) return;
  paused = p;
  $('pauseOverlay').hidden = !p;
  save();
}

function hostSay(text, ms = 2600) {
  const b = $('gBubble');
  b.textContent = text;
  b.classList.remove('hide');
  restartAnim(b, 'pop');
  restartAnim($('gHost'), 'react');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.add('hide'), ms);
}

const peersOf = (i) => {
  const r = (i / 9) | 0, c = i % 9, br = r - (r % 3), bc = c - (c % 3);
  const set = new Set();
  for (let k = 0; k < 9; k++) {
    set.add(r * 9 + k);
    set.add(k * 9 + c);
    set.add((br + ((k / 3) | 0)) * 9 + bc + (k % 3));
  }
  set.delete(i);
  return [...set];
};

function pushHistory(i) {
  S.history.push({ i, v: S.board[i], n: S.notes[i] });
  if (S.history.length > 200) S.history.shift();
}

function addScore(delta) {
  S.score = Math.max(0, S.score + Math.round(delta));
}

function input(d) {
  if (!S || S.over || paused) return;
  const i = S.selected;
  if (i < 0 || S.given[i] || S.board[i] === S.solution[i]) return;

  if (S.notesMode) {
    if (S.board[i]) return;
    pushHistory(i);
    S.notes[i] ^= 1 << d;
    vibe(8);
    render();
    save();
    return;
  }

  if (S.board[i] === d) return;
  pushHistory(i);
  S.board[i] = d;
  S.notes[i] = 0;
  const host = CAST[CH[S.chapter].host];
  const mult = CH[S.chapter].mult;
  const cell = $('board').children[i];

  if (d === S.solution[i]) {
    addScore(10 * mult);
    for (const p of peersOf(i)) S.notes[p] &= ~(1 << d);
    render();
    restartAnim($('gScore').parentElement, 'bump');
    restartAnim(cell, 'pop');
    floatText(cell, `+${Math.round(10 * mult)}`);
    burst(cell, 6);
    sfx('good');
    vibe(10);
    const completed = celebrateUnits(i);
    if (!checkWin() && (completed || Math.random() < 0.2)) hostSay(pick(host.good));
  } else {
    S.mistakes++;
    addScore(-25 * mult);
    render();
    restartAnim($('gMistakes').parentElement, 'hurt');
    restartAnim(cell, 'pop');
    restartAnim($('board'), 'shake');
    floatText(cell, `−${Math.round(25 * mult)}`, true);
    sfx('bad');
    vibe([40, 40, 60]);
    if (S.mistakes >= MAX_MISTAKES) lose();
    else hostSay(pick(host.bad));
  }
  save();
}

function erase() {
  if (!S || S.over || paused) return;
  const i = S.selected;
  if (i < 0 || S.given[i] || S.board[i] === S.solution[i]) return;
  if (!S.board[i] && !S.notes[i]) return;
  pushHistory(i);
  S.board[i] = 0;
  S.notes[i] = 0;
  sfx('click');
  render();
  save();
}

function undo() {
  if (!S || S.over || paused) return;
  let h;
  // correct placements are locked, so skip history entries that would overwrite them
  while ((h = S.history.pop()) && S.board[h.i] === S.solution[h.i] && h.v !== S.board[h.i]);
  if (!h) return;
  S.board[h.i] = h.v;
  S.notes[h.i] = h.n;
  S.selected = h.i;
  sfx('click');
  render();
  save();
}

function hint() {
  if (!S || S.over || paused || S.hints >= MAX_HINTS) return;
  let i = S.selected;
  if (i < 0 || S.board[i] === S.solution[i]) {
    const open = S.board.map((v, k) => (v === S.solution[k] ? -1 : k)).filter((k) => k >= 0);
    if (!open.length) return;
    i = pick(open);
  }
  S.hints++;
  const cost = Math.round(50 * CH[S.chapter].mult);
  addScore(-cost);
  S.board[i] = S.solution[i];
  S.notes[i] = 0;
  for (const p of peersOf(i)) S.notes[p] &= ~(1 << S.board[i]);
  S.selected = i;
  render();
  const cell = $('board').children[i];
  restartAnim(cell, 'pop');
  burst(cell, 12);
  floatText(cell, `−${cost}`, true);
  sfx('good');
  celebrateUnits(i);
  if (!checkWin()) hostSay('İksir işe yaradı! ✨');
  save();
}

function celebrateUnits(i) {
  const r = (i / 9) | 0, c = i % 9, br = r - (r % 3), bc = c - (c % 3);
  const units = [
    [...Array(9)].map((_, k) => r * 9 + k),
    [...Array(9)].map((_, k) => k * 9 + c),
    [...Array(9)].map((_, k) => (br + ((k / 3) | 0)) * 9 + bc + (k % 3)),
  ];
  const cells = $('board').children;
  let any = false;
  for (const u of units) {
    if (!u.every((k) => S.board[k] === S.solution[k])) continue;
    any = true;
    u.forEach((k, n) => {
      cells[k].style.animationDelay = `${n * 35}ms`;
      restartAnim(cells[k], 'wave');
    });
  }
  return any;
}

/* ---------- Win / lose ---------- */

function checkWin() {
  if (!S.board.every((v, k) => v === S.solution[k])) return false;
  S.over = true;
  stopTimer();
  const ch = CH[S.chapter];
  const before = new Set(CAST_ORDER.filter(charUnlocked));
  const timeBonus = Math.max(0, Math.round((ch.par - S.time) * ch.mult));
  const perfect = S.mistakes === 0 && S.hints === 0 ? Math.round(250 * ch.mult) : 0;
  const final = S.score + ch.base + timeBonus + perfect;
  const stars = 1 + (S.mistakes === 0 ? 1 : 0) + (S.time <= ch.par && S.hints === 0 ? 1 : 0);

  const st = statsOf(S.chapter);
  const record = final > st.best && st.won > 0;
  st.won++;
  st.score += final;
  st.stars += stars;
  st.best = Math.max(st.best, final);
  st.bestTime = st.bestTime == null ? S.time : Math.min(st.bestTime, S.time);
  store.current = null;
  save();

  const newcomers = CAST_ORDER.filter((id) => charUnlocked(id) && !before.has(id));
  const cheerers = CAST_ORDER.filter((id) => id !== 'ava' && id !== ch.host && charUnlocked(id) && CAST[id].cheer);
  const cheerId = newcomers.find((id) => CAST[id].cheer) || (cheerers.length ? pick(cheerers) : null);
  const { chapter, score, time } = S;
  const reward = st.won === REWARD_AFTER;

  restartAnim($('board'), 'win');
  setTimeout(() => {
    sfx('win');
    vibe([30, 60, 30]);
    confetti(ch.item);
    showModal({
      ava: 'smile',
      title: record ? 'Yeni rekor!' : 'Tebrikler!',
      line: pick(CAST.ava.win),
      stars,
      rows: [
        ['Hamle puanı', score],
        ['Taban puan', ch.base],
        [`Zaman bonusu · ${fmtTime(time)}`, timeBonus],
        ['Kusursuz bonus', perfect],
        ['Toplam', final, 'total'],
      ],
      cheer: cheerId && { id: cheerId, text: pick(CAST[cheerId].cheer) },
      actions: [
        ['Menü', '', () => openChapter(chapter, false)],
        ['Yeni oyun', 'gold', () => newGame(chapter)],
      ],
    });
    if (reward) toast(`Hediye kazandın: ${ch.name} bölüm ödülü!`);
    for (const id of newcomers) toast(`Yeni karakter açıldı: ${CAST[id].name}!`);
    for (let k = 1; k < CHAPTERS.length; k++) {
      if (CHAPTERS[k - 1].id === chapter && st.won === UNLOCK_AFTER) toast(`${CHAPTERS[k].name} zorluğu açıldı!`);
    }
  }, 900);
  return true;
}

function lose() {
  S.over = true;
  stopTimer();
  store.current = null;
  save();
  const { chapter, time } = S;
  setTimeout(() => {
    showModal({
      ava: 'shy',
      title: 'Olmadı bu sefer…',
      line: pick(CAST.ava.lose),
      rows: [['Hata', `${MAX_MISTAKES}/${MAX_MISTAKES}`], ['Süre', fmtTime(time)]],
      actions: [
        ['Menü', '', () => openChapter(chapter, false)],
        ['Tekrar dene', 'gold', () => newGame(chapter)],
      ],
    });
  }, 600);
}

function showModal({ ava, title, line, stars, rows = [], cheer, actions }) {
  const bg = $('modal');
  bg.classList.remove('closing');
  const img = $('mAva');
  if (ava) img.src = `assets/ava/${ava}.webp`;
  else img.removeAttribute('src');
  $('mTitle').textContent = title;
  $('mLine').textContent = line || '';
  $('mStars').innerHTML = stars
    ? [1, 2, 3].map((n) => `<span class="${n <= stars ? '' : 'off'}">★</span>`).join('')
    : '';
  $('mBreakdown').innerHTML = rows
    .map(([k, v, cls], n) => `<div class="${cls || ''}" style="--i:${n}"><span>${k}</span><span>${typeof v === 'number' ? fmtNum(v) : v}</span></div>`)
    .join('');
  const total = rows.findIndex((r) => r[2] === 'total');
  if (total >= 0) countUp($('mBreakdown').children[total].lastElementChild, rows[total][1], 1200);
  const ch = $('mCheer');
  ch.hidden = !cheer;
  if (cheer) {
    ch.querySelector('img').src = avatar(cheer.id);
    ch.querySelector('p').innerHTML = `<b>${CAST[cheer.id].name}:</b> ${cheer.text}`;
  }
  const box = $('mActions');
  box.innerHTML = '';
  for (const [label, cls, fn] of actions) {
    const b = document.createElement('button');
    b.className = `btn ${cls}`;
    b.textContent = label;
    b.onclick = () => { sfx('click'); closeModal(fn); };
    box.appendChild(b);
  }
  bg.hidden = false;
}

function closeModal(then) {
  const bg = $('modal');
  bg.classList.add('closing');
  setTimeout(() => {
    bg.hidden = true;
    bg.classList.remove('closing');
    then();
  }, 220);
}

let toastTimer = null;
const toastQueue = [];

function toast(text) {
  toastQueue.push(text);
  if (!toastTimer) nextToast();
}

function nextToast() {
  const t = $('toast');
  const text = toastQueue.shift();
  if (!text) { t.hidden = true; toastTimer = null; return; }
  t.classList.remove('out');
  t.textContent = text;
  t.hidden = false;
  toastTimer = setTimeout(() => {
    t.classList.add('out');
    toastTimer = setTimeout(nextToast, 300);
  }, 2400);
}

/* ---------- Game rendering ---------- */

function fmtTime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const mm = String(m).padStart(2, '0'), ss = String(sec).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function buildBoard() {
  const board = $('board');
  board.innerHTML = '';
  for (let i = 0; i < 81; i++) {
    const r = (i / 9) | 0, c = i % 9;
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (c === 2 || c === 5) cell.classList.add('br');
    if (r === 2 || r === 5) cell.classList.add('bb');
    if (c === 8) cell.classList.add('ec');
    if (r === 8) cell.classList.add('er');
    cell.addEventListener('pointerdown', () => {
      if (!S || paused || S.over) return;
      S.selected = i;
      render();
    });
    board.appendChild(cell);
  }

  const pad = $('numpad');
  pad.innerHTML = '';
  for (let d = 1; d <= 9; d++) {
    const b = document.createElement('button');
    b.className = 'num';
    b.innerHTML = `${d}<small></small>`;
    b.onclick = () => input(d);
    pad.appendChild(b);
  }
}

function render() {
  if (!S) return;
  $('gScore').textContent = fmtNum(S.score);
  $('gMistakes').textContent = `${S.mistakes}/${MAX_MISTAKES}`;
  $('gTime').textContent = fmtTime(S.time);
  $('notesBtn').classList.toggle('on', S.notesMode);
  $('notesState').textContent = S.notesMode ? 'açık' : 'kapalı';
  $('numpad').classList.toggle('notes-mode', S.notesMode);
  $('hintsLeft').textContent = MAX_HINTS - S.hints;
  $('hintBtn').disabled = S.hints >= MAX_HINTS;

  const sel = S.selected;
  const selVal = sel >= 0 && store.opts.same ? S.board[sel] : 0;
  const peers = sel >= 0 ? new Set(peersOf(sel)) : new Set();
  const cells = $('board').children;

  for (let i = 0; i < 81; i++) {
    const el = cells[i];
    const v = S.board[i];
    el.classList.toggle('given', S.given[i]);
    el.classList.toggle('selected', i === sel);
    el.classList.toggle('related', peers.has(i));
    el.classList.toggle('same', !!selVal && v === selVal && i !== sel);
    el.classList.toggle('error', !!v && v !== S.solution[i]);

    if (v) {
      el.textContent = v;
    } else if (S.notes[i]) {
      let html = '<div class="notes">';
      for (let n = 1; n <= 9; n++) html += `<span>${S.notes[i] & (1 << n) ? n : ''}</span>`;
      el.innerHTML = html + '</div>';
    } else {
      el.textContent = '';
    }
  }

  const counts = new Array(10).fill(0);
  S.board.forEach((v, k) => { if (v && v === S.solution[k]) counts[v]++; });
  [...$('numpad').children].forEach((b, k) => {
    const left = 9 - counts[k + 1];
    b.disabled = left === 0;
    b.querySelector('small').textContent = left || '';
  });
}

/* ---------- Home ---------- */

function renderHome() {
  const t = totals();
  $('totalScore').textContent = fmtNum(t.score);
  $('totalStars').textContent = t.stars;
  $('avaBubble').textContent = pick(CAST.ava.hello);

  const cur = store.current;
  $('resumeBtn').hidden = !cur;
  if (cur) $('resumeBtn').textContent = `Devam et · ${CH[cur.chapter].name} · ${fmtTime(cur.time)}`;

  const list = $('chapterList');
  list.innerHTML = '';
  CHAPTERS.forEach((ch, idx) => {
    const unlocked = chapterUnlocked(idx);
    const st = statsOf(ch.id);
    const card = document.createElement('button');
    card.className = 'chapter-card' + (unlocked ? '' : ' locked');
    card.style.backgroundImage = bgUrl(ch.bg);
    card.style.setProperty('--i', idx);
    card.innerHTML = `
      <img class="avatar" src="${avatar(ch.host)}" alt="">
      <div class="info">
        <h3>${ch.name}<span class="mult">×${ch.mult}</span></h3>
        <small>${ch.place} · ${CAST[ch.host].name}</small>
        ${unlocked
          ? `<div class="meta"><span>🏆 ${st.won} galibiyet</span><span>★ ${st.stars}</span>${st.best ? `<span>En iyi ${fmtNum(st.best)}</span>` : ''}</div>`
          : `<div class="lock-note">🔒 ${CHAPTERS[idx - 1].name} zorluğunda ${UNLOCK_AFTER} oyun kazan (${statsOf(CHAPTERS[idx - 1].id).won}/${UNLOCK_AFTER})</div>`}
      </div>
      <img class="reward${st.won >= REWARD_AFTER ? ' got' : ''}" src="assets/items/${ch.item}.webp" alt="" title="Hediye">`;
    card.onclick = () => {
      sfx('click');
      if (unlocked) openChapter(ch.id, true);
      else toast(`${CHAPTERS[idx - 1].name} zorluğunda ${UNLOCK_AFTER} oyun kazanmalısın`);
    };
    list.appendChild(card);
  });
}

let pokeReset = null;
$('avaSprite').addEventListener('click', () => {
  sfx('click');
  vibe(10);
  $('avaSprite').src = 'assets/ava/shy.webp';
  $('avaBubble').textContent = pick(CAST.ava.poke);
  restartAnim($('avaBubble'), 'pop');
  burst($('avaSprite'), 10);
  clearTimeout(pokeReset);
  pokeReset = setTimeout(() => { $('avaSprite').src = 'assets/ava/smile.webp'; }, 2200);
});

$('resumeBtn').onclick = () => {
  sfx('click');
  const cur = store.current;
  openChapter(cur.chapter, true);
  show('game', true);
  resumeGame(cur);
};

/* ---------- Chapter ---------- */

function openChapter(id, push) {
  const ch = CH[id];
  const st = statsOf(id);
  openChapterId = id;
  $('chapterHead').style.backgroundImage = bgUrl(ch.bg);
  $('chPlace').textContent = ch.place;
  $('chName').textContent = ch.name;
  $('chHost').src = avatar(ch.host);
  $('chBubble').textContent = pick(CAST[ch.host].hello);
  $('chInfo').textContent = `Her oyun rastgele · ${ch.clues} ipucu · ×${ch.mult} puan · hedef süre ${fmtTime(ch.par)}`;

  const winRate = st.played ? Math.round((st.won / st.played) * 100) : 0;
  const cells = [
    ['Oynanan', st.played],
    ['Kazanılan', st.won],
    ['Başarı', `%${winRate}`],
    ['En iyi puan', st.best ? fmtNum(st.best) : '—'],
    ['En iyi süre', st.bestTime != null ? fmtTime(st.bestTime) : '—'],
    ['Yıldız', `★ ${st.stars}`],
  ];
  $('chStats').innerHTML = cells
    .map(([k, v], n) => `<div class="ch-stat" style="--i:${n}"><small>${k}</small><b>${v}</b></div>`)
    .join('');

  const cur = store.current;
  const resumable = cur && cur.chapter === id;
  $('chResumeBtn').hidden = !resumable;
  if (resumable) $('chResumeBtn').textContent = `Devam et · ${fmtTime(cur.time)}`;

  const got = st.won >= REWARD_AFTER;
  const rb = $('chReward');
  rb.classList.toggle('got', got);
  rb.innerHTML = `<img src="assets/items/${ch.item}.webp" alt=""><span>${got
    ? `${CAST[ch.host].name} sana bu hediyeyi verdi!`
    : `${REWARD_AFTER} oyun kazan, ${CAST[ch.host].name} sana bir hediye versin (${st.won}/${REWARD_AFTER})`}</span>`;

  show('chapter', push);
  $('chapter').scrollTop = 0;
}

$('newGameBtn').onclick = () => {
  sfx('click');
  const cur = store.current;
  if (!cur) return newGame(openChapterId);
  showModal({
    ava: 'normal',
    title: 'Yarım kalan oyun',
    line: `${CH[cur.chapter].name} oyunun (${fmtTime(cur.time)}) silinecek. Emin misin?`,
    actions: [
      ['Vazgeç', '', () => {}],
      ['Yeni başlat', 'gold', () => newGame(openChapterId)],
    ],
  });
};

$('chResumeBtn').onclick = () => {
  sfx('click');
  resumeGame(store.current);
};

/* ---------- Characters ---------- */

function renderCast() {
  const grid = $('castGrid');
  grid.innerHTML = '';
  CAST_ORDER.forEach((id, n) => {
    const c = CAST[id];
    const open = charUnlocked(id);
    let hint = '';
    if (!open) hint = c.chapter != null ? `${CHAPTERS[c.chapter].name} zorluğunu aç` : `${c.stars} yıldızda açılır`;
    const card = document.createElement('div');
    card.className = 'cast-card' + (open ? '' : ' locked') + (id === 'ava' ? ' main' : '');
    card.style.setProperty('--i', n);
    card.innerHTML = `
      <img class="avatar" src="${avatar(id)}" alt="">
      <div>
        <h3>${open ? c.name : '???'}</h3>
        <small>${open ? c.role : hint}</small>
        ${open ? `<p>“${c.quote}”</p>` : ''}
      </div>`;
    grid.appendChild(card);
  });
}

/* ---------- Settings ---------- */

const OPT_INPUTS = { optSfx: 'sfx', optMusic: 'music', optVibe: 'vibe', optSame: 'same' };

function renderSettings() {
  for (const [el, key] of Object.entries(OPT_INPUTS)) $(el).checked = store.opts[key];
}

for (const [el, key] of Object.entries(OPT_INPUTS)) {
  $(el).addEventListener('change', (e) => {
    store.opts[key] = e.target.checked;
    save();
    sfx('click');
    if (key === 'music') updateMusic();
  });
}

$('resetBtn').onclick = () => {
  showModal({
    ava: 'shy',
    title: 'Emin misin?',
    line: 'Tüm puanların, yıldızların ve açtığın zorluklar silinecek.',
    actions: [
      ['Vazgeç', '', () => {}],
      ['Sıfırla', 'danger', () => {
        store.stats = {};
        store.current = null;
        save();
        toast('İlerleme sıfırlandı');
        show('home');
      }],
    ],
  });
};

/* ---------- Events ---------- */

for (const b of $('tabbar').children) {
  b.onclick = () => { sfx('click'); show(b.dataset.tab); };
}
document.querySelectorAll('[data-back]').forEach((b) => {
  b.onclick = () => { sfx('click'); history.state ? history.back() : goBack(); };
});
document.querySelectorAll('.fs-btn').forEach((b) => {
  b.onclick = () => { sfx('click'); toggleFullscreen(); };
});

$('pauseBtn').onclick = () => { sfx('click'); setPaused(!paused); };
$('resumePlayBtn').onclick = () => setPaused(false);
$('undoBtn').onclick = undo;
$('eraseBtn').onclick = erase;
$('hintBtn').onclick = hint;
$('notesBtn').onclick = () => {
  if (!S) return;
  S.notesMode = !S.notesMode;
  sfx('click');
  render();
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'f' && !e.ctrlKey && !e.metaKey) { toggleFullscreen(); return; }
  if (current !== 'game' || !$('modal').hidden || !S) return;
  const k = e.key;
  if (k === ' ' || k === 'p') { e.preventDefault(); setPaused(!paused); return; }
  if (paused) return;
  if (/^[1-9]$/.test(k)) input(+k);
  else if (k === 'Backspace' || k === 'Delete' || k === '0') erase();
  else if (k === 'n') { S.notesMode = !S.notesMode; render(); }
  else if (k === 'h') hint();
  else if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); undo(); }
  else if (k.startsWith('Arrow')) {
    e.preventDefault();
    let i = S.selected < 0 ? 40 : S.selected;
    const r = (i / 9) | 0, c = i % 9;
    if (k === 'ArrowUp') i = ((r + 8) % 9) * 9 + c;
    if (k === 'ArrowDown') i = ((r + 1) % 9) * 9 + c;
    if (k === 'ArrowLeft') i = r * 9 + ((c + 8) % 9);
    if (k === 'ArrowRight') i = r * 9 + ((c + 1) % 9);
    S.selected = i;
    render();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && current === 'game' && S && !S.over) setPaused(true);
  updateMusic();
});

document.addEventListener('pointerdown', function firstTouch() {
  updateMusic();
  document.removeEventListener('pointerdown', firstTouch);
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

/* ---------- Boot ---------- */

// iOS home-screen apps report a viewport one status bar shorter than the screen they draw on,
// so there the full screen height is used instead of the viewport
function syncHeight() {
  let h = window.innerHeight;
  if (navigator.standalone) {
    const portrait = matchMedia('(orientation: portrait)').matches;
    h = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
  }
  document.documentElement.style.setProperty('--app-h', `${h}px`);
  window.scrollTo(0, 0);
}
syncHeight();
window.addEventListener('resize', syncHeight);
if (window.visualViewport) visualViewport.addEventListener('resize', syncHeight);
window.addEventListener('orientationchange', () => setTimeout(syncHeight, 300));

history.replaceState(null, '');
show('home');

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
