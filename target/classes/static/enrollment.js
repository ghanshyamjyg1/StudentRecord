const enrollmentApi = "http://localhost:8080/api/enrollments";
const studentApi = "http://localhost:8080/api/students";
const courseApi = "http://localhost:8080/api/courses";

/* 🔐 Redirect if not logged in */
if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "/index.html";
}

/* 🔍 Get role from auth.js */
const role = getUserRole();

/* 🎭 Hide enroll form for USER */
const form = document.getElementById("enrollForm");
if (role !== "ROLE_ADMIN") {
    form.style.display = "none";
}

/* ➕ ENROLL STUDENT (ADMIN) */
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (role !== "ROLE_ADMIN") {
        alert("Only ADMIN can enroll students");
        return;
    }

    const studentId = document.getElementById("studentSelect").value;
    const courseId = document.getElementById("courseSelect").value;

    try {
        const res = await fetch(
            `${enrollmentApi}?studentId=${studentId}&courseId=${courseId}`,
            {
                method: "POST",
                headers: authHeader()
            }
        );

        if (!res.ok) throw new Error("Enrollment failed");

        loadEnrollments();
    } catch (err) {
        showError(err.message);
    }
});

/* 👨‍🎓 LOAD STUDENTS (ADMIN) */
async function loadStudentsDropdown() {
    if (role !== "ROLE_ADMIN") return;

    try {
        const res = await fetch(studentApi, { headers: authHeader() });
        if (!res.ok) throw new Error("Failed to load students");

        const data = await res.json();
        const select = document.getElementById("studentSelect");
        select.innerHTML = "";

        data.forEach(s => {
            select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
    } catch (err) {
        showError(err.message);
    }
}

/* 📚 LOAD COURSES (ADMIN) */
async function loadCoursesDropdown() {
    if (role !== "ROLE_ADMIN") return;

    try {
        const res = await fetch(courseApi, { headers: authHeader() });
        if (!res.ok) throw new Error("Failed to load courses");

        const data = await res.json();
        const select = document.getElementById("courseSelect");
        select.innerHTML = "";

        data.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.title}</option>`;
        });
    } catch (err) {
        showError(err.message);
    }
}


/* 📄 LOAD ENROLLMENTS (ADMIN + USER) */
async function loadEnrollments() {
    try {
        const res = await fetch(enrollmentApi, { headers: authHeader() });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        const table = document.getElementById("enrollTable");
        table.innerHTML = "";

        if (!data || data.length === 0) {
            table.innerHTML = `<tr><td colspan="4">No enrollments found</td></tr>`;
            return;
        }

        data.forEach(e => {
            table.innerHTML += `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.student.name}</td>
                    <td>${e.course.title}</td>
                    <td>
                        ${role === "ROLE_ADMIN"
                            ? `<button onclick="deleteEnrollment(${e.id})">Delete</button>`
                            : "View Only"}
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        showError(err.message);
    }
}

/* ❌ DELETE ENROLLMENT (ADMIN) */
async function deleteEnrollment(id) {
    if (role !== "ROLE_ADMIN") {
        showError("Only ADMIN can delete enrollments");
        return;
    }

    if (!confirm("Are you sure you want to delete this enrollment?")) return;

    try {
        const res = await fetch(`${enrollmentApi}/${id}`, {
            method: "DELETE",
            headers: authHeader()
        });

        if (!res.ok) throw new Error("Failed to delete enrollment");

        loadEnrollments();
    } catch (err) {
        showError(err.message);
    }
}

/* 🚀 INITIAL LOAD */
loadStudentsDropdown();
loadCoursesDropdown();
loadEnrollments();
