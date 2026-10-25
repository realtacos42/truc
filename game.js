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
    button.textContent = `${hp} PV`;
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
  trail.className = "trail";
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
    face.textContent = `${value}G`;
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
