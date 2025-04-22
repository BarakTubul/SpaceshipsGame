function initHighScores() {
    const highScoresTable = document.querySelector(".high-scores-table tbody");
    const newGameBtn = document.getElementById("newGame");
    const exitBtn = document.getElementById("exitButton");

    const header = document.querySelector(".high-scores-container h1");
    if (window.currentUser) {
      header.textContent = `HIGH SCORES - ${window.currentUser}`;
    }
    highScoresTable.innerHTML = "";
     // Insert scores from window.scores
    if (Array.isArray(window.scores)) {
      window.scores.forEach((scoreObj, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td class="score">${scoreObj.score}</td>
          <td>${scoreObj.time}</td>
        `;
        highScoresTable.appendChild(row);
      });
    }
  
    // Handle "New Game"
    newGameBtn?.addEventListener("click", () => {
      console.log("NewGame Clicked")
      showScreen("Game"); // or your actual game-start screen
    });
  
    // Handle "Exit"
    exitBtn?.addEventListener("click", () => {
      console.log("Exit Button Clicked")
      showScreen("Home");
    });
  }
  