function initHighScores() {
  const highScoresTable = document.querySelector(".high-scores-table tbody");
  const newGameBtn = document.getElementById("newGame");
  const exitBtn = document.getElementById("exitButton");

  const header = document.querySelector(".high-scores-container h1");
  if (window.currentUser) {
    header.textContent = `HIGH SCORES - ${window.currentUser}`;
  }

  highScoresTable.innerHTML = "";

  // 🛠 1. Sort scores from highest to lowest
  if (Array.isArray(window.scores)) {
    const sortedScores = [...window.scores].sort((a, b) => b.score - a.score);

    // 🛠 2. Find the last added score (current game score)
    const latestScore = window.scores[window.scores.length - 1];

    sortedScores.forEach((scoreObj, index) => {
      const row = document.createElement("tr");

      // Check if this is the current game's score
      const isCurrent = scoreObj.score === latestScore.score && scoreObj.time === latestScore.time;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="score">${scoreObj.score}</td>
        <td>${scoreObj.time}</td>
      `;

      if (isCurrent) {
        row.classList.add("current-score"); // 🛠 Add special class
      }

      highScoresTable.appendChild(row);
    });
  }

  // Handle "New Game"
  newGameBtn?.addEventListener("click", () => {
    console.log("NewGame Clicked");
    showScreen("Game");
  });

  // Handle "Exit"
  exitBtn?.addEventListener("click", () => {
    window.scores = [];
    console.log("Exit Button Clicked");
    showScreen("Home");
  });
}

document.getElementById("HighScores")?.addEventListener("screenLoaded", (e) => {
  if (e.detail.screenId === "HighScores") {
    console.log("Initializing HighScores!")
    initHighScores();
  }
});

