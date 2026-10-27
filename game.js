const BASE_HP = 100;
const PLAYER_MAX_HP = 100;
const SHARD_COUNT = 22;
const BOSS_ROUND = 5;
const INVESTOR_GOLD = 100000;

const foeRow = document.getElementById("foeRow");
const replayBtn = document.getElementById("replayBtn");
const hpEl = document.getElementById("hp");
const goldEl = document.getElementById("gold");
const goldHud = document.querySelector(".gold");
const hintEl = document.getElementById("hint");
const fx = document.getElementById("fx");
const investorBtn = document.getElementById("investorBtn");
const rebirth = document.getElementById("rebirth");
const rebirthClose = document.getElementById("rebirthClose");
const rebirthGo = document.getElementById("rebirthGo");
const rebirthCopy = document.getElementById("rebirthCopy");
const tpFlash = document.getElementById("tpFlash");
const shopBtn = document.getElementById("shopBtn");
const shop = document.getElementById("shop");
const shopList = document.getElementById("shopList");
const playerStats = document.getElementById("playerStats");
const maxHpEl = document.getElementById("maxHp");
const wheelOverlay = document.getElementById("wheelOverlay");
const wheel = document.getElementById("wheel");
const wheelResult = document.getElementById("wheelResult");
const spellStage = document.getElementById("spellStage");
const grimoireBtn = document.getElementById("grimoireBtn");
const grimoire = document.getElementById("grimoire");
const grimoireList = document.getElementById("grimoireList");
const equippedLabel = document.getElementById("equippedLabel");
const grimoireClose = document.getElementById("grimoireClose");
const roundLine = document.getElementById("roundLine");
const foeLabel = document.getElementById("foeLabel");
const playerHpEl = document.getElementById("playerHp");
const heroEl = document.getElementById("hero");
const utBattle = document.getElementById("utBattle");
const utBox = document.getElementById("utBox");
const utSoul = document.getElementById("utSoul");
const utFlavor = document.getElementById("utFlavor");
const utFight = document.getElementById("utFight");
const utAct = document.getElementById("utAct");
const utItem = document.getElementById("utItem");
const utMercy = document.getElementById("utMercy");
const rebirthSpeech = document.getElementById("rebirthSpeech");

const stats = {
  damage: 10,
  hits: 1,
  coins: 10,
  luck: 5,
  magnet: 2500,
};

const upgrades = [
  {
    id: "damage",
    name: "Dégâts",
    desc: "+5 dégâts par coup",
    level: 0,
    max: 10,
    baseCost: 12,
    apply() {
      stats.damage += 5;
    },
  },
  {
    id: "hits",
    name: "Nombre de coups",
    desc: "+1 coup à chaque clic",
    level: 0,
    max: 6,
    baseCost: 18,
    apply() {
      stats.hits += 1;
    },
  },
  {
    id: "coins",
    name: "Pluie d’or",
    desc: "+3 pièces à l’explosion",
    level: 0,
    max: 8,
    baseCost: 15,
    apply() {
      stats.coins += 3;
    },
  },
  {
    id: "luck",
    name: "Fortune",
    desc: "Les pièces valent plus de G",
    level: 0,
    max: 6,
    baseCost: 20,
    apply() {
      stats.luck += 2;
    },
  },
  {
    id: "magnet",
    name: "Aimant",
    desc: "Les pièces reviennent plus vite",
    level: 0,
    max: 5,
    baseCost: 16,
    apply() {
      stats.magnet = Math.max(400, stats.magnet - 400);
    },
  },
];

const SPELL_COST = 25;
const SPELL_COLORS = ["#7c5cff", "#ff7ad9", "#39d98a", "#ffd24a", "#ff6b6b", "#5cc8ff", "#ff9f43", "#c084fc"];
const SPELL_ICONS = {
  fromage: "🧀",
  moustache: "〰️",
  canard: "🦆",
  disco: "🪩",
  baguette: "🥖",
  mime: "🧤",
  yaourt: "🥛",
  honk: "🪿",
  chaussette: "🧦",
  couscous: "🍲",
  nounours: "🧸",
  banane: "🍌",
  pinata: "🪅",
  escargot: "🐌",
  toux: "💨",
  politesse: "🙏",
  pet: "☁️",
  yaourt2: "🥄",
  trombone: "📎",
  gaufre: "🧇",
  op: "💥",
};

const spells = [
  { id: "fromage", name: "TVA fromagère", text: "Taxe le fromage. Tu touches un peu de G.", apply: () => { buffs.cheese = true; gold += scaled(4); } },
  { id: "moustache", name: "Impôt moustache", text: "Redevance poilue. Tes dégâts montent avec le round.", apply: () => { buffs.mustache = true; stats.damage += scaled(2); } },
  { id: "canard", name: "Taxe canard", text: "COIN COIN. Le bouton devient un canard imposable.", apply: () => { buffs.duck = true; } },
  { id: "disco", name: "TVA disco", text: "Le bouton fait la java 4 secondes. C’est déductible.", apply: () => {
      buffs.disco = true;
      window.setTimeout(() => {
        buffs.disco = false;
        render();
      }, 4000);
    } },
  { id: "baguette", name: "CSG baguette", text: "Les pièces reviennent plus vite. Pain fiscal.", apply: () => { document.body.classList.add("baguette"); stats.magnet = Math.max(250, stats.magnet - scaled(600)); } },
  { id: "mime", name: "Impôt invisible", text: "Le bouton existe… à peine. Comme tes abattements.", apply: () => { buffs.mime = true; } },
  { id: "yaourt", name: "TVA yaourt", text: "Traînée rose + G. Scale avec le round.", apply: () => { buffs.yogurt = true; gold += scaled(3); } },
  { id: "honk", name: "Oie fiscale", text: "L’oie te reverse un crédit d’impôt en G.", apply: () => { gold += scaled(12); } },
  { id: "chaussette", name: "Amende chaussette", text: "Tu perds un peu de G. Toujours prévisible.", apply: () => { gold = Math.max(0, gold - scaled(5)); } },
  { id: "couscous", name: "Crédit repas", text: "Tu te resserves. Soigne TES PV.", apply: () => { playerHp = Math.min(playerMaxHp, playerHp + scaled(25)); } },
  { id: "nounours", name: "Contrôle fiscal nounours", text: "Laser de plus en plus violent.", apply: () => {
      hitActive(scaled(30));
    } },
  { id: "banane", name: "Niche banane", text: "Le prochain clic glisse à côté. Non déductible.", apply: () => { buffs.missNext = true; } },
  { id: "pinata", name: "Forfait piñata", text: "Plus de pièces et plus de G selon le round.", apply: () => { stats.coins += scaled(4); gold += scaled(8); } },
  { id: "escargot", name: "Retard de paiement", text: "L’escargot te file de l’or. Les pièces trainent.", apply: () => { stats.magnet += 700; gold += scaled(5); } },
  { id: "toux", name: "Taxe atchoum", text: "+1 coup par clic. C’est cotisé.", apply: () => { stats.hits += 1; } },
  { id: "politesse", name: "S’il-vous-plaît URSSAF", text: "Tu te soignes (plus fort plus tard).", apply: () => { playerHp = Math.min(playerMaxHp, playerHp + scaled(18)); } },
  { id: "pet", name: "Taxe carbone", text: "Tes dégâts explosent avec le round.", apply: () => { stats.damage += scaled(4); } },
  { id: "yaourt2", name: "Huissier-cuillère", text: "Saisit un morceau. Dégâts scalés.", apply: () => {
      stats.damage += scaled(8);
      hitActive(scaled(14));
    } },
  { id: "trombone", name: "Dossier trombone", text: "+1 coup par clic. C’est attaché au formulaire.", apply: () => { stats.hits += 1; } },
  { id: "gaufre", name: "Report gaufre", text: "Les pièces reviennent beaucoup plus vite.", apply: () => { stats.magnet = Math.max(200, stats.magnet - scaled(700)); } },
  {
    id: "op",
    name: "REDRESSEMENT FISCAL COSMIQUE™",
    text: "0,1% : le bouton est juridiquement liquidé. +777 G, stats absurdes.",
    op: true,
    apply: () => {
      gold += scaled(777);
      stats.damage += scaled(50);
      stats.hits += 5;
      stats.coins += scaled(12);
      stats.luck += scaled(8);
      stats.magnet = 200;
      buffs.opAura = true;
      for (const foe of livingFoes()) {
        foe.hp = 0;
      }
    },
  },
];

const normalSpells = spells.filter((spell) => !spell.op);
const opSpell = spells.find((spell) => spell.op);

const buffs = {
  cheese: false,
  duck: false,
  mustache: false,
  yogurt: false,
  missNext: false,
  mime: false,
  disco: false,
  opAura: false,
};

let spinning = false;
let equippedSpell = null;
const knownSpells = new Set();
const ownedPowers = new Set();
const powerRank = {};
let equippedPower = null;

