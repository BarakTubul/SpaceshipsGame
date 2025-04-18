const users = window.users;
const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");
const errorMessage = document.getElementById("loginError");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      errorMessage.style.display = "none";
      // Redirect to game screen (replace with your actual function)
      showScreen("Game");
    } else {
      errorMessage.style.display = "block";
    }
  });
}

