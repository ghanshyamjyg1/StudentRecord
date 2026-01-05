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
// Edit student function
function editStudent(id, name, email, mobile) {
    if (role !== "ROLE_ADMIN") {
        showError("Only ADMIN can edit students");
        return;
    }

    // Find the row by iterating through all rows
    const rows = document.querySelectorAll('#studentTable tr');
    let targetRow = null;

    for (const row of rows) {
        if (row.cells[0]?.textContent === id.toString()) {
            targetRow = row;
            break;
        }
    }

    if (!targetRow) {
        showError("Could not find student row");
        return;
    }

    // Store original content for cancel
    targetRow._originalContent = targetRow.innerHTML;

    // Set edit mode
    targetRow.innerHTML = `
        <td>${id}</td>
        <td><input type="text" id="editName" value="${name.replace(/"/g, '&quot;')}" class="form-control"></td>
        <td><input type="email" id="editEmail" value="${email}" class="form-control"></td>
        <td><input type="text" id="editMobile" value="${mobile}" class="form-control"></td>
        <td>
            <button class="btn-save" onclick="saveStudent(${id}, this)">Save</button>
            <button class="btn-cancel" onclick="cancelEdit(this)">Cancel</button>
        </td>
    `;
}

// Save student function
async function saveStudent(id, button) {
    try {
        const row = button.closest('tr');
        const student = {
            name: row.querySelector('#editName').value.trim(),
            email: row.querySelector('#editEmail').value.trim(),
            mobile: row.querySelector('#editMobile').value.trim()
        };

        const res = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                ...authHeader(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error("Update failed");

        loadStudents(); // Reload the table
    } catch (err) {
        showError(err.message);
    }
}

function cancelEdit(button) {
    const row = button.closest('tr');
    if (row._originalContent) {
        row.innerHTML = row._originalContent;
    } else {
        loadStudents(); // Fallback to reload if original content not found
    }
}

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

      // In loadStudents function, update the row HTML to include data-id
      data.forEach(s => {
          table.innerHTML += `
              <tr data-id="${s.id}">
                  <td>${s.id}</td>
                  <td>${s.name}</td>
                  <td>${s.email}</td>
                  <td>${s.mobile}</td>
                  <td>
                      ${role === "ROLE_ADMIN" ? `
                          <button class="btn-update" onclick="editStudent('${s.id}', '${s.name.replace(/'/g, "\\'")}', '${s.email}', '${s.mobile}')">Update</button>
                          <button class="delete-btn" onclick="deleteStudent(${s.id})">Delete</button>
                      ` : "View Only"}
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