const BOSS_POWERS = {
  swords: {
    id: "swords",
    name: "Lames croisées",
    icon: "🗡️",
    text: "À chaque clic, des épées se croisent vers l’ennemi.",
  },
  necro: {
    id: "necro",
    name: "Nécromancie",
    icon: "☠️",
    text: "À chaque clic, d’anciens boutons foncent vers l’ennemi.",
  },
  comets: {
    id: "comets",
    name: "Pluie de comètes",
    icon: "☄️",
    text: "À chaque clic, une comète vise l’ennemi.",
  },
  rain: {
    id: "rain",
    name: "Déluge de haches",
    icon: "🪓",
    text: "À chaque clic, des haches tombent sur l’ennemi.",
  },
  spiral: {
    id: "spiral",
    name: "Spirale stellaire",
    icon: "✦",
    text: "À chaque clic, des étoiles partent en ligne droite vers l’ennemi.",
  },
  sandwich: {
    id: "sandwich",
    name: "Faisceau jambon-beurre",
    icon: "🥪",
    text: "À chaque clic, des sandwichs partent en ligne droite vers l’ennemi.",
  },
};
let round = 1;
let victories = 0;
let zone = 1;
let investorUnlocked = false;
let foes = [];
let focusFoe = null;
let playerMaxHp = PLAYER_MAX_HP;
let playerHp = PLAYER_MAX_HP;
let playerKo = false;
let goldMult = 1;
const soul = { x: 180, y: 84 };
const keys = { up: false, down: false, left: false, right: false };
let soulIframes = 0;
const INVESTOR_LINES = [
  "« Les affaires, c’est la guerre. Signe ici. »",
  "« Boardwalk n’attend pas les pauvres. »",
  "« 100 000 G et tu vis dans le luxe. Ou tu crèves. »",
  "« Je ne construis pas d’hôtels pour les lâches. »",
];
const CHANCE_CARDS = [
  { text: "Carte Chance : +12 dégâts !", apply: () => { stats.damage += 12; } },
  { text: "Carte Chance : +2 coups par clic !", apply: () => { stats.hits += 2; } },
  { text: "Carte Chance : pluie d’or x2 !", apply: () => { stats.coins += 12; } },
  { text: "Carte Chance : aimant turbo !", apply: () => { stats.magnet = 350; } },
  { text: "Carte Chance : +40 PV max !", apply: () => { playerMaxHp += 40; playerHp = playerMaxHp; } },
  { text: "Carte Chance : fortune +8 !", apply: () => { stats.luck += 8; } },
];
const ACT_LINES = [
  "* tu dis « c’est juste un bouton ». Il est vexé.",
  "* tu poses. Un air trop fort commence.",
  "* tu tends 3 G. Le boss les ignore.",
  "* tu le complimentes. Il rougit. Ça ne change rien.",
  "* tu checkes tes stats. Toujours pas assez.",
];
let gold = 0;
let dead = false;
let shots = [];
let retaliateTimer = 0;
let coinsLeft = 0;
let coins = [];
let animating = false;
let audioCtx = null;
let magnetChimePlayed = false;
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight * 0.72,
};

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
  }
  if (event.key === "ArrowUp") {
    keys.up = true;
  }
  if (event.key === "ArrowDown") {
    keys.down = true;
  }
  if (event.key === "ArrowLeft") {
    keys.left = true;
  }
  if (event.key === "ArrowRight") {
    keys.right = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    keys.up = false;
  }
  if (event.key === "ArrowDown") {
    keys.down = false;
  }
  if (event.key === "ArrowLeft") {
    keys.left = false;
  }
  if (event.key === "ArrowRight") {
    keys.right = false;
  }
});

function isBossRound(n) {
  return n > 0 && n % BOSS_ROUND === 0;
}

function isBoss() {
  return isBossRound(round);
}

function isMini() {
  return !isBoss() && round > BOSS_ROUND;
}

function foesPerRound() {
  if (zone >= 3) {
    return isBoss() ? 1 : 3;
  }
  return zone >= 2 ? 2 : 1;
}

function zoneName() {
  if (zone >= 3) {
    return "Accélérateur de sandwichs";
  }
  return zone >= 2 ? "Boardwalk" : "Sous-sol";
}

function utActive() {
  return Boolean(utBattle && !utBattle.classList.contains("hidden") && isBoss() && !dead && !playerKo);
}

function livingFoes() {
  return foes.filter((foe) => !foe.dead);
}

function activeFoe() {
  if (focusFoe && !focusFoe.dead) {
    return focusFoe;
  }
  return livingFoes()[0] || null;
}

function hitActive(dmg) {
  const foe = activeFoe();
  if (!foe || dead) {
    return;
  }
  foe.hp = Math.max(0, foe.hp - dmg);
  showHit(foe, dmg);
}

function victimMaxHp() {
  const wave = Math.floor((round - 1) / BOSS_ROUND);
  if (isBoss()) {
    if (bossType() === "sandwich") {
      return 2400 + wave * 500;
    }
    if (bossType() === "necro") {
      return 1600 + wave * 450;
    }
    return 400 + wave * 150;
  }
  return 80 + round * 28 + wave * 25;
}

function hasHostileShots() {
  return shots.some((shot) => shot.team !== "player");
}

function bossBusy() {
  return Boolean(retaliateTimer) || hasHostileShots();
}

function teamDmg(base, team) {
  if (team !== "player") {
    return base;
  }
  const rank = powerRank[equippedPower] || 1;
  return base + 6 + (rank - 1) * 8;
}

function spellScale() {
  return 1 + (round - 1) * 0.4;
}

function scaled(n) {
  return Math.max(1, Math.round(n * spellScale()));
}

function bossIndex() {
  return Math.max(1, Math.round(round / BOSS_ROUND));
}

function bossType() {
  if (zone >= 3) {
    return "sandwich";
  }
  const types = ["swords", "necro", "comets", "rain", "spiral"];
  return types[(bossIndex() - 1) % types.length];
}

function foeName() {
  if (isBoss()) {
    const titles = {
      swords: "BOSS Lames",
      necro: "Nécromancien",
      comets: "BOSS Comètes",
      rain: "BOSS Déluge",
      spiral: "BOSS Spirale",
      sandwich: "Collisionneur 🥪",
    };
    return titles[bossType()] || "BOSS";
  }
  if (zone >= 3) {
    return isMini() ? "Quark-pain" : "Particule 🥪";
  }
  if (isMini()) {
    return "Mini";
  }
  return "Victime";
}

function ensureAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone({ type, freq, endFreq, duration, volume, delay = 0 }) {
  const ctx = ensureAudio();
  if (!ctx) {
    return;
  }
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), start + duration);
  }
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playShatter() {
  playTone({ type: "sawtooth", freq: 520, endFreq: 90, duration: 0.28, volume: 0.08 });
  playTone({ type: "triangle", freq: 1400, endFreq: 400, duration: 0.18, volume: 0.05, delay: 0.02 });
}

function playCoinSound(value) {
  const pitch = 0.85 + value * 0.08;
  playTone({ type: "triangle", freq: 880 * pitch, endFreq: 1400 * pitch, duration: 0.16, volume: 0.1 });
  playTone({ type: "square", freq: 1760 * pitch, endFreq: 2200 * pitch, duration: 0.08, volume: 0.03, delay: 0.02 });
}

function playMagnetSound() {
  playTone({ type: "sine", freq: 420, endFreq: 760, duration: 0.22, volume: 0.05 });
}

function upgradeCost(item) {
  return Math.floor(item.baseCost * 1.55 ** item.level);
}

function renderShop() {
  playerStats.textContent = `Dégâts ${stats.damage} · Coups ${stats.hits}`;
  shopList.innerHTML = "";
  for (const item of upgrades) {
    const maxed = item.level >= item.max;
    const cost = upgradeCost(item);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "upgrade";
    row.disabled = maxed || gold < cost;
    row.innerHTML = `
      <span class="upgrade-top">
        <span>${item.name} · niv. ${item.level}</span>
        <span class="upgrade-cost">${maxed ? "MAX" : `${cost} G`}</span>
      </span>
      <span class="upgrade-desc">${item.desc}</span>
    `;
    row.addEventListener("click", () => buyUpgrade(item));
    shopList.appendChild(row);
  }

  const spellRow = document.createElement("button");
  spellRow.type = "button";
  spellRow.className = "upgrade spell";
  spellRow.disabled = spinning || gold < SPELL_COST;
  const spellName = equippedSpell ? equippedSpell.name : "Roue aléatoire";
  spellRow.innerHTML = `
    <span class="upgrade-top">
      <span>Impôt</span>
      <span class="upgrade-cost">${SPELL_COST} G</span>
    </span>
    <span class="upgrade-desc">${
      equippedSpell
        ? `Paie l’impôt équipé : ${spellName}`
        : "Aucun impôt équipé : tourne la roue fiscale (redressement à 0,1%)."
    }</span>
  `;
  spellRow.addEventListener("click", buySpellSpin);
  shopList.appendChild(spellRow);
}

