const threats = [
  { name: "Pollution", icon: "🏭" },
  { name: "Global Warming", icon: "🔥" },
  { name: "Deforestation", icon: "🪓" },
  { name: "Plastic Waste", icon: "🛍️" }
];

let health = 100;
let score = 0;
let spawnInterval = null;
let gameRunning = false;

function createStars() {
  const starCount = 150;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.opacity = Math.random() * 0.7 + 0.3;
    document.body.appendChild(star);
  }
}

function spawnThreat() {
  if (!gameRunning) return;

  const threat = threats[Math.floor(Math.random() * threats.length)];

  const el = document.createElement('div');
  el.className = 'threat';

  const badge = document.createElement('div');
  badge.className = 'threat-badge';
  badge.textContent = threat.icon;

  const label = document.createElement('div');
  label.className = 'threat-label';
  label.textContent = threat.name;

  el.appendChild(badge);
  el.appendChild(label);

  const edge = Math.floor(Math.random() * 4);
  let startX, startY;
  const w = window.innerWidth, h = window.innerHeight;

  if (edge === 0) { startX = Math.random() * w; startY = -40; }
  else if (edge === 1) { startX = w + 40; startY = Math.random() * h; }
  else if (edge === 2) { startX = Math.random() * w; startY = h + 40; }
  else { startX = -40; startY = Math.random() * h; }

  el.style.left = startX + 'px';
  el.style.top = startY + 'px';

  document.body.appendChild(el);

  moveThreatToEarth(el);

  el.addEventListener('click', () => {
    if (el.dataset.dead || !gameRunning) return;
    el.dataset.dead = "true";
    score += 10;
    updateScore();
    popEffect(el, '#4fd48a');
  });
}

function moveThreatToEarth(el) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  let x = parseFloat(el.style.left);
  let y = parseFloat(el.style.top);

  const speed = 0.5;

  function step() {
    if (el.dataset.dead || !gameRunning) return;
    if (!document.body.contains(el)) return;

    const dx = centerX - x;
    const dy = centerY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) {
      el.dataset.dead = "true";
      health = Math.max(0, health - 10);
      updateHealthBar();
      popEffect(el, '#ff5c5c');
      if (health <= 0) {
        endGame();
      }
      return;
    }

    x += (dx / dist) * speed;
    y += (dy / dist) * speed;
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function popEffect(el, color) {
  const badge = el.querySelector('.threat-badge');
  badge.style.boxShadow = `0 0 0 0 ${color}`;
  el.classList.add('pop');

  const burst = document.createElement('div');
  burst.className = 'burst';
  burst.style.left = el.style.left;
  burst.style.top = el.style.top;
  burst.style.borderColor = color;
  document.body.appendChild(burst);

  setTimeout(() => {
    el.remove();
    burst.remove();
  }, 300);
}

function updateHealthBar() {
  const fill = document.getElementById('health-fill');
  fill.style.width = health + '%';
}

function updateScore() {
  document.getElementById('score-value').textContent = score;
}

function endGame() {
  gameRunning = false;
  clearInterval(spawnInterval);

  document.querySelectorAll('.threat').forEach(el => el.remove());

  document.getElementById('title').style.display = 'none';
  document.getElementById('health-container').style.display = 'none';
  document.getElementById('score-display').style.display = 'none';

  document.getElementById('final-score').textContent = 'Score: ' + score;
  document.getElementById('game-over-screen').style.display = 'flex';
}

function resetGame() {
  health = 100;
  score = 0;
  gameRunning = true;

  updateHealthBar();
  updateScore();

  document.getElementById('game-over-screen').style.display = 'none';
  document.getElementById('title').style.display = 'block';
  document.getElementById('health-container').style.display = 'block';
  document.getElementById('score-display').style.display = 'block';

  spawnInterval = setInterval(spawnThreat, 2000);
}

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  resetGame();
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', resetGame);

createStars();
