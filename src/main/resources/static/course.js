const apiUrl = "http://localhost:8080/api/courses";

/* 🔐 Redirect if not logged in */
if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "/index.html";
}

/* 🔍 Get role (USE auth.js) */
const role = getUserRole();

/* 🎭 Hide form for USER */
const form = document.getElementById("courseForm");
if (role !== "ROLE_ADMIN") {
    form.style.display = "none";
}

/* ➕ CREATE COURSE (ADMIN) */
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (role !== "ROLE_ADMIN") {
        alert("Only ADMIN can create course");
        return;
    }

    const course = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify(course)
        });

        if (!res.ok) throw new Error("Create failed");

        form.reset();
        loadCourses();
    } catch (err) {
        alert(err.message);
    }
});

/* 📚 LOAD COURSES */
async function loadCourses() {
    try {
        const res = await fetch(apiUrl, {
            headers: authHeader()
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        const table = document.getElementById("courseTable");
        table.innerHTML = "";

        data.forEach(c => {
            table.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.title}</td>
                    <td>${c.description}</td>
                    <td>
                        ${role === "ROLE_ADMIN"
                            ? `<button onclick="deleteCourse(${c.id})">Delete</button>`
                            : "View Only"}
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        alert(err.message);
    }
}

/* ❌ DELETE COURSE (ADMIN) */
async function deleteCourse(id) {
    if (role !== "ROLE_ADMIN") return alert("Only ADMIN");

    if (!confirm("Are you sure?")) return;

    try {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
            headers: authHeader()
        });

        if (!res.ok) throw new Error("Delete failed");

        loadCourses();
    } catch (err) {
        alert(err.message);
    }
}

/* 🚀 INITIAL LOAD */
loadCourses();
