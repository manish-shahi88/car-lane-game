
import "./style.css";
import cars from "./assets/cars.jpg";

// Create an image element for the car image
const carImage = new Image();
carImage.src = cars;

// Import constants and shapes
import { DIMENSIONS, SPEED } from "./constants";
import Point from "./shapes/Point";
import Circle from "./shapes/Circle";
import { clamp, getRandomInt } from "./utils/common";

// Get the canvas element and its 2D rendering context
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

// Set canvas dimensions
canvas.width = DIMENSIONS.CANVAS_WIDTH;
canvas.height = DIMENSIONS.CANVAS_HEIGHT;

// Circles are opponent cars obstacles for the player
const circle1 = new Circle(new Point(100, getRandomInt(-200, 0)), 20);
const circle2 = new Circle(new Point(300, getRandomInt(-400, -100)), 20);
const circle3 = new Circle(new Point(500, getRandomInt(-600, -300)), 20);

// Store circles in an array
const circles = [circle1, circle2, circle3];

// Define the player circle
const player = new Circle(new Point(300, DIMENSIONS.CANVAS_HEIGHT - 40), 20);

// Initialize game variables
let gameSpeed = 1;
let laneLine = 0;
let score = 0;
let isGameOver = false;
let gameStarted = false;
let targetX = player.center.x;

// Function to draw the start screen
function drawStartScreen() {
  // Fill background with black
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, DIMENSIONS.CANVAS_WIDTH, DIMENSIONS.CANVAS_HEIGHT);

  // Draw text in white indicating to press 'Enter' to start
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Press 'Enter' to start", 200, 200);
}

// Main drawing function
function draw() {
  // Check if the game has started
  if (!gameStarted) {
    // If not, draw the start screen and return
    drawStartScreen();
    return;
  }

  // Fill canvas with background color
  ctx.fillStyle = "#9c9c9c";
  ctx.clearRect(0, 0, DIMENSIONS.CANVAS_WIDTH, DIMENSIONS.CANVAS_HEIGHT);
  ctx.fillRect(0, 0, DIMENSIONS.CANVAS_WIDTH, DIMENSIONS.CANVAS_HEIGHT);

  // Draw black lane lines
  ctx.fillStyle = "#000";
  ctx.fillRect(200, 0, 5, DIMENSIONS.CANVAS_HEIGHT);
  ctx.fillRect(400, 0, 5, DIMENSIONS.CANVAS_HEIGHT);

  // Draw white lane lines
  ctx.fillStyle = "#fff";
  ctx.fillRect(200, laneLine, 5, 30);
  ctx.fillRect(400, laneLine, 5, 30);
  laneLine += 10;
  if (laneLine > DIMENSIONS.CANVAS_HEIGHT) {
    laneLine = 0;
  }

  // Draw obstacle circles
  circles.forEach((circle) => {
    ctx.beginPath();
    ctx.drawImage(carImage, 215, 390, 122, 258, circle.center.x - 20, circle.center.y - 40, 40, 80);
    ctx.stroke();
    circle.center.y += clamp(SPEED * gameSpeed, 0, 20);

    // Reset obstacles that have moved off-screen
    if (circle.center.y > DIMENSIONS.CANVAS_HEIGHT) {
      score++;
      circle.center.y = getRandomInt(-200, 0);
    }

    // Check collision with player
    if (checkCollision(circle, player)) {
      isGameOver = true;
    }
  });

  //draw score
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Score: ${score}`,20,20)
    ctx.closePath();
    

  // Smoothly transition player position
  if (player.center.x < targetX) {
    player.center.x += Math.min(10, targetX - player.center.x);
  } else if (player.center.x > targetX) {
    player.center.x -= Math.min(10, player.center.x - targetX);
  }

  // Draw the player circle
  ctx.beginPath();
  ctx.drawImage(carImage, 215, 120, 122, 258, player.center.x - 20, player.center.y - 40, 40, 80);
  ctx.stroke();

  // If game is not over, continue drawing
  if (!isGameOver) {
    requestAnimationFrame(draw);
    gameSpeed *= 1.001;
  } else {
    // If game over, display game over message
    displayGameOver();
  }
}

// Function to check collision between two circles
function checkCollision(circle1: Circle, circle2: Circle): boolean {
  const dx = circle1.center.x - circle2.center.x;
  const dy = circle1.center.y - circle2.center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

// Function to display game over message
function displayGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "48px serif";
  ctx.fillText("Game Over", DIMENSIONS.CANVAS_WIDTH / 2 - 120, DIMENSIONS.CANVAS_HEIGHT / 2);
}

// Start the game loop
requestAnimationFrame(draw);

// Event listener for keypresses
window.addEventListener("keypress", (event) => {
  console.log(event.key);
  switch (event.key) {
    case "a": {
      // Move player left
      targetX -= 200;
      targetX = Math.max(targetX, 0); // Prevent moving out of bounds
      break;
    }
    case "d": {
      // Move player right
      targetX += 200;
      targetX = Math.min(targetX, DIMENSIONS.CANVAS_WIDTH); // Prevent moving out of bounds
      break;
    }
    case "Enter": {
      // Start the game when Enter is pressed
      if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(draw);
      }
      break;
    }
  }
});