function buyUpgrade(item) {
  const cost = upgradeCost(item);
  if (item.level >= item.max || gold < cost) {
    return;
  }
  gold -= cost;
  item.level += 1;
  item.apply();
  playTone({ type: "triangle", freq: 520, endFreq: 880, duration: 0.16, volume: 0.08 });
  hintEl.textContent = `${item.name} amélioré !`;
  render();
  renderShop();
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickWinner(shown) {
  if (Math.random() < 0.001) {
    return opSpell;
  }
  return shown[Math.floor(Math.random() * shown.length)];
}

function buildWheel(slices) {
  const n = slices.length;
  const stops = slices
    .map((slice, index) => {
      const color = slice.op ? "#fff3a8" : SPELL_COLORS[index % SPELL_COLORS.length];
      return `${color} ${(index / n) * 360}deg ${((index + 1) / n) * 360}deg`;
    })
    .join(", ");
  wheel.style.background = `conic-gradient(${stops})`;
  wheel.innerHTML = "";
  slices.forEach((slice, index) => {
    const label = document.createElement("span");
    label.className = "wheel-slice-label";
    label.textContent = slice.op ? "OP???" : slice.name;
    const angle = (index + 0.5) * (360 / n);
    label.style.transform = `rotate(${angle}deg) translate(18px, -0.5em)`;
    wheel.appendChild(label);
  });
}

function playWheelSound() {
  for (let i = 0; i < 10; i += 1) {
    playTone({
      type: "square",
      freq: 280 + i * 40,
      endFreq: 320 + i * 50,
      duration: 0.08,
      volume: 0.03,
      delay: i * 0.18,
    });
  }
}

function renderGrimoire() {
  grimoireList.innerHTML = "";
  const owned = spells.filter((spell) => knownSpells.has(spell.id));
  const powers = [...ownedPowers].map((id) => BOSS_POWERS[id]).filter(Boolean);
  if (!owned.length && !powers.length) {
    const empty = document.createElement("p");
    empty.className = "empty-grimoire";
    empty.textContent =
      "Aucun impôt. Bats un boss, ou achète Impôt pour la roue fiscale.";
    grimoireList.appendChild(empty);
    return;
  }

  for (const power of powers) {
    const row = document.createElement("div");
    row.className = "upgrade spell-entry";
    const selected = equippedPower === power.id;
    if (selected) {
      row.classList.add("selected");
    }
    const rank = powerRank[power.id] || 1;
    row.innerHTML = `
      <span class="upgrade-top">
        <span>${power.icon} ${power.name}</span>
        <span class="upgrade-cost">${selected ? "Équipé" : `Rang ${rank}`}</span>
      </span>
      <span class="upgrade-desc">${power.text}</span>
      <span class="spell-actions"></span>
    `;
    const actions = row.querySelector(".spell-actions");
    const equipBtn = document.createElement("button");
    equipBtn.type = "button";
    equipBtn.className = "equip";
    equipBtn.textContent = selected ? "Retirer" : "Équiper";
    equipBtn.addEventListener("click", () => equipPower(power.id));
    actions.appendChild(equipBtn);
    grimoireList.appendChild(row);
  }

  for (const spell of owned) {
    const row = document.createElement("div");
    row.className = "upgrade spell-entry";
    if (equippedSpell && equippedSpell.id === spell.id) {
      row.classList.add("selected");
    }
    const selected = equippedSpell && equippedSpell.id === spell.id;
    row.innerHTML = `
      <span class="upgrade-top">
        <span>${SPELL_ICONS[spell.id] || "✨"} ${spell.name}</span>
        <span class="upgrade-cost">${selected ? "Équipé" : ""}</span>
      </span>
      <span class="upgrade-desc">${spell.text}</span>
      <span class="spell-actions"></span>
    `;
    const actions = row.querySelector(".spell-actions");
    const equipBtn = document.createElement("button");
    equipBtn.type = "button";
    equipBtn.className = "equip";
    equipBtn.textContent = selected ? "Retirer" : "Équiper";
    equipBtn.addEventListener("click", () => equipSpell(spell));
    const castBtn = document.createElement("button");
    castBtn.type = "button";
    castBtn.className = "cast";
    castBtn.textContent = `Payer ${SPELL_COST} G`;
    castBtn.disabled = spinning || gold < SPELL_COST;
    castBtn.addEventListener("click", () => launchSpell(spell));
    actions.appendChild(equipBtn);
    actions.appendChild(castBtn);
    grimoireList.appendChild(row);
  }
}

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "spell-toast";
  toast.textContent = text;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 1400);
}

function equipPower(id) {
  if (!ownedPowers.has(id)) {
    return;
  }
  if (equippedPower === id) {
    equippedPower = null;
    hintEl.textContent = "Pouvoir retiré.";
  } else {
    equippedPower = id;
    hintEl.textContent = `Pouvoir équipé : ${BOSS_POWERS[id].name}. Il part à chaque clic.`;
  }
  render();
  renderGrimoire();
}

function grantBossPower(kind) {
  const power = BOSS_POWERS[kind];
  if (!power) {
    return;
  }
  const first = !ownedPowers.has(kind);
  ownedPowers.add(kind);
  powerRank[kind] = (powerRank[kind] || 0) + 1;
  equippedPower = kind;
  showToast(
    first
      ? `${power.icon} Pouvoir appris : ${power.name}`
      : `${power.icon} ${power.name} rang ${powerRank[kind]}`
  );
}

function equipSpell(spell) {
  if (!knownSpells.has(spell.id)) {
    return;
  }
  if (equippedSpell && equippedSpell.id === spell.id) {
    equippedSpell = null;
    hintEl.textContent = "Impôt retiré. La boutique relancera la roue fiscale.";
  } else {
    equippedSpell = spell;
    hintEl.textContent = `Impôt équipé : ${spell.name}`;
  }
  render();
  renderShop();
  renderGrimoire();
}

function launchSpell(spell) {
  if (isBoss() && bossBusy()) {
    hintEl.textContent = "Attends que l'attaque du boss disparaisse.";
    return;
  }
  if (spinning || gold < SPELL_COST) {
    hintEl.textContent = `Il te faut ${SPELL_COST} G pour payer cet impôt.`;
    return;
  }
  gold -= SPELL_COST;
  equippedSpell = spell;
  closeGrimoire();
  closeShop();
  castSpell(spell);
}

function castSpell(spell) {
  knownSpells.add(spell.id);
  closeGrimoire();
  closeShop();
  playSpellVisual(spell.id);
  spell.apply();
  showToast(`${SPELL_ICONS[spell.id] || "✨"} ${spell.name}`);
  hintEl.textContent = spell.op
    ? "IMPOSSIBLE. Redressement fiscal cosmique."
    : `Impôt payé : ${spell.name}`;
  for (const foe of foes) {
    if (!foe.dead && foe.hp <= 0) {
      killButton(foe);
    }
  }
  if (isBoss() && !dead && !playerKo) {
    scheduleBossRetaliate();
  }
  render();
  renderShop();
  renderGrimoire();
}

function buySpellSpin() {
  if (isBoss() && bossBusy()) {
    hintEl.textContent = "Attends que l'attaque du boss disparaisse.";
    return;
  }
  if (spinning || gold < SPELL_COST) {
    return;
  }
  gold -= SPELL_COST;
  spinning = true;
  render();
  renderShop();
  shop.setAttribute("hidden", "");
  shopBtn.classList.remove("open");

  if (equippedSpell) {
    spinning = false;
    castSpell(equippedSpell);
    return;
  }

  const shown = shuffle(normalSpells).slice(0, 8);
  const winner = pickWinner(shown);
  const slices = winner.op ? [...shown.slice(0, 7), winner] : shown;
  const index = slices.findIndex((slice) => slice.id === winner.id);
  buildWheel(slices);
  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  wheelResult.textContent = "La roue hésite, c’est jamais bon signe.";
  wheelOverlay.removeAttribute("hidden");
  playWheelSound();

  const sliceAngle = 360 / slices.length;
  const target = 360 * 6 + (360 - (index * sliceAngle + sliceAngle / 2));
  requestAnimationFrame(() => {
    wheel.style.transition = "transform 3.6s cubic-bezier(0.12, 0.75, 0.08, 1)";
    wheel.style.transform = `rotate(${target}deg)`;
  });

  window.setTimeout(() => {
    wheelOverlay.setAttribute("hidden", "");
    spinning = false;
    castSpell(winner);
  }, 3700);
}

