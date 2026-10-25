const MAX_HP = 100;
const DAMAGE = 10;

const button = document.getElementById("gameBtn");
const hpEl = document.getElementById("hp");
const hintEl = document.getElementById("hint");
const hpFill = document.getElementById("hpFill");
const hitLabel = document.getElementById("hitLabel");

let hp = MAX_HP;

function render() {
  const ratio = Math.max(0, hp) / MAX_HP;
  hpEl.textContent = String(Math.max(0, hp));
  hpFill.style.width = `${ratio * 100}%`;
  hpFill.style.background =
    ratio > 0.5
      ? "linear-gradient(90deg, #39d98a, #7cffb2)"
      : ratio > 0.25
        ? "linear-gradient(90deg, #ffb020, #ffd36a)"
        : "linear-gradient(90deg, #ff4d4d, #ff8a8a)";
  button.textContent = hp > 0 ? `${hp} PV` : "KO";
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

button.addEventListener("click", () => {
  if (hp <= 0) {
    hp = MAX_HP;
    button.disabled = false;
    hintEl.textContent = "Clique le bouton pour lui faire des dégâts";
    render();
    return;
  }

  hp = Math.max(0, hp - DAMAGE);
  showHit(DAMAGE);
  render();

  if (hp <= 0) {
    hintEl.textContent = "Le bouton est KO. Clique pour le soigner.";
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
      button.textContent = "Rejouer";
    }, 400);
  } else {
    hintEl.textContent = `Tu lui as infligé ${DAMAGE} dégâts`;
  }
});

render();
