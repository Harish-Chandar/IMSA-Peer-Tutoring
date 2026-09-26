import test from "node:test";
import assert from "node:assert/strict";
import { apiFetch } from "../src/apiFetch.js";

function withSession(value, responseStatus = 200) {
    const saved = value ? JSON.stringify(value) : null;
    const calls = [];
    globalThis.localStorage = {
        getItem: () => saved,
        removeItem: (key) => calls.push(["remove", key]),
    };
    globalThis.window = {
        fetch: async (...args) => {
            calls.push(["fetch", ...args]);
            return { status: responseStatus };
        },
    };
    return calls;
}

test("protected writes send cookie and CSRF header, never an authorization header", async () => {
    const calls = withSession({ csrf: "csrf-value", access: 1 });
    await apiFetch("https://peertutor.imsa.edu:5000/api/tutors", { method: "POST" });
    const [, , options] = calls[0];
    assert.equal(options.credentials, "include");
    assert.equal(options.headers.get("X-CSRF-Token"), "csrf-value");
    assert.equal(options.headers.has("Authorization"), false);
});

test("server rejection clears local display information", async () => {
    const calls = withSession({ csrf: "csrf-value" }, 401);
    await apiFetch("https://peertutor.imsa.edu:5000/api/tutors");
    assert.deepEqual(calls[1], ["remove", "session"]);
});