function buttonPoint(foe = activeFoe()) {
  const el = foe && foe.button;
  if (!el) {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function createFoe(maxHp) {
  const wrap = document.createElement("div");
  wrap.className = "fighter";
  wrap.innerHTML = `
    <div class="hp-bar" aria-hidden="true"><div class="hp-fill"></div></div>
    <button type="button" class="game-btn">Victime</button>
    <p class="hit-label" aria-hidden="true"></p>
  `;
  const foe = {
    wrap,
    button: wrap.querySelector(".game-btn"),
    hpFill: wrap.querySelector(".hp-fill"),
    hitLabel: wrap.querySelector(".hit-label"),
    hp: maxHp,
    dead: false,
  };
  foe.button.addEventListener("click", () => onFoeClick(foe));
  foeRow.appendChild(wrap);
  return foe;
}

function spawnFoes() {
  foeRow.innerHTML = "";
  foes = [];
  const maxHp = victimMaxHp();
  const n = foesPerRound();
  for (let i = 0; i < n; i += 1) {
    foes.push(createFoe(maxHp));
  }
  focusFoe = foes[0] || null;
  dead = false;
}

function spawnActor(text, className, x, y, duration) {
  const el = document.createElement("div");
  el.className = `spell-actor ${className}`;
  el.textContent = text;
  el.style.setProperty("--x", `${x}px`);
  el.style.setProperty("--y", `${y}px`);
  spellStage.appendChild(el);
  window.setTimeout(() => el.remove(), duration);
  return el;
}

function playSpellVisual(id) {
  const { x, y } = buttonPoint();
  const visuals = {
    fromage: () => {
      spawnActor("🧀", "giant", x, y - 40, 1400).style.animation = "slam-down 0.8s ease-out";
    },
    moustache: () => {
      spawnActor("〰️", "", x, y + 18, 1400).style.animation = "slam-down 0.55s ease-out";
    },
    canard: () => {
      const duck = spawnActor("🦆", "giant", x, y, 1600);
      duck.style.animation = "waddle 1.5s linear";
    },
    disco: () => {
      spawnActor("🪩", "giant", x, y - 90, 4000).style.animation = "slam-down 0.6s ease-out";
    },
    baguette: () => {
      for (let i = 0; i < 7; i += 1) {
        const loaf = spawnActor("🥖", "", 80 + Math.random() * (window.innerWidth - 160), -20, 1400);
        loaf.style.setProperty("--rot", `${Math.random() * 80 - 40}deg`);
        loaf.style.animation = `rain-down ${0.9 + Math.random() * 0.5}s linear`;
      }
    },
    mime: () => {
      spawnActor("🧤", "", x - 70, y, 1400).style.animation = "fly-in-left 0.5s ease-out";
      spawnActor("...", "", x, y - 50, 1400);
    },
    yaourt: () => {
      spawnActor("🥛", "giant", x, y, 1200).style.animation = "puff 0.9s ease-out forwards";
    },
    honk: () => {
      const goose = spawnActor("🪿", "giant", x, y, 1600);
      goose.style.animation = "waddle 1.4s linear";
    },
    chaussette: () => {
      spawnActor("🧦", "giant", x, 80, 1300).style.animation = "sock-slap 1.2s ease-in forwards";
    },
    couscous: () => {
      spawnActor("🍲", "giant", x, y - 30, 1400).style.animation = "slam-down 0.7s ease-out";
    },
    nounours: () => {
      spawnActor("🧸", "giant", 90, y, 1400);
      const beam = document.createElement("div");
      beam.className = "laser";
      beam.style.left = "140px";
      beam.style.top = `${y}px`;
      beam.style.width = `${Math.max(40, x - 140)}px`;
      spellStage.appendChild(beam);
      window.setTimeout(() => beam.remove(), 900);
    },
    banane: () => {
      spawnActor("🍌", "", x, y + 50, 1800).style.animation = "slam-down 0.5s ease-out";
    },
    pinata: () => {
      spawnActor("🪅", "giant", x, y - 40, 1400).style.animation = "slam-down 0.5s ease-out";
      ["🍬", "🍭", "✨"].forEach((candy, i) => {
        const bit = spawnActor(candy, "", x, y, 1000);
        bit.style.animation = `puff ${0.7 + i * 0.1}s ease-out forwards`;
      });
    },
    escargot: () => {
      const snail = spawnActor("🐌", "", x - 80, y + 40, 2000);
      snail.style.animation = "waddle 2s linear";
    },
    toux: () => {
      spawnActor("💨", "giant", x + 40, y - 20, 1100).style.animation = "puff 0.9s ease-out forwards";
    },
    politesse: () => {
      spawnActor("🙏", "", x, y - 70, 1400).style.animation = "slam-down 0.5s ease-out";
    },
    pet: () => {
      spawnActor("☁️", "giant", x, y + 10, 1200).style.animation = "puff 1s ease-out forwards";
    },
    yaourt2: () => playSpoonFx(x, y),
    trombone: () => {
      spawnActor("📎", "giant", x, y, 1400).style.animation = "slam-down 0.55s ease-out";
    },
    gaufre: () => {
      spawnActor("🧇", "giant", x, y - 20, 1400).style.animation = "slam-down 0.6s ease-out";
    },
    op: () => {
      const boom = document.createElement("div");
      boom.className = "spell-actor";
      boom.textContent = "💥";
      boom.style.setProperty("--x", `${x}px`);
      boom.style.setProperty("--y", `${y}px`);
      boom.style.fontSize = "6rem";
      boom.style.animation = "cosmic-boom 1s ease-out forwards";
      spellStage.appendChild(boom);
      window.setTimeout(() => boom.remove(), 1000);
    },
  };
  (visuals[id] || (() => {}))();
}

function playSpoonFx(x, y) {
  const wrap = document.createElement("div");
  wrap.className = "spoon-wrap";
  wrap.style.left = `${x}px`;
  wrap.style.top = `${y}px`;
  wrap.textContent = "🥄";
  const chunk = document.createElement("div");
  chunk.className = "button-chunk";
  wrap.appendChild(chunk);
  spellStage.appendChild(wrap);
  const foe = activeFoe();
  if (foe) {
    foe.button.classList.add("bitten");
    window.setTimeout(() => foe.button.classList.remove("bitten"), 1800);
  }
  window.setTimeout(() => wrap.remove(), 1800);
}

function render() {
  const maxHp = victimMaxHp();
  const live = livingFoes();
  const hpSum = live.reduce((sum, foe) => sum + Math.max(0, foe.hp), 0);
  const maxSum = maxHp * Math.max(1, foes.length);
  hpEl.textContent = String(hpSum);
  maxHpEl.textContent = String(maxSum);
  goldEl.textContent = String(gold);
  playerHpEl.textContent = String(Math.max(0, playerHp));
  playerStats.textContent = `Dégâts ${stats.damage} · Coups ${stats.hits}`;
  roundLine.textContent = `${zoneName()} · Round ${round} · ${foeName()}${foesPerRound() > 1 ? " ×2" : ""}`;
  foeLabel.textContent = foesPerRound() > 1 ? `${foeName()} ×2` : foeName();
  const spellBit = equippedSpell ? `Impôt : ${equippedSpell.name}` : "Impôt : aucun";
  const powerBit = equippedPower
    ? `Pouvoir : ${BOSS_POWERS[equippedPower].name}`
    : "Pouvoir : aucun";
  equippedLabel.textContent = `${spellBit} · ${powerBit}`;
  document.body.classList.toggle("zone-2", zone === 2);
  document.body.classList.toggle("zone-3", zone >= 3);
  for (const foe of foes) {
    const ratio = Math.max(0, foe.hp) / maxHp;
    foe.hpFill.style.width = `${ratio * 100}%`;
    foe.hpFill.style.background =
      ratio > 0.5
        ? "linear-gradient(90deg, #39d98a, #7cffb2)"
        : ratio > 0.25
          ? "linear-gradient(90deg, #ffb020, #ffd36a)"
          : "linear-gradient(90deg, #ff4d4d, #ff8a8a)";
    foe.button.classList.toggle("boss", isBoss());
    foe.button.classList.toggle("necro", isBoss() && bossType() === "necro");
    foe.button.classList.toggle("sandwich", isBoss() && bossType() === "sandwich");
    foe.button.classList.toggle("mini", isMini());
    foe.button.classList.toggle("mustache", buffs.mustache);
    foe.button.classList.toggle("duck", buffs.duck);
    foe.button.classList.toggle("mime", buffs.mime);
    foe.button.classList.toggle("disco-btn", buffs.disco);
    foe.button.classList.toggle("op-aura", buffs.opAura);
    foe.wrap.classList.toggle("mini", isMini());
    if (!foe.dead) {
      const label = buffs.duck ? "COIN" : foeName();
      foe.button.textContent = `${label} ${foe.hp}`;
    }
  }
  updateInvestor();
}

function showHit(foe, amount) {
  if (!foe) {
    return;
  }
  foe.hitLabel.textContent = `-${amount}`;
  foe.hitLabel.classList.remove("show");
  void foe.hitLabel.offsetWidth;
  foe.hitLabel.classList.add("show");
  foe.button.classList.remove("hit");
  void foe.button.offsetWidth;
  foe.button.classList.add("hit");
}

function shardShape() {
  const shapes = [
    "polygon(8% 12%, 92% 4%, 78% 88%, 12% 96%)",
    "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    "polygon(0% 20%, 70% 0%, 100% 60%, 40% 100%, 0% 75%)",
    "polygon(20% 0%, 100% 20%, 80% 100%, 0% 70%)",
    "polygon(50% 0%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 15%, 85% 100%, 10% 80%)",
  ];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function spawnTrail(x, y) {
  const trail = document.createElement("div");
    trail.className = buffs.yogurt ? "trail yogurt" : "trail";
  trail.style.left = `${x}px`;
  trail.style.top = `${y}px`;
  fx.appendChild(trail);
  trail.addEventListener("animationend", () => trail.remove());
}

function placeCoin(coin) {
  coin.el.style.left = `${coin.x}px`;
  coin.el.style.top = `${coin.y}px`;
}

function tickCoins(now) {
  const live = [];
  for (const coin of coins) {
    if (coin.collecting || !coin.el.isConnected) {
      continue;
    }

    if (!coin.magnet && now - coin.spawnedAt >= stats.magnet) {
      coin.magnet = true;
      coin.el.classList.add("magnet");
      if (!magnetChimePlayed) {
        magnetChimePlayed = true;
        playMagnetSound();
      }
    }

    const prevX = coin.x;
    const prevY = coin.y;
    const toHero = Math.hypot(pointer.x - coin.x, pointer.y - coin.y);

    if (toHero < 30) {
      collectCoin(coin);
      continue;
    }

    if (coin.magnet) {
      const dx = pointer.x - coin.x;
      const dy = pointer.y - coin.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = 0.18 + Math.min(0.35, 90 / dist);
      coin.vx += (dx / dist) * pull * 18;
      coin.vy += (dy / dist) * pull * 18;
      coin.vx *= 0.86;
      coin.vy *= 0.86;
      if (dist < 26) {
        collectCoin(coin);
        continue;
      }
    } else {
      coin.vy += 0.18;
      coin.vx *= 0.985;
      coin.vy *= 0.985;
    }

    coin.x += coin.vx;
    coin.y += coin.vy;
    coin.x = Math.max(18, Math.min(window.innerWidth - 18, coin.x));
    coin.y = Math.max(18, Math.min(window.innerHeight - 18, coin.y));
    placeCoin(coin);

    if (Math.hypot(coin.x - prevX, coin.y - prevY) > 5) {
      spawnTrail(prevX, prevY);
    }
    live.push(coin);
  }

  coins = live;
  tickHero();
  tickSoul();
  tickShots(now);
  requestAnimationFrame(tickCoins);
}

function startCoinLoop() {
  if (!animating) {
    animating = true;
    requestAnimationFrame(tickCoins);
  }
}

function startCombatLoop() {
  startCoinLoop();
}

function clearRetaliate() {
  if (retaliateTimer) {
    window.clearTimeout(retaliateTimer);
    retaliateTimer = 0;
  }
  lockPlayerAttack(false);
}

function lockPlayerAttack(on) {
  if (!isBoss() || dead || playerKo) {
    on = false;
  }
  const live = livingFoes();
  const wasLocked = live.some((foe) => foe.button.disabled);
  for (const foe of live) {
    foe.button.disabled = on;
    foe.button.classList.toggle("waiting", on);
  }
  for (const btn of [utFight, utAct, utItem, utMercy]) {
    if (btn) {
      btn.disabled = on;
    }
  }
  if (wasLocked && !on && isBoss() && !dead && !playerKo) {
    hintEl.textContent = "À toi. FIGHT, ou clique le boss. Flèches pour bouger.";
    setUtFlavor("* c’est ton tour.");
  }
}

function clearShots() {
  for (const shot of shots) {
    shot.el.remove();
  }
  shots = [];
  if (!retaliateTimer) {
    lockPlayerAttack(false);
  }
}

function hurtFoe(foe, dmg, msg) {
  if (!foe || foe.dead || dead) {
    return;
  }
  foe.hp = Math.max(0, foe.hp - dmg);
  showHit(foe, dmg);
  showToast(`${msg} -${dmg}`);
  render();
  if (foe.hp <= 0) {
    killButton(foe);
  }
}

function hurtPointer(dmg, msg) {
  playerHp = Math.max(0, playerHp - dmg);
  showToast(`${msg} -${dmg} PV`);
  render();
  if (playerHp <= 0) {
    knockOutPlayer();
  }
}

function placeProj(shot) {
  shot.el.style.left = `${shot.x}px`;
  shot.el.style.top = `${shot.y}px`;
  if (shot.rotate) {
    const angle = (Math.atan2(shot.vy, shot.vx) * 180) / Math.PI + (shot.rotOffset || 0);
    shot.el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  } else {
    shot.el.style.transform = "translate(-50%, -50%)";
  }
}

function addShot(shot) {
  shot.team = shot.team || "foe";
  if (shot.team === "player") {
    shot.el.classList.add("ally");
  }
  fx.appendChild(shot.el);
  placeProj(shot);
  shots.push(shot);
  startCombatLoop();
}

function headingToward(fromX, fromY, toX, toY) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.hypot(dx, dy) || 1;
  return { hx: dx / dist, hy: dy / dist, tx: toX, ty: toY };
}

function spawnSword(startX, startY, targetX, targetY, team) {
  const head = headingToward(startX, startY, targetX, targetY);
  const el = document.createElement("div");
  el.className = "boss-sword";
  el.textContent = "🗡️";
  addShot({
    type: "sword",
    team,
    el,
    x: startX,
    y: startY,
    hx: head.hx,
    hy: head.hy,
    vx: head.hx,
    vy: head.hy,
    tx: head.tx,
    ty: head.ty,
    fast: 14,
    slow: 2.4,
    slowZone: 170,
    dmg: teamDmg(8 + Math.floor(round / BOSS_ROUND) * 2, team),
    hitR: 26,
    rotate: true,
    rotOffset: 45,
  });
}

function fireCrossingSwords(aim, team) {
  const targetX = aim.x;
  const targetY = aim.y;
  const angle = Math.random() * Math.PI;
  const reach = Math.max(window.innerWidth, window.innerHeight) * 0.62;
  spawnSword(
    targetX + Math.cos(angle) * reach,
    targetY + Math.sin(angle) * reach,
    targetX,
    targetY,
    team
  );
  spawnSword(
    targetX - Math.cos(angle) * reach,
    targetY - Math.sin(angle) * reach,
    targetX,
    targetY,
    team
  );
}

function spawnDebris(x, y, team) {
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
    const hx = Math.cos(angle);
    const hy = Math.sin(angle);
    const el = document.createElement("div");
    el.className = "necro-shard";
    addShot({
      type: "debris",
      team,
      el,
      x,
      y,
      hx,
      hy,
      vx: hx,
      vy: hy,
      fast: 13,
      slow: 13,
      slowZone: 1,
      dmg: teamDmg(6, team),
      hitR: 16,
      rotate: true,
      rotOffset: 0,
    });
  }
}

function fireNecroZombies(aim, team) {
  const origin = team === "player" ? { x: pointer.x, y: pointer.y } : buttonPoint();
  for (let i = 0; i < 2; i += 1) {
    const el = document.createElement("div");
    el.className = "zombie-btn";
    el.textContent = "Mini";
    const spread = (i === 0 ? -1 : 1) * 40;
    const x = origin.x + spread;
    const y = origin.y + 10;
    const head = headingToward(x, y, aim.x, aim.y);
    addShot({
      type: "zombie",
      team,
      el,
      x,
      y,
      hx: head.hx,
      hy: head.hy,
      vx: head.hx,
      vy: head.hy,
      tx: head.tx,
      ty: head.ty,
      fast: 11,
      slow: 2.2,
      slowZone: 180,
      dmg: teamDmg(7, team),
      hitR: 22,
      rotate: false,
    });
  }
}

function fireComets(aim, team) {
  const side = Math.floor(Math.random() * 4);
  const start =
    side === 0
      ? { x: Math.random() * window.innerWidth, y: -40 }
      : side === 1
        ? { x: window.innerWidth + 40, y: Math.random() * window.innerHeight }
        : side === 2
          ? { x: Math.random() * window.innerWidth, y: window.innerHeight + 40 }
          : { x: -40, y: Math.random() * window.innerHeight };
  const head = headingToward(start.x, start.y, aim.x, aim.y);
  const el = document.createElement("div");
  el.className = "boss-comet";
  el.textContent = "☄️";
  addShot({
    type: "comet",
    team,
    el,
    x: start.x,
    y: start.y,
    hx: head.hx,
    hy: head.hy,
    vx: head.hx,
    vy: head.hy,
    tx: head.tx,
    ty: head.ty,
    fast: 13,
    slow: 2.5,
    slowZone: 180,
    dmg: teamDmg(9, team),
    hitR: 24,
    rotate: true,
    rotOffset: 45,
  });
}

function fireRain(aim, team) {
  const el = document.createElement("div");
  el.className = "boss-sword";
  el.textContent = "🪓";
  const x = aim.x + (Math.random() * 80 - 40);
  const y = -50;
  const head = headingToward(x, y, aim.x, aim.y);
  addShot({
    type: "rain",
    team,
    el,
    x,
    y,
    hx: head.hx,
    hy: head.hy,
    vx: head.hx,
    vy: head.hy,
    tx: head.tx,
    ty: head.ty,
    fast: 14,
    slow: 2.6,
    slowZone: 160,
    dmg: teamDmg(8, team),
    hitR: 24,
    rotate: true,
    rotOffset: 90,
  });
}

function fireSpiral(aim, team) {
  const origin = team === "player" ? { x: pointer.x, y: pointer.y } : buttonPoint();
  for (let i = 0; i < 4; i += 1) {
    const angle = (Math.PI / 2) * i + performance.now() / 400;
    const x = origin.x + Math.cos(angle) * 30;
    const y = origin.y + Math.sin(angle) * 30;
    const head = headingToward(x, y, aim.x, aim.y);
    const el = document.createElement("div");
    el.className = "boss-spiral";
    el.textContent = "✦";
    addShot({
      type: "spiral",
      team,
      el,
      x,
      y,
      hx: head.hx,
      hy: head.hy,
      vx: head.hx,
      vy: head.hy,
      tx: head.tx,
      ty: head.ty,
      fast: 12,
      slow: 2.3,
      slowZone: 170,
      dmg: teamDmg(7, team),
      hitR: 18,
      rotate: false,
    });
  }
}

function firePower(kind, aim, team) {
  if (kind === "necro") {
    fireNecroZombies(aim, team);
  } else if (kind === "comets") {
    fireComets(aim, team);
  } else if (kind === "rain") {
    fireRain(aim, team);
    fireRain(aim, team);
  } else if (kind === "spiral") {
    fireSpiral(aim, team);
  } else if (kind === "sandwich") {
    fireComets(aim, team);
    fireComets(aim, team);
  } else {
    fireCrossingSwords(aim, team);
  }
}

function setUtFlavor(text) {
  if (utFlavor) {
    utFlavor.textContent = text;
  }
}

function placeUt(shot) {
  shot.el.style.left = `${shot.x}px`;
  shot.el.style.top = `${shot.y}px`;
  if (shot.rotate) {
    const angle = (Math.atan2(shot.hy, shot.hx) * 180) / Math.PI + (shot.rotOffset || 0);
    shot.el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  }
}

function addUtShot(shot) {
  shot.ut = true;
  shot.team = "foe";
  utBox.appendChild(shot.el);
  placeUt(shot);
  shots.push(shot);
  startCombatLoop();
}

function utBone(x, y, hx, hy, horiz) {
  const el = document.createElement("div");
  el.className = horiz ? "ut-bone horiz" : "ut-bone";
  addUtShot({
    type: "sword",
    el,
    x,
    y,
    hx,
    hy,
    vx: hx,
    vy: hy,
    tx: soul.x,
    ty: soul.y,
    fast: 5.4,
    slow: 2.1,
    slowZone: 70,
    dmg: 8 + Math.floor(round / BOSS_ROUND) * 2,
    hitR: horiz ? 22 : 18,
    rotate: false,
  });
}

function utPellet(x, y, hx, hy, extraClass, type) {
  const el = document.createElement("div");
  el.className = `ut-pellet ${extraClass || ""}`.trim();
  addUtShot({
    type: type || "comet",
    el,
    x,
    y,
    hx,
    hy,
    vx: hx,
    vy: hy,
    tx: soul.x,
    ty: soul.y,
    fast: 5.8,
    slow: 2.2,
    slowZone: 64,
    dmg: 7 + Math.floor(round / BOSS_ROUND) * 2,
    hitR: 12,
    rotate: false,
  });
}

function fireUtSwords() {
  const w = utBox.clientWidth;
  const h = utBox.clientHeight;
  const y1 = 28 + Math.random() * (h - 56);
  const y2 = 28 + Math.random() * (h - 56);
  utBone(-18, y1, 1, 0, true);
  utBone(w + 18, y2, -1, 0, true);
  utBone(soul.x, -20, 0, 1, false);
}

function fireUtNecro() {
  const w = utBox.clientWidth;
  const h = utBox.clientHeight;
  for (let i = 0; i < 3; i += 1) {
    const side = i % 4;
    const start =
      side === 0
        ? { x: Math.random() * w, y: -16 }
        : side === 1
          ? { x: w + 16, y: Math.random() * h }
          : side === 2
            ? { x: Math.random() * w, y: h + 16 }
            : { x: -16, y: Math.random() * h };
    const head = headingToward(start.x, start.y, soul.x, soul.y);
    const el = document.createElement("div");
    el.className = "ut-mini";
    el.textContent = "Mini";
    addUtShot({
      type: "zombie",
      el,
      x: start.x,
      y: start.y,
      hx: head.hx,
      hy: head.hy,
      vx: head.hx,
      vy: head.hy,
      tx: soul.x,
      ty: soul.y,
      fast: 4.8,
      slow: 1.9,
      slowZone: 72,
      dmg: 7,
      hitR: 16,
      rotate: false,
    });
  }
}

function fireUtComets() {
  const w = utBox.clientWidth;
  const h = utBox.clientHeight;
  const corners = [
    { x: 8, y: 8 },
    { x: w - 8, y: 8 },
    { x: 8, y: h - 8 },
    { x: w - 8, y: h - 8 },
  ];
  for (const start of corners) {
    const head = headingToward(start.x, start.y, soul.x, soul.y);
    utPellet(start.x, start.y, head.hx, head.hy, "fire", "comet");
  }
}

function fireUtRain() {
  const w = utBox.clientWidth;
  for (let i = 0; i < 5; i += 1) {
    utBone(24 + Math.random() * (w - 48), -18, 0, 1, false);
  }
}

function fireUtSpiral() {
  const w = utBox.clientWidth;
  const h = utBox.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8;
    const x = cx + Math.cos(angle) * 18;
    const y = cy + Math.sin(angle) * 18;
    utPellet(x, y, Math.cos(angle), Math.sin(angle), "star", "spiral");
  }
}

function fireUtSandwich() {
  const w = utBox.clientWidth;
  const h = utBox.clientHeight;
  const mid = h / 2;
  for (let i = 0; i < 4; i += 1) {
    const y = 22 + i * ((h - 44) / 3);
    const left = document.createElement("div");
    left.className = "ut-sandwich";
    left.textContent = "🥪";
    addUtShot({
      type: "comet",
      el: left,
      x: -18,
      y,
      hx: 1,
      hy: 0,
      vx: 1,
      vy: 0,
      tx: w / 2,
      ty: mid,
      fast: 6.2,
      slow: 2.4,
      slowZone: 70,
      dmg: 10,
      hitR: 16,
      rotate: false,
    });
    const right = document.createElement("div");
    right.className = "ut-sandwich";
    right.textContent = "🥖";
    addUtShot({
      type: "rain",
      el: right,
      x: w + 18,
      y: h - y,
      hx: -1,
      hy: 0,
      vx: -1,
      vy: 0,
      tx: w / 2,
      ty: mid,
      fast: 6.2,
      slow: 2.4,
      slowZone: 70,
      dmg: 10,
      hitR: 16,
      rotate: false,
    });
  }
  const beam = document.createElement("div");
  beam.className = "ut-sandwich";
  beam.textContent = "🥓";
  const head = headingToward(w / 2, -16, soul.x, soul.y);
  addUtShot({
    type: "spiral",
    el: beam,
    x: w / 2,
    y: -16,
    hx: head.hx,
    hy: head.hy,
    vx: head.hx,
    vy: head.hy,
    tx: soul.x,
    ty: soul.y,
    fast: 5.5,
    slow: 2.1,
    slowZone: 64,
    dmg: 9,
    hitR: 14,
    rotate: false,
  });
}

