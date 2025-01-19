const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Variables initation

let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

//------------------------------

// 1 - Drawing ball on canvas
// create ball properties

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

//  draw ball on canvas

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//  2 - draw paddle on canvas
// paddle properties

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// draw paddle

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// 3- Draw bricks on Canvas
// bricks properties

const brickProp = {
  w: 70,
  h: 20,
  padding: 13,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// create bricks

let bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];

  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickProp.w + brickProp.padding) + brickProp.offsetX;
    const y = j * (brickProp.h + brickProp.padding) + brickProp.offsetY;
    bricks[i][j] = { x, y, ...brickProp };
  }
}

//  creat bricks on canvas

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// 4- Draw Score on Canvas
//

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// ------------------------------
// darw everything to the canvas

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Move Paddle Function
function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move Ball Function

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //   ball collision (x)

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  //    ball collision (y )

  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //ball collision with paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //bricks collision;
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  //   ball hit bottom wall

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// increase Score function
// -----------------------------

// Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// ---------------------
// updat : draw everthing and handling animation
function update() {
  //
  movePaddle();
  moveBall();
  //
  draw();

  //

  requestAnimationFrame(update);
}

update();
// ---------------------------

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Key events

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
// Event Listeners

rulesBtn.addEventListener("click", () => {
  rules.classList.toggle("show");
});
closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});
