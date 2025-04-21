const game = document.getElementById("game");
const dragon = document.getElementById("dragon");

let dragonX = window.innerWidth / 2;
const dragonSpeed = 10;

document.addEventListener("keydown", e => {
  if (e.key === "a" || e.key === "A") {
    dragonX -= dragonSpeed;
  } else if (e.key === "d" || e.key === "D") {
    dragonX += dragonSpeed;
  } else if (e.key === " ") {
    shootFireball();
  }

  // Clamp to screen
  dragonX = Math.max(0, Math.min(dragonX, window.innerWidth - dragon.offsetWidth));
  dragon.style.left = `${dragonX}px`;
});

function shootFireball() {
    const fireball = document.createElement("div");
    fireball.classList.add("fireball");
  
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