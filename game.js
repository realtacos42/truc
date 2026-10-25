const arena = document.getElementById("arena");
const button = document.getElementById("gameBtn");
const scoreEl = document.getElementById("score");
const hintEl = document.getElementById("hint");

let score = 0;

function moveButton() {
  const padding = 24;
  const maxX = arena.clientWidth - button.offsetWidth - padding;
  const maxY = arena.clientHeight - button.offsetHeight - padding;
  const x = padding + Math.random() * Math.max(0, maxX - padding);
  const y = padding + Math.random() * Math.max(0, maxY - padding);

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

button.addEventListener("click", () => {
  score += 1;
  scoreEl.textContent = String(score);
  hintEl.textContent =
    score === 1 ? "Encore !" : score < 10 ? "Continue !" : "Tu es un pro du bouton";
  moveButton();
});

window.addEventListener("resize", moveButton);
moveButton();
