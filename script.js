const game = document.getElementById("game");
const dragon = document.getElementById("dragon");
let canShoot = true;
let score = 0;
let timeLeft = 60;
let gameOver = false;

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");

const reloadStatus = document.getElementById("reloadStatus");


let dragonX = window.innerWidth / 2;
const dragonSpeed = 5; // a bit smoother
const keys = {}; // track pressed keys

// Listen for key presses
document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;

  if (e.key === " " && canShoot && !gameOver) {
    shootFireball();
    canShoot = false;
    reloadStatus.innerText = "Reloading..."; // 🛑 show reloading

    setTimeout(() => {
      canShoot = true;
      reloadStatus.innerText = "Ready!"; // ✅ ready again
    }, 1000);
  }
});

// Listen for key releases
document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

// Move dragon based on pressed keys
function moveDragon() {
  if (keys["a"]) {
    dragonX -= dragonSpeed;
  }
  if (keys["d"]) {
    dragonX += dragonSpeed;
  }

  // Clamp dragon within screen
  dragonX = Math.max(0, Math.min(dragonX, window.innerWidth));
  dragon.style.left = `${dragonX}px`;

  requestAnimationFrame(moveDragon); // keeps moving smoothly
}

// Start moving!
moveDragon();

function shootFireball() {
    const fireball = document.createElement("div");
    fireball.classList.add("fireball");
    const fireSound = new Audio("./fire-SoundEffect.mp3")

    fireSound.play();

    // Get dragon's position inside the game container
    const rect = dragon.getBoundingClientRect();
    const dragonX = rect.left + window.scrollX - 35;
    const dragonY = rect.top + window.scrollY - 200;
  
    // Position fireball right above the dragon, centered
    fireball.style.left = `${dragonX + dragon.offsetWidth / 2 - 5}px`; // centered
    fireball.style.top = `${dragonY - 10}px`; // above the dragon
  
    // Use top instead of bottom now for easier control
    fireball.style.position = "absolute";
  
    game.appendChild(fireball);
  
    const interval = setInterval(() => {
      let top = parseInt(fireball.style.top);
      fireball.style.top = `${top - 10}px`;
  
      // Collision detection
      document.querySelectorAll(".human").forEach(human => {
        if (isColliding(fireball, human)) {
          game.removeChild(human);
          game.removeChild(fireball);
          score += 1;
          scoreElement.innerText = `Score: ${score}`;
          clearInterval(interval);
        }
      });
  
      if (top < 0) {
        if (game.contains(fireball)) game.removeChild(fireball);
        clearInterval(interval);
      }
    }, 30);
  }

function isColliding(a, b) {
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

function spawnHuman() {
  const human = document.createElement("div");
  human.classList.add("human");
  human.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
  game.appendChild(human);
}

setInterval(spawnHuman, 2000);

function startTimer() {
  const countdown = setInterval(() => {
    if (gameOver) {
      clearInterval(countdown);
      return;
    }

    timeLeft--;
    timerElement.innerText = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000); // Every 1 second
}

function endGame() {
  gameOver = true;

  // Disable shooting
  canShoot = false;

  // Optional: Stop humans from spawning (if you want)
  // clearInterval(humanSpawnInterval);

  // Show end game message
  alert(`Game Over! Final Score: ${score}`);
}

startTimer();