function fireUtPattern(kind) {
  if (kind === "necro") {
    fireUtNecro();
  } else if (kind === "comets") {
    fireUtComets();
  } else if (kind === "rain") {
    fireUtRain();
  } else if (kind === "spiral") {
    fireUtSpiral();
  } else if (kind === "sandwich") {
    fireUtSandwich();
  } else {
    fireUtSwords();
  }
}

function fireUtDebris(x, y) {
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.3;
    const el = document.createElement("div");
    el.className = "ut-pellet";
    addUtShot({
      type: "debris",
      el,
      x,
      y,
      hx: Math.cos(angle),
      hy: Math.sin(angle),
      vx: Math.cos(angle),
      vy: Math.sin(angle),
      tx: x + Math.cos(angle) * 80,
      ty: y + Math.sin(angle) * 80,
      fast: 4.6,
      slow: 4.6,
      slowZone: 1,
      dmg: 5,
      hitR: 10,
      rotate: false,
    });
  }
}

function resetSoul() {
  soul.x = utBox.clientWidth / 2 || 180;
  soul.y = utBox.clientHeight / 2 || 84;
  soulIframes = 0;
  utSoul.classList.remove("iframes");
  utSoul.style.left = `${soul.x}px`;
  utSoul.style.top = `${soul.y}px`;
}

function placeHero() {
  if (!heroEl) {
    return;
  }
  heroEl.style.left = `${pointer.x}px`;
  heroEl.style.top = `${pointer.y}px`;
}

function tickHero() {
  if (utActive()) {
    if (heroEl) {
      heroEl.classList.add("in-box");
      heroEl.classList.remove("walk");
    }
    return;
  }
  if (heroEl) {
    heroEl.classList.remove("in-box");
  }
  if (playerKo) {
    if (heroEl) {
      heroEl.classList.remove("walk");
    }
    placeHero();
    return;
  }
  const speed = 5.2;
  const moving = keys.left || keys.right || keys.up || keys.down;
  if (keys.left) {
    pointer.x -= speed;
  }
  if (keys.right) {
    pointer.x += speed;
  }
  if (keys.up) {
    pointer.y -= speed;
  }
  if (keys.down) {
    pointer.y += speed;
  }
  pointer.x = Math.max(24, Math.min(window.innerWidth - 24, pointer.x));
  pointer.y = Math.max(90, Math.min(window.innerHeight - 28, pointer.y));
  if (heroEl) {
    heroEl.classList.toggle("walk", moving);
    heroEl.classList.toggle("flip", keys.left && !keys.right);
  }
  placeHero();
}

function tickSoul() {
  if (!utActive()) {
    return;
  }
  const w = utBox.clientWidth;
  const h = utBox.clientHeight;
  const speed = 3.6;
  if (keys.left) {
    soul.x -= speed;
  }
  if (keys.right) {
    soul.x += speed;
  }
  if (keys.up) {
    soul.y -= speed;
  }
  if (keys.down) {
    soul.y += speed;
  }
  soul.x = Math.max(14, Math.min(w - 14, soul.x));
  soul.y = Math.max(14, Math.min(h - 14, soul.y));
  const rect = utBox.getBoundingClientRect();
  pointer.x = rect.left + soul.x;
  pointer.y = rect.top + soul.y;
  utSoul.style.left = `${soul.x}px`;
  utSoul.style.top = `${soul.y}px`;
  if (soulIframes > 0) {
    soulIframes -= 1;
    if (soulIframes <= 0) {
      utSoul.classList.remove("iframes");
    }
  }
}

function fireBossAttack() {
  if (dead || playerKo || !isBoss()) {
    return;
  }
  setUtFlavor(`* ${foeName()} attaque.`);
  fireUtPattern(bossType());
  if (livingFoes().length > 1) {
    window.setTimeout(() => {
      if (!dead && !playerKo && isBoss()) {
        fireUtPattern(bossType());
      }
    }, 260);
  }
}

function firePlayerPower() {
  if (!equippedPower || dead || playerKo) {
    return;
  }
  firePower(equippedPower, buttonPoint(), "player");
}

function hitEdge(x, y) {
  return x <= 16 || y <= 16 || x >= window.innerWidth - 16 || y >= window.innerHeight - 16;
}

function steerShot(shot) {
  if (shot.hx == null) {
    const mag = Math.hypot(shot.vx, shot.vy) || 1;
    shot.hx = shot.vx / mag;
    shot.hy = shot.vy / mag;
  }
  const aimX = shot.tx ?? shot.x + shot.hx * 400;
  const aimY = shot.ty ?? shot.y + shot.hy * 400;
  const along = (aimX - shot.x) * shot.hx + (aimY - shot.y) * shot.hy;
  const zone = shot.slowZone || 170;
  const t = along > 0 ? Math.min(1, along / zone) : 1;
  const fast = shot.fast ?? 12;
  const slow = shot.slow ?? 2.4;
  const speed = slow + (fast - slow) * t * t;
  shot.vx = shot.hx * speed;
  shot.vy = shot.hy * speed;
}

function tickShots() {
  const live = [];
  for (const shot of shots) {
    if (dead || playerKo) {
      return;
    }
    steerShot(shot);
    shot.x += shot.vx;
    shot.y += shot.vy;

    const label =
      shot.type === "zombie"
        ? "Bouton ressuscité !"
        : shot.type === "debris"
          ? "Débris !"
          : shot.type === "comet"
            ? "Comète !"
            : shot.type === "rain"
              ? "Hache !"
              : shot.type === "spiral"
                ? "Spirale !"
                : "Épée !";

    if (shot.ut) {
      placeUt(shot);
      const hitSoul = Math.hypot(shot.x - soul.x, shot.y - soul.y) < shot.hitR + 8;
      if (hitSoul && soulIframes <= 0) {
        if (shot.type === "zombie") {
          fireUtDebris(shot.x, shot.y);
        }
        shot.el.remove();
        hurtPointer(shot.dmg, label);
        soulIframes = 50;
        utSoul.classList.add("iframes");
        continue;
      }
      const w = utBox.clientWidth;
      const h = utBox.clientHeight;
      if (shot.type === "zombie" && (shot.x <= 5 || shot.y <= 5 || shot.x >= w - 5 || shot.y >= h - 5)) {
        fireUtDebris(Math.max(8, Math.min(w - 8, shot.x)), Math.max(8, Math.min(h - 8, shot.y)));
        shot.el.remove();
        continue;
      }
      if (shot.x < -40 || shot.y < -40 || shot.x > w + 40 || shot.y > h + 40) {
        shot.el.remove();
        continue;
      }
      live.push(shot);
      continue;
    }

    placeProj(shot);

    if (shot.team === "player") {
      if (!dead) {
        const hitFoe = livingFoes().find((foe) => {
          const pt = buttonPoint(foe);
          return Math.hypot(shot.x - pt.x, shot.y - pt.y) < shot.hitR + 10;
        });
        if (hitFoe) {
          if (shot.type === "zombie") {
            spawnDebris(shot.x, shot.y, "player");
          }
          shot.el.remove();
          hurtFoe(hitFoe, shot.dmg, label);
          continue;
        }
      }
    } else if (Math.hypot(shot.x - pointer.x, shot.y - pointer.y) < shot.hitR) {
      if (shot.type === "zombie") {
        spawnDebris(shot.x, shot.y, "foe");
      }
      shot.el.remove();
      hurtPointer(shot.dmg, label);
      continue;
    }

    if (shot.type === "zombie" && hitEdge(shot.x, shot.y)) {
      spawnDebris(shot.x, shot.y, shot.team);
      shot.el.remove();
      continue;
    }

    const off =
      shot.x < -140 ||
      shot.y < -140 ||
      shot.x > window.innerWidth + 140 ||
      shot.y > window.innerHeight + 140;
    if (off) {
      shot.el.remove();
      continue;
    }
    live.push(shot);
  }
  shots = live;
  if (!hasHostileShots() && !retaliateTimer) {
    lockPlayerAttack(false);
  }
}

