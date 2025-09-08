const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");
const errorMessage = document.getElementById("loginError");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const foundUser = window.users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      errorMessage.style.display = "none";
      window.currentUser = username;
      console.log("login succesful going to configurations")
      showScreen("Configurations");
    } else {
      errorMessage.style.display = "block";
    }
  });
}

