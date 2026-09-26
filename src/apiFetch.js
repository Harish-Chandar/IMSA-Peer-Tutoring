// The server holds the credential in an HttpOnly cookie. Browser storage contains
// only display information and the CSRF token needed for write requests.
export async function apiFetch(url, options = {}) {
    let session;
    try {
        session = JSON.parse(localStorage.getItem("session"));
    } catch (_) {
        session = null;
    }
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers);
    if (!["GET", "HEAD", "OPTIONS"].includes(method) && session?.csrf) {
        headers.set("X-CSRF-Token", session.csrf);
    }
    const response = await window.fetch(url, { ...options, credentials: "include", headers });
    if (response.status === 401 && !String(url).endsWith("/api/login")) {
        localStorage.removeItem("session");
    }
    return response;
}