function scheduleBossRetaliate() {
  if (!isBoss() || dead || playerKo || retaliateTimer) {
    return;
  }
  lockPlayerAttack(true);
  hintEl.textContent = "Esquive dans la boîte avec les flèches !";
  setUtFlavor("* 1 seconde…");
  retaliateTimer = window.setTimeout(() => {
    retaliateTimer = 0;
    if (dead || playerKo || !isBoss()) {
      lockPlayerAttack(false);
      return;
    }
    fireBossAttack();
    if (!hasHostileShots()) {
      lockPlayerAttack(false);
    }
  }, 1000);
}

function knockOutPlayer() {
  playerKo = true;
  clearRetaliate();
  clearShots();
  hintEl.textContent = "GAME OVER. Ton âme n’a pas esquivé.";
  setUtFlavor("* tu as perdu.");
  replayBtn.textContent = "Réessayer le boss";
  replayBtn.classList.remove("hidden");
  utBattle.classList.add("hidden");
  document.body.classList.remove("ut-on");
}

function setBossMode(on) {
  for (const foe of foes) {
    foe.button.classList.toggle("boss", on);
  }
  utBattle.classList.toggle("hidden", !on);
  document.body.classList.toggle("ut-on", on);
  if (on) {
    resetSoul();
    lockPlayerAttack(false);
    setUtFlavor(`* ${foeName()} bloque le chemin.`);
    startCombatLoop();
  } else {
    clearRetaliate();
    clearShots();
  }
}

function explode(origin, bossLoot) {
  playShatter();
  const flash = document.createElement("div");
  flash.className = "flash";
  flash.style.left = `${origin.x}px`;
  flash.style.top = `${origin.y}px`;
  fx.appendChild(flash);
  flash.addEventListener("animationend", () => flash.remove());

  for (let i = 0; i < SHARD_COUNT; i += 1) {
    const shard = document.createElement("div");
    const size = 14 + Math.random() * 28;
    const angle = (Math.PI * 2 * i) / SHARD_COUNT + (Math.random() - 0.5) * 0.4;
    const dist = 90 + Math.random() * 170;
    shard.className = "shard";
    shard.style.left = `${origin.x}px`;
    shard.style.top = `${origin.y}px`;
    shard.style.width = `${size}px`;
    shard.style.height = `${size * (0.6 + Math.random() * 1.1)}px`;
    shard.style.clipPath = shardShape();
    shard.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    shard.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    shard.style.setProperty("--rot", `${(Math.random() * 520 - 260).toFixed(0)}deg`);
    shard.style.animationDelay = `${Math.random() * 0.05}s`;
    fx.appendChild(shard);
    shard.addEventListener("animationend", () => shard.remove());
  }

  const wave = Math.floor((round - 1) / BOSS_ROUND);
  const count = bossLoot ? stats.coins * 4 + 40 + wave * 10 : stats.coins;
  coinsLeft = count;
  magnetChimePlayed = false;
  const spawnedAt = performance.now();
  for (let i = 0; i < count; i += 1) {
    const raw = bossLoot
      ? 14 + Math.floor(Math.random() * (stats.luck * 5 + 12)) + wave * 10
      : 1 + Math.floor(Math.random() * stats.luck);
    const value = Math.max(1, Math.round(raw * goldMult));
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 7 + Math.random() * 6;
    const el = document.createElement("button");
    const face = document.createElement("span");
    el.type = "button";
    el.className = "coin";
    face.className = "coin-face";
    face.textContent = buffs.cheese ? `${value}🧀` : `${value}G`;
    el.appendChild(face);
    const coin = {
      el,
      value,
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      spawnedAt,
      magnet: false,
      collecting: false,
    };
    el.addEventListener("click", (event) => {
      event.stopPropagation();
      collectCoin(coin);
    });
    fx.appendChild(el);
    placeCoin(coin);
    coins.push(coin);
    playCoinSound(value);
  }
  startCoinLoop();
}

function collectCoin(coin) {
  if (coin.collecting) {
    return;
  }
  coin.collecting = true;
  coin.el.classList.add("collecting");
  playCoinSound(coin.value);
  gold += coin.value;
  goldEl.textContent = String(gold);
  goldHud.classList.remove("pop");
  void goldHud.offsetWidth;
  goldHud.classList.add("pop");
  coinsLeft = Math.max(0, coinsLeft - 1);
  renderShop();
  updateInvestor();
  hintEl.textContent =
    coinsLeft > 0
      ? `+${coin.value} G · Ramasse les pièces (${coinsLeft} restantes)`
      : `+${coin.value} G · Toutes les pièces sont ramassées`;
  coin.el.addEventListener("animationend", () => coin.el.remove());
}

function killButton(foe) {
  if (!foe || foe.dead) {
    return;
  }
  const droppedBoss = isBoss();
  const droppedType = droppedBoss ? bossType() : null;
  foe.hp = 0;
  foe.dead = true;
  foe.wrap.classList.add("hidden");
  const origin = buttonPoint(foe);
  explode(origin, droppedBoss);

  const remaining = livingFoes();
  if (remaining.length) {
    focusFoe = remaining[0];
    hintEl.textContent = `Encore ${remaining.length} bouton${remaining.length > 1 ? "s" : ""} !`;
    render();
    return;
  }

  dead = true;
  playerKo = false;
  victories += 1;
  clearRetaliate();
  clearShots();
  utBattle.classList.add("hidden");
  document.body.classList.remove("ut-on");
  if (droppedBoss) {
    const wave = Math.floor((round - 1) / BOSS_ROUND);
    const bonus = Math.round((180 + wave * 140 + bossIndex() * 60) * goldMult);
    gold += bonus;
    goldEl.textContent = String(gold);
    goldHud.classList.remove("pop");
    void goldHud.offsetWidth;
    goldHud.classList.add("pop");
    grantBossPower(droppedType);
    const power = BOSS_POWERS[droppedType];
    hintEl.textContent = `Boss vaincu ! +${bonus} G et pouvoir : ${power ? power.name : "inconnu"}.`;
    replayBtn.textContent = "Continuer";
    if (zone === 2 && droppedType === "necro") {
      hintEl.textContent = "Le nécromancien lâche le bouton d’urgence. On ne te demande rien.";
      render();
      renderShop();
      renderGrimoire();
      window.setTimeout(enterWorld3, 900);
      return;
    }
    if (droppedType === "sandwich") {
      render();
      window.setTimeout(playEnding, 500);
      return;
    }
  } else {
    const next = victories + 1;
    if (isBossRound(next)) {
      hintEl.textContent = "Le BOSS arrive. Prépare-toi à esquiver.";
      replayBtn.textContent = "Affronter le boss";
    } else if (next > BOSS_ROUND) {
      hintEl.textContent = "Des mini-boutons reprennent le relais.";
      replayBtn.textContent = "Prochain mini";
    } else {
      hintEl.textContent = "La victime explose ! Elle reviendra plus forte.";
      replayBtn.textContent = "Prochaine victime";
    }
  }
  render();
  renderShop();
  renderGrimoire();
  setTimeout(() => replayBtn.classList.remove("hidden"), 700);
}

function beginRound() {
  spawnFoes();
  playerHp = playerMaxHp;
  replayBtn.classList.add("hidden");
  if (isBoss()) {
    const intros = {
      swords: "BOSS Lames : des os traversent la boîte.",
      necro: "Nécromancien : des mini-boutons explosent en débris dans la boîte.",
      comets: "BOSS Comètes : des boules de feu depuis les coins.",
      rain: "BOSS Déluge : des os tombent du ciel.",
      spiral: "BOSS Spirale : des étoiles partent en ligne droite.",
      sandwich: "Collisionneur 🥪 : des faisceaux de sandwichs se percutent. Tu n’as pas le choix.",
    };
    hintEl.textContent =
      (intros[bossType()] || "BOSS !") + " Esquive avec les flèches.";
    setBossMode(true);
  } else {
    setBossMode(false);
    hintEl.textContent = isMini()
      ? `Mini-bouton niveau ${round}. Plus petit, mais plus costaud.`
      : `Victime niveau ${round}. Elle est plus solide.`;
    if (zone >= 3) {
      hintEl.textContent = `${foeName()} dans l’anneau. ${foesPerRound()} cibles.`;
    } else if (foesPerRound() > 1) {
      hintEl.textContent += " Deux d’un coup.";
    }
  }
  render();
}

function playNukeSound() {
  playTone({ type: "sine", freq: 90, endFreq: 28, duration: 1.8, volume: 0.22 });
  playTone({ type: "sawtooth", freq: 140, endFreq: 40, duration: 1.2, volume: 0.1, delay: 0.05 });
  playTone({ type: "square", freq: 220, endFreq: 60, duration: 0.7, volume: 0.06, delay: 0.12 });
}

function playEnding() {
  const ending = document.getElementById("ending");
  if (!ending) {
    return;
  }
  ensureAudio();
  replayBtn.classList.add("hidden");
  utBattle.classList.add("hidden");
  document.body.classList.remove("ut-on");
  closeShop();
  closeGrimoire();
  closeRebirth();
  if (heroEl) {
    heroEl.classList.add("in-box");
  }
  ending.classList.remove("hidden", "farm", "gone", "msg", "off");
  ending.classList.add("nuke");
  playNukeSound();
  window.setTimeout(() => {
    ending.classList.add("farm");
  }, 2300);
  window.setTimeout(() => {
    ending.classList.add("gone");
    for (const node of document.body.children) {
      if (node.id !== "ending") {
        node.style.display = "none";
      }
    }
  }, 5200);
  window.setTimeout(() => {
    ending.classList.add("msg");
  }, 6600);
  window.setTimeout(() => {
    ending.classList.add("off");
  }, 9200);
  window.setTimeout(closeGameWindow, 10000);
}

function closeGameWindow() {
  document.documentElement.style.background = "#000";
  document.body.replaceChildren();
  document.body.style.background = "#000";
  document.body.style.margin = "0";
  try {
    window.open("", "_self");
    window.close();
  } catch (err) {
    /* ignore */
  }
  window.setTimeout(() => {
    location.replace("about:blank");
  }, 80);
}

