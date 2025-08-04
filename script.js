
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let speedUnit = "kmh";
let speed = 0;
let maxSpeed = 249.45; // km/h
let carColor = "#ff0000";
let gameRunning = false;
let obstacles = [];
let coins = [];
let score = 0;
let car = {
  x: 220,
  y: 500,
  width: 60,
  height: 100,
  vx: 0,
  vy: 2,
  angle: 0
};

document.getElementById("speedUnit").addEventListener("change", e => {
  speedUnit = e.target.value;
  updateSpeedometer();
});

document.getElementById("carColor").addEventListener("input", e => {
  carColor = e.target.value;
});

function updateSpeedometer() {
  const displaySpeed = speedUnit === "mph" ? (speed * 0.621371).toFixed(0) : speed.toFixed(0);
  const unit = speedUnit === "mph" ? "MPH" : "Km/h";
  document.getElementById("speedometer").innerText = "Speed: " + displaySpeed + " " + unit + " | Score: " + score;
}

function drawCar() {
  ctx.fillStyle = carColor;
  ctx.fillRect(car.x, car.y, car.width, car.height);
  // Wheels
  ctx.fillStyle = "black";
  ctx.fillRect(car.x + 5, car.y + 10, 10, 10);
  ctx.fillRect(car.x + car.width - 15, car.y + 10, 10, 10);
  ctx.fillRect(car.x + 5, car.y + car.height - 20, 10, 10);
  ctx.fillRect(car.x + car.width - 15, car.y + car.height - 20, 10, 10);
}

function drawObstacle(ob) {
  ctx.fillStyle = ob.color;
  ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
}

function drawCoin(c) {
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
  ctx.fill();
}

function spawnObstacle() {
  const width = 60;
  const height = 100;
  const x = Math.random() * (canvas.width - width);
  const y = -height;
  const color = "#" + Math.floor(Math.random()*16777215).toString(16);
  obstacles.push({ x, y, width, height, color });
}

function spawnCoin() {
  const x = Math.random() * (canvas.width - 10) + 5;
  const y = -10;
  coins.push({ x, y });
}

function startGame() {
  document.getElementById("titleScreen").classList.add("hidden");
  document.getElementById("gameOverScreen").classList.add("hidden");
  gameRunning = true;
  speed = 50;
  score = 0;
  obstacles = [];
  coins = [];
  car.x = 220;
  car.y = 500;
  loop();
}

function retryGame() {
  startGame();
}

function gameOver() {
  gameRunning = false;
  document.getElementById("gameOverScreen").classList.remove("hidden");
}

function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Car controls
  if (keys["a"]) car.x -= 3;
  if (keys["d"]) car.x += 3;
  if (keys["w"] && speed < maxSpeed) speed += 0.2;
  if (keys["s"] && speed > 0) speed -= 0.4;

  car.x = Math.max(0, Math.min(canvas.width - car.width, car.x));

  // Move and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let ob = obstacles[i];
    ob.y += 3;
    drawObstacle(ob);

    // Collision check
    if (car.x < ob.x + ob.width && car.x + car.width > ob.x && car.y < ob.y + ob.height && car.y + car.height > ob.y) {
      speed = 0;
      gameOver();
    }
  }

  // Move and draw coins
  for (let i = 0; i < coins.length; i++) {
    let c = coins[i];
    c.y += 3;
    drawCoin(c);

    if (car.x < c.x + 7 && car.x + car.width > c.x - 7 && car.y < c.y + 7 && car.y + car.height > c.y - 7) {
      coins.splice(i, 1);
      score += 1;
      i--;
    }
  }

  drawCar();
  updateSpeedometer();

  // Spawn
  if (Math.random() < 0.02) spawnObstacle();
  if (Math.random() < 0.01) spawnCoin();

  requestAnimationFrame(loop);
}

let keys = {};
window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);
