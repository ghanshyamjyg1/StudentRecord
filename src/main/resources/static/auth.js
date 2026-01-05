const BASE_URL = "http://localhost:8080";

/* ======================
   AUTH HELPERS
====================== */

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function getToken() {
    return localStorage.getItem("token");
}

/* 🔍 SAFE ROLE DECODE */
function getUserRole() {
    try {
        const token = getToken();
        if (!token) return "";
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || "";
    } catch (e) {
        logout();
        return "";
    }
}

/* 🔐 AUTH HEADER */
function authHeader() {
    const token = getToken();
    return {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    };
}

/* ======================
   LOGIN
====================== */

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showError("Username and password are required");
        return;
    }

    fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("token", data.token);

            const role = getUserRole();
            if (role === "ROLE_ADMIN") {
                window.location.href = "/students.html";
            } else {
                window.location.href = "/courses.html";
            }
        })
        .catch(err => showError(err.message));
}

/* ======================
   REGISTER
====================== */

function register() {
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!username || !password) {
        showError("Username and password required");
        return;
    }

    fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(() => {
            alert("Registration successful ✅");
            document.getElementById("registerSection").style.display = "none";
        })
        .catch(err => showError(err.message));
}

/* ======================
   LOGOUT
====================== */

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}

/* ======================
   NAVBAR
====================== */

function updateNavbar() {
    const links = document.querySelectorAll(".secure-link");
    const logoutBtn = document.getElementById("logoutBtn");
    const roleBadge = document.getElementById("roleBadge");
    const loginSection = document.getElementById("loginSection");

    if (!isLoggedIn()) {
        links.forEach(l => l.style.display = "none");
        logoutBtn.style.display = "none";
        roleBadge.style.display = "none";
        loginSection.style.display = "block";
    } else {
        const username = getUsername();

        links.forEach(l => l.style.display = "inline");
        logoutBtn.style.display = "inline-flex";
        logoutBtn.style.alignItems = "center";
        logoutBtn.style.justifyContent = "center";

        // Show only the username
                roleBadge.innerText = username;
                roleBadge.style.display = "inline";
                loginSection.style.display = "none";
    }
}
/* 🔍 GET USERNAME FROM TOKEN */
function getUsername() {
    try {
        const token = getToken();
        if (!token) return "";
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub || "User"; // 'sub' typically contains the username
    } catch (e) {
        return "User";
    }
}

/* ======================
   ERROR
====================== */

function showError(message) {
    const box = document.getElementById("errorBox");
    if (box) {
        box.innerText = message;
        box.style.display = "block";
    } else {
        alert(message);
    }
}

/* ======================
   AUTO INIT (ONLY ONCE)
====================== */

document.addEventListener("DOMContentLoaded", updateNavbar);
