// signup.js

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function isValidPassword(password) {
    return /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8;
  }
  
  function hasOnlyLetters(text) {
    return /^[A-Za-z]+$/.test(text);
  }
  
  function populateDOB() {
    const yearSelect = document.getElementById("dobYear");
    const monthSelect = document.getElementById("dobMonth");
    const daySelect = document.getElementById("dobDay");
  
    for (let y = 2024; y >= 1900; y--) {
      yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
    }
  
    for (let m = 1; m <= 12; m++) {
      monthSelect.innerHTML += `<option value="${m}">${m}</option>`;
    }
  
    for (let d = 1; d <= 31; d++) {
      daySelect.innerHTML += `<option value="${d}">${d}</option>`;
    }
  }
  
  function initSignupForm() {
    populateDOB();
  
    const form = document.getElementById("signupForm");
    const error = document.getElementById("signupError");
  
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("signupUsername").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
      const confirm = document.getElementById("signupConfirm").value.trim();
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email")?.value.trim(); // optional if you add email field
      const year = document.getElementById("dobYear").value;
      const month = document.getElementById("dobMonth").value;
      const day = document.getElementById("dobDay").value;
  
      if (!username || !password || !confirm || !firstName || !lastName || !year || !month || !day) {
        error.textContent = "Please fill in all fields.";
        error.style.display = "block";
        return;
      }
  
      if (password !== confirm) {
        error.textContent = "Passwords do not match.";
        error.style.display = "block";
        return;
      }
  
      if (!isValidPassword(password)) {
        error.textContent = "Password must include letters, numbers and be at least 8 characters.";
        error.style.display = "block";
        return;
      }
  
      if (!hasOnlyLetters(firstName) || !hasOnlyLetters(lastName)) {
        error.textContent = "First and last names must contain only letters.";
        error.style.display = "block";
        return;
      }
  
      if (email && !isValidEmail(email)) {
        error.textContent = "Invalid email address.";
        error.style.display = "block";
        return;
      }
  
      // Check for existing username
      if (window.users.find(u => u.username === username)) {
        error.textContent = "Username already exists.";
        error.style.display = "block";
        return;
      }
  
      // Add user
      window.users.push({ username, password });
  
      error.style.display = "none";
      alert("Registration successful! You can now log in.");
      showScreen("Login");
    });
  }
  
  