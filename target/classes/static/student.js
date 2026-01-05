const apiUrl = "http://localhost:8080/api/students";

/* 🔐 Redirect if not logged in */
if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "/index.html";
}

/* 🔍 Get role from auth.js */
const role = getUserRole();

/* 🎭 Hide form for USER */
const form = document.getElementById("studentForm");
if (role !== "ROLE_ADMIN") {
    form.style.display = "none";
}

/* ➕ ADD STUDENT (ADMIN) */
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (role !== "ROLE_ADMIN") {
        alert("Only ADMIN can add students");
        return;
    }

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: document.getElementById("mobile").value.trim()
    };

    if (!student.name || !student.email || !student.mobile) {
        showError("All fields are required");
        return;
    }

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error("Create failed");

        form.reset();
        loadStudents();
    } catch (err) {
        showError(err.message);
    }
});

/* 📚 LOAD STUDENTS */
async function loadStudents() {
    try {
        const res = await fetch(apiUrl, {
            headers: authHeader()
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        const table = document.getElementById("studentTable");
        table.innerHTML = "";

        if (!data || data.length === 0) {
            table.innerHTML = `<tr><td colspan="5">No students found</td></tr>`;
            return;
        }

        data.forEach(s => {
            table.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td>${s.mobile}</td>
                    <td>
                        ${role === "ROLE_ADMIN"
                            ? `<button onclick="deleteStudent(${s.id})">Delete</button>`
                            : "View Only"}
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        showError(err.message);
    }
}

/* ❌ DELETE STUDENT (ADMIN) */
async function deleteStudent(id) {
    if (role !== "ROLE_ADMIN") {
        alert("Only ADMIN can delete students");
        return;
    }

    if (!confirm("Are you sure?")) return;

    try {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
            headers: authHeader()
        });

        if (!res.ok) throw new Error("Delete failed");

        loadStudents();
    } catch (err) {
        showError(err.message);
    }
}

/* 🚀 INITIAL LOAD */
loadStudents();
