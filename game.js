const MAX_HP = 100;
const SHARD_COUNT = 22;

const button = document.getElementById("gameBtn");
const fighter = document.getElementById("fighter");
const replayBtn = document.getElementById("replayBtn");
const hpEl = document.getElementById("hp");
const goldEl = document.getElementById("gold");
const goldHud = document.querySelector(".gold");
const hintEl = document.getElementById("hint");
const hpFill = document.getElementById("hpFill");
const hitLabel = document.getElementById("hitLabel");
const fx = document.getElementById("fx");
const shopBtn = document.getElementById("shopBtn");
const shop = document.getElementById("shop");
const shopList = document.getElementById("shopList");
const playerStats = document.getElementById("playerStats");
const maxHpEl = document.getElementById("maxHp");
const wheelOverlay = document.getElementById("wheelOverlay");
const wheel = document.getElementById("wheel");
const wheelResult = document.getElementById("wheelResult");
const spellStage = document.getElementById("spellStage");

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

const spells = [
  { id: "fromage", name: "Fromage lunaire", text: "Les pièces sentent le camembert spatial.", apply: () => { buffs.cheese = true; } },
  { id: "moustache", name: "Moustache du destin", text: "Le bouton se prend pour un magician.", apply: () => { buffs.mustache = true; stats.damage += 2; button.classList.add("mustache"); } },
  { id: "canard", name: "Malédiction canard", text: "COIN COIN. C’est tout le sort.", apply: () => { buffs.duck = true; button.classList.add("duck"); } },
  { id: "disco", name: "Boule disco interdite", text: "Le bouton fait la java. 4 secondes, pas plus.", apply: () => {
      button.classList.add("disco-btn");
      window.setTimeout(() => button.classList.remove("disco-btn"), 4000);
    } },
  { id: "baguette", name: "Gravité baguette", text: "Tout tombe, comme après un repas.", apply: () => { document.body.classList.add("baguette"); stats.magnet = Math.max(400, stats.magnet - 200); } },
  { id: "mime", name: "Mime invisible", text: "Le bouton existe… à peine.", apply: () => { button.classList.add("mime"); } },
  { id: "yaourt", name: "Ficelle de yaourt", text: "Traînée rose, dignité nulle.", apply: () => { buffs.yogurt = true; } },
  { id: "honk", name: "Honk de l’oie fiscale", text: "L’oie te reverse 7 G puis s’en va.", apply: () => { gold += 7; } },
  { id: "chaussette", name: "Chaussette mouillée", text: "Tu perds 5 G. C’était prévisible.", apply: () => { gold = Math.max(0, gold - 5); } },
  { id: "couscous", name: "Couscous de soin", text: "Le bouton se ressert une assiette. Full PV.", apply: () => { if (!dead) hp = MAX_HP; } },
  { id: "nounours", name: "Laser de nounours", text: "Un ours en peluche tire un laser. -30 PV.", apply: () => { if (!dead) hp = Math.max(0, hp - 30); } },
  { id: "banane", name: "Peau de banane", text: "Le prochain clic glisse à côté.", apply: () => { buffs.missNext = true; } },
  { id: "pinata", name: "Piñata émotionnelle", text: "+6 pièces à la prochaine explosion.", apply: () => { stats.coins += 6; } },
  { id: "escargot", name: "Escargot express", text: "Les pièces méditent avant de revenir.", apply: () => { stats.magnet += 900; } },
  { id: "toux", name: "Toux critique", text: "Un coup bonus. Atchoum.", apply: () => { stats.hits += 1; } },
  { id: "politesse", name: "S’il-te-plaît mortel", text: "Le bouton dit merci et se soigne de 15.", apply: () => { if (!dead) hp = Math.min(MAX_HP, hp + 15); } },
  { id: "pet", name: "Pet du chaos", text: "Dégâts +1. L’odeur est permanente.", apply: () => { stats.damage += 1; } },
  { id: "yaourt2", name: "Cuillère qui juge", text: "La cuillère te donne 3 dégâts par déception.", apply: () => { stats.damage += 3; } },
  { id: "trombone", name: "Trombone spirituel", text: "Ça attache tes coups ensemble : +1 coup.", apply: () => { stats.hits += 1; } },
  { id: "gaufre", name: "Gaufre temporelle", text: "Les pièces reviennent plus vite, sirop compris.", apply: () => { stats.magnet = Math.max(350, stats.magnet - 600); } },
  {
    id: "op",
    name: "SUPER MEGA GIGA ANNIHILATION™",
    text: "0,1% : le bouton est juridiquement supprimé. +777 G, stats absurdes.",
    op: true,
    apply: () => {
      gold += 777;
      stats.damage += 50;
      stats.hits += 5;
      stats.coins += 20;
      stats.luck += 12;
      stats.magnet = 200;
      button.classList.add("op-aura");
      if (!dead) {
        hp = 0;
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
};

let spinning = false;
let hp = MAX_HP;
let gold = 0;
let dead = false;
let coinsLeft = 0;
let coins = [];
let animating = false;
let audioCtx = null;
let magnetChimePlayed = false;
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

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
  spellRow.innerHTML = `
    <span class="upgrade-top">
      <span>Sort</span>
      <span class="upgrade-cost">${SPELL_COST} G</span>
    </span>
    <span class="upgrade-desc">Lance la roue. Un sort super mega giga OP est caché à 0,1%.</span>
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

function buySpellSpin() {
  if (spinning || gold < SPELL_COST) {
    return;
  }
  gold -= SPELL_COST;
  spinning = true;
  render();
  renderShop();
  shop.setAttribute("hidden", "");
  shopBtn.classList.remove("open");

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
    playSpellVisual(winner.id);
    winner.apply();
    spinning = false;
    hintEl.textContent = winner.op
      ? "IMPOSSIBLE. Le sort super mega giga OP est tombé."
      : `Sort : ${winner.name}`;
    if (!dead && hp <= 0) {
      killButton();
    }
    render();
    renderShop();
  }, 3700);
}

function buttonPoint() {
  const rect = button.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
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
  button.classList.add("bitten");
  window.setTimeout(() => button.classList.remove("bitten"), 1800);
  window.setTimeout(() => wrap.remove(), 1800);
}

function render() {
  const ratio = Math.max(0, hp) / MAX_HP;
  hpEl.textContent = String(Math.max(0, hp));
  maxHpEl.textContent = String(MAX_HP);
  goldEl.textContent = String(gold);
  playerStats.textContent = `Dégâts ${stats.damage} · Coups ${stats.hits}`;
  hpFill.style.width = `${ratio * 100}%`;
  hpFill.style.background =
    ratio > 0.5
      ? "linear-gradient(90deg, #39d98a, #7cffb2)"
      : ratio > 0.25
        ? "linear-gradient(90deg, #ffb020, #ffd36a)"
        : "linear-gradient(90deg, #ff4d4d, #ff8a8a)";
  if (!dead) {
    button.textContent = buffs.duck ? `COIN ${hp}` : `${hp} PV`;
  }
}

function showHit(amount) {
  hitLabel.textContent = `-${amount}`;
  hitLabel.classList.remove("show");
  void hitLabel.offsetWidth;
  hitLabel.classList.add("show");
  button.classList.remove("hit");
  void button.offsetWidth;
  button.classList.add("hit");
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
  if (coins.length) {
    requestAnimationFrame(tickCoins);
  } else {
    animating = false;
  }
}

function startCoinLoop() {
  if (!animating) {
    animating = true;
    requestAnimationFrame(tickCoins);
  }
}

function explode(origin) {
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

  coinsLeft = stats.coins;
  magnetChimePlayed = false;
  const spawnedAt = performance.now();
  for (let i = 0; i < stats.coins; i += 1) {
    const value = 1 + Math.floor(Math.random() * stats.luck);
    const angle = (Math.PI * 2 * i) / stats.coins + (Math.random() - 0.5) * 0.5;
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
  hintEl.textContent =
    coinsLeft > 0
      ? `+${coin.value} G · Ramasse les pièces (${coinsLeft} restantes)`
      : `+${coin.value} G · Toutes les pièces sont ramassées`;
  coin.el.addEventListener("animationend", () => coin.el.remove());
}

function killButton() {
  hp = 0;
  dead = true;
  const rect = button.getBoundingClientRect();
  const origin = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
  fighter.classList.add("hidden");
  hintEl.textContent = "Le bouton explose ! Les pièces reviendront vers toi";
  render();
  explode(origin);
  setTimeout(() => replayBtn.classList.remove("hidden"), 700);
}

function respawn() {
  hp = MAX_HP;
  dead = false;
  fighter.classList.remove("hidden");
  replayBtn.classList.add("hidden");
  hintEl.textContent = "Clique le bouton pour lui faire des dégâts";
  render();
}

button.addEventListener("click", () => {
  ensureAudio();
  if (dead) {
    return;
  }

  if (buffs.missNext) {
    buffs.missNext = false;
    hintEl.textContent = "Glissade de banane ! Le clic rate.";
    return;
  }

  const total = stats.damage * stats.hits;
  hp = Math.max(0, hp - total);
  showHit(total);
  render();

  if (hp <= 0) {
    killButton();
  } else {
    hintEl.textContent = `Tu lui as infligé ${total} dégâts (${stats.hits} coup${stats.hits > 1 ? "s" : ""})`;
  }
});

replayBtn.addEventListener("click", respawn);

shopBtn.addEventListener("click", () => {
  ensureAudio();
  const open = shop.hasAttribute("hidden");
  if (open) {
    shop.removeAttribute("hidden");
    shopBtn.classList.add("open");
    shopBtn.setAttribute("aria-label", "Fermer la boutique");
  } else {
    shop.setAttribute("hidden", "");
    shopBtn.classList.remove("open");
    shopBtn.setAttribute("aria-label", "Ouvrir la boutique");
  }
});

render();
renderShop();
