// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddleHeight = 100;
let paddleWidth = 10;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, "white");
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  // Движение мяча
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Отскок от верхней и нижней стенки
  if (ballY + 5 >= canvas.height || ballY - 5 <= 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Проверка столкновения с ракеткой игрока
  if (
    ballX < 20 &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Проверка столкновения с ракеткой ИИ
  if (
    ballX > canvas.width - 20 &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Выход за границы — перезапуск
  if (ballX < 0 || ballX > canvas.width) {
    resetBall();
  }

  // Управление ИИ
  aiY += (ballY - (aiY + paddleHeight / 2)) * 0.09;
}

function render() {
  // Очистка экрана
  drawRect(0, 0, canvas.width, canvas.height, "black");

  // Сетка
  drawNet();

  // Игрок и ИИ
  drawRect(10, playerY, paddleWidth, paddleHeight, "white");
  drawRect(canvas.width - 20, aiY, paddleWidth, paddleHeight, "white");

  // Мяч
  drawCircle(ballX, ballY, 7, "white");
}

document.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  playerY = e.clientY - rect.top - paddleHeight / 2;
});

document.getElementById("startBtn").addEventListener("click", () => {
  setInterval(() => {
    update();
    render();
  }, 1000 / 60); // 60 FPS
});