function enterWorld3() {
  replayBtn.classList.add("hidden");
  zone = 3;
  goldMult = 3;
  round = 5;
  victories = 4;
  playerKo = false;
  dead = false;
  playerHp = playerMaxHp;
  closeShop();
  closeGrimoire();
  closeRebirth();
  tpFlash.hidden = false;
  tpFlash.textContent = "CONSENTEMENT REFUSÉ. INJECTION DANS L’ACCÉLÉRATEUR.";
  window.setTimeout(() => {
    tpFlash.hidden = true;
  }, 1400);
  beginRound();
  renderShop();
  renderGrimoire();
  setUtFlavor("* tu n’as pas signé. Le sandwich tourne quand même.");
}

function respawn() {
  if (playerKo) {
    playerKo = false;
    playerHp = playerMaxHp;
    dead = false;
    replayBtn.classList.add("hidden");
    hintEl.textContent = "Le boss reprend. Esquive dans la boîte !";
    setBossMode(true);
    render();
    return;
  }

  round = victories + 1;
  beginRound();
}

function onFoeClick(foe) {
  ensureAudio();
  if (dead || foe.dead || foe.button.disabled) {
    return;
  }
  if (isBoss() && bossBusy()) {
    hintEl.textContent = "Attends que l'attaque du boss disparaisse.";
    return;
  }

  if (buffs.missNext) {
    buffs.missNext = false;
    hintEl.textContent = "Glissade de banane ! Le clic rate.";
    return;
  }

  focusFoe = foe;
  const total = stats.damage * stats.hits;
  foe.hp = Math.max(0, foe.hp - total);
  showHit(foe, total);
  render();

  if (foe.hp <= 0) {
    killButton(foe);
  } else {
    hintEl.textContent = `Tu lui as infligé ${total} dégâts (${stats.hits} coup${stats.hits > 1 ? "s" : ""})`;
    setUtFlavor("* tu frappes.");
    firePlayerPower();
    if (isBoss()) {
      scheduleBossRetaliate();
    }
  }
}

replayBtn.addEventListener("click", respawn);

function closeShop() {
  shop.setAttribute("hidden", "");
  shopBtn.classList.remove("open");
  shopBtn.setAttribute("aria-label", "Ouvrir la boutique");
}

function closeRebirth() {
  rebirth.setAttribute("hidden", "");
}

function updateInvestor() {
  if (gold >= INVESTOR_GOLD) {
    investorUnlocked = true;
  }
  investorBtn.classList.toggle("hidden", !investorUnlocked);
  const already = zone >= 2;
  const can = !already && gold >= INVESTOR_GOLD;
  rebirthGo.disabled = !can;
  rebirthGo.textContent = already ? "Déjà au Boardwalk" : `Signer (${INVESTOR_GOLD.toLocaleString("fr-FR")} G)`;
  rebirthCopy.textContent = already
    ? "Tu vis déjà au Boardwalk : 2 boutons, or ×2, et la DÉTERMINATION."
    : "Boardwalk : 2 boutons par round, pièces ×2, carte Chance, +PV. Tes pouvoirs restent.";
}

function doRebirth() {
  if (zone >= 2 || gold < INVESTOR_GOLD) {
    hintEl.textContent = zone >= 2 ? "Tu es déjà au Boardwalk." : "Il te faut 100 000 G.";
    return;
  }
  gold -= INVESTOR_GOLD;
  zone = 2;
  goldMult = 2;
  stats.damage += 8;
  stats.luck += 4;
  stats.coins += 6;
  playerMaxHp += 25;
  playerHp = playerMaxHp;
  const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
  card.apply();
  round = 1;
  victories = 0;
  playerKo = false;
  clearRetaliate();
  clearShots();
  closeRebirth();
  closeShop();
  closeGrimoire();
  tpFlash.hidden = false;
  tpFlash.textContent = "TU ES REMPLI DE DÉTERMINATION";
  window.setTimeout(() => {
    tpFlash.hidden = true;
  }, 1100);
  beginRound();
  renderShop();
  renderGrimoire();
  showToast(card.text);
  hintEl.textContent = `Boardwalk ! ${card.text} Deux boutons, or ×2.`;
}

function closeGrimoire() {
  grimoire.classList.remove("open");
  grimoireBtn.classList.remove("open");
  grimoireBtn.setAttribute("aria-label", "Ouvrir le centre des impôts");
}

shopBtn.addEventListener("click", () => {
  ensureAudio();
  const open = shop.hasAttribute("hidden");
  closeGrimoire();
  closeRebirth();
  if (open) {
    shop.removeAttribute("hidden");
    shopBtn.classList.add("open");
    shopBtn.setAttribute("aria-label", "Fermer la boutique");
  } else {
    closeShop();
  }
});

grimoireClose.addEventListener("click", () => {
  closeGrimoire();
});

grimoireBtn.addEventListener("click", () => {
  ensureAudio();
  const open = !grimoire.classList.contains("open");
  closeShop();
  closeRebirth();
  if (open) {
    renderGrimoire();
    grimoire.classList.add("open");
    grimoireBtn.classList.add("open");
    grimoireBtn.setAttribute("aria-label", "Fermer les impôts");
  } else {
    closeGrimoire();
  }
});

investorBtn.addEventListener("click", () => {
  ensureAudio();
  closeShop();
  closeGrimoire();
  const open = rebirth.hasAttribute("hidden");
  if (open) {
    updateInvestor();
    if (rebirthSpeech) {
      rebirthSpeech.textContent = INVESTOR_LINES[Math.floor(Math.random() * INVESTOR_LINES.length)];
    }
    rebirth.removeAttribute("hidden");
  } else {
    closeRebirth();
  }
});

rebirthClose.addEventListener("click", closeRebirth);
rebirthGo.addEventListener("click", doRebirth);

function utBusyBlock() {
  if (!isBoss() || dead || playerKo) {
    return true;
  }
  if (bossBusy()) {
    hintEl.textContent = "Esquive d’abord !";
    return true;
  }
  return false;
}

utFight.addEventListener("click", () => {
  const foe = activeFoe();
  if (!foe || utBusyBlock()) {
    return;
  }
  onFoeClick(foe);
});

utAct.addEventListener("click", () => {
  if (utBusyBlock()) {
    return;
  }
  setUtFlavor(ACT_LINES[Math.floor(Math.random() * ACT_LINES.length)]);
  scheduleBossRetaliate();
});

utItem.addEventListener("click", () => {
  if (utBusyBlock()) {
    return;
  }
  playerHp = Math.min(playerMaxHp, playerHp + 12);
  render();
  setUtFlavor("* tu manges des nouilles instantanées. +12 PV.");
  scheduleBossRetaliate();
});

utMercy.addEventListener("click", () => {
  if (utBusyBlock()) {
    return;
  }
  setUtFlavor("* tu ne peux pas spare un bouton.");
  scheduleBossRetaliate();
});

round = 1;
victories = 0;
zone = 1;
goldMult = 1;
playerMaxHp = PLAYER_MAX_HP;
playerKo = false;
dead = false;
beginRound();
placeHero();
startCoinLoop();
renderShop();
renderGrimoire();
initAdminPanel();

function isTestMode() {
  const host = location.hostname;
  return (
    location.protocol === "file:" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]"
  );
}

function adminJump(nextZone, nextRound) {
  clearRetaliate();
  clearShots();
  zone = nextZone;
  goldMult = nextZone >= 3 ? 3 : nextZone >= 2 ? 2 : 1;
  if (nextZone >= 2) {
    investorUnlocked = true;
  }
  round = nextRound;
  victories = Math.max(0, nextRound - 1);
  playerKo = false;
  dead = false;
  playerHp = playerMaxHp;
  replayBtn.classList.add("hidden");
  beginRound();
  renderShop();
  renderGrimoire();
  hintEl.textContent = `TEST : ${zoneName()} · round ${round}`;
}

function initAdminPanel() {
  if (!isTestMode()) {
    return;
  }
  document.body.classList.add("test-mode");
  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "admin-tab";
  tab.textContent = "TEST";
  const panel = document.createElement("aside");
  panel.className = "admin-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <h2>Admin test</h2>
    <p>Invisible sur le site publié. Local / file only.</p>
    <div class="admin-grid"></div>
  `;
  const grid = panel.querySelector(".admin-grid");
  const actions = [
    ["+100 000 G", () => { gold += 100000; investorUnlocked = true; render(); renderShop(); }],
    ["G = 0", () => { gold = 0; render(); renderShop(); }],
    ["Stats max", () => {
      stats.damage = 80;
      stats.hits = 8;
      stats.coins = 40;
      stats.luck = 20;
      stats.magnet = 200;
      render();
      renderShop();
    }],
    ["PV full", () => { playerHp = playerMaxHp; playerKo = false; render(); }],
    ["Tous les impôts", () => {
      for (const spell of spells) {
        knownSpells.add(spell.id);
      }
      renderGrimoire();
      showToast("Impôts débloqués");
    }],
    ["Tous les pouvoirs", () => {
      for (const id of Object.keys(BOSS_POWERS)) {
        ownedPowers.add(id);
        powerRank[id] = Math.max(powerRank[id] || 1, 3);
      }
      equippedPower = equippedPower || "swords";
      render();
      renderGrimoire();
    }],
    ["Zone 1 · round 1", () => adminJump(1, 1)],
    ["Boss lames (Z1 R5)", () => adminJump(1, 5)],
    ["Boardwalk (Z2)", () => adminJump(2, 1)],
    ["Nécro Boardwalk (Z2 R10)", () => adminJump(2, 10)],
    ["Accélérateur sandwich", () => enterWorld3()],
    ["Tuer les cibles", () => {
      for (const foe of [...livingFoes()]) {
        killButton(foe);
      }
    }],
  ];
  for (const [label, fn] of actions) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      ensureAudio();
      fn();
    });
    grid.appendChild(btn);
  }
  tab.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
  });
  document.body.appendChild(tab);
  document.body.appendChild(panel);
}
