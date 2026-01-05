export function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/index.html";
        return;
    }

    options.headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    return fetch(url, options).then(res => {
        if (res.status === 401) {
            alert("Session expired ❌");
            localStorage.clear();
            window.location.href = "/index.html";
            return;
        }

        if (res.status === 403) {
            alert("Admin access only ❌");
            return;
        }

        return res;
    });
}
