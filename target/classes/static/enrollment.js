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
// Update the loadEnrollments function to include data attributes
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
            const row = document.createElement('tr');
            row.setAttribute('data-id', e.id);
            row.setAttribute('data-student-id', e.student.id); // Store student ID for updates
            row.innerHTML = `
                <td>${e.id}</td>
                <td>${e.student.name}</td>
                <td>${e.course.title}</td>
                <td>
                    ${role === "ROLE_ADMIN" ? `
                        <button class="btn-update" onclick="editEnrollment('${e.id}', '${e.student.id}', '${e.course.id}')">Update</button>
                        <button class="delete-btn" onclick="deleteEnrollment(${e.id})">Delete</button>
                    ` : "View Only"}
                </td>
            `;
            table.appendChild(row);
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
// Update the editEnrollment function
async function editEnrollment(id, currentStudentId, currentCourseId) {
    if (role !== "ROLE_ADMIN") {
        showError("Only ADMIN can edit enrollments");
        return;
    }

    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) {
        showError("Could not find enrollment row");
        return;
    }

    // Store original content for cancel
    row._originalContent = row.innerHTML;

    try {
        // Load only courses for dropdown (not students)
        const coursesRes = await fetch(courseApi, { headers: authHeader() });
        if (!coursesRes.ok) throw new Error("Failed to load courses");
        const courses = await coursesRes.json();

        // Create course options
        let courseOptions = courses.map(c =>
            `<option value="${c.id}" ${c.id == currentCourseId ? 'selected' : ''}>${c.title}</option>`
        ).join('');

        // Set edit mode - only show course dropdown, keep student name as text
        row.innerHTML = `
            <td>${id}</td>
            <td>${row.cells[1].textContent}</td> <!-- Keep original student name as text -->
            <td>
                <select class="form-control" id="editCourseId">
                    ${courseOptions}
                </select>
            </td>
            <td>
                <button class="btn-save" onclick="saveEnrollment(${id}, this)">Save</button>
                <button class="btn-cancel" onclick="cancelEdit(this)">Cancel</button>
            </td>
        `;
    } catch (err) {
        showError(err.message);
    }
}


// Save enrollment function
// Update the saveEnrollment function
async function saveEnrollment(id, button) {
    try {
        const row = button.closest('tr');
        const courseId = row.querySelector('#editCourseId').value;

        // Get the student ID from the original row data
        const studentId = row.getAttribute('data-student-id');

        const res = await fetch(`${enrollmentApi}/${id}?studentId=${studentId}&courseId=${courseId}`, {
            method: "PUT",
            headers: authHeader()
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Update failed");
        }

        loadEnrollments();
    } catch (err) {
        showError(err.message);
    }
}

// Reuse the cancelEdit function from student.js
function cancelEdit(button) {
    const row = button.closest('tr');
    if (row._originalContent) {
        row.innerHTML = row._originalContent;
    } else {
        loadEnrollments();
    }
}

/* 🚀 INITIAL LOAD */
loadStudentsDropdown();
loadCoursesDropdown();
loadEnrollments();
