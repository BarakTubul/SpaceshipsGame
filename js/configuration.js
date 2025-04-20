// configuration.js

let selectedColor = null;
let selectedShootKey = "Z";
let bgAudio = null;

function playBackgroundMusic() {
  if (!bgAudio) {
    bgAudio = new Audio("./Assets/Audio/configurationScreen.mp3");
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    bgAudio.play()
  }
}

function stopBackgroundMusic() {
  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
    bgAudio = null;
  }
}

function playClickSound() {
  const clickAudio = new Audio("./Assets/Audio/clickConfig.mp3");
  clickAudio.play();
}

function initConfigForm() {
  // Only initialize if we're on the config screen
  // const configScreen = document.getElementById("Configurations");
  // if (!configScreen || !configScreen.classList.contains("active")) return;

  playBackgroundMusic();

  const colorBoxes = document.querySelectorAll(".color-box");
  colorBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      colorBoxes.forEach((b) => b.classList.remove("selected"));
      box.classList.add("selected");
      selectedColor = box.dataset.color;
    });
  });

  const shootKeyInput = document.getElementById("shootKey");
  shootKeyInput.addEventListener("input", () => {
    selectedShootKey = shootKeyInput.value.toUpperCase();
    shootKeyInput.value = selectedShootKey;
  });

  const form = document.getElementById("configForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    playClickSound();
    stopBackgroundMusic();

    // Save settings
    window.config = {
      shootKey: selectedShootKey.toLowerCase(),
      gameTime: parseFloat(document.getElementById("gameTime").value),
      color: selectedColor || "#f5a623"
    };

    console.log("✅ Saving user config:", window.config);


    showScreen("Game");
  });
}

