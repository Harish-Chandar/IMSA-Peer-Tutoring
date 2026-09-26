import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdtemp, rm, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename, delimiter } from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";
import ts from "typescript";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const serverRequire = createRequire(join(root, "src/server/package.json"));
const rootRequire = createRequire(join(root, "package.json"));
const sqlite3 = serverRequire("sqlite3");
const bcrypt = rootRequire("bcrypt");

function run(db, sql, values = []) {
    return new Promise((ok, fail) => db.run(sql, values, (error) => error ? fail(error) : ok()));
}

async function freePort() {
    const listener = net.createServer();
    await new Promise((ok) => listener.listen(0, "127.0.0.1", ok));
    const port = listener.address().port;
    await new Promise((ok) => listener.close(ok));
    return port;
}

test("login, CSRF, role checks, password hash filtering, and logout revocation", async () => {
    const directory = await mkdtemp(join(tmpdir(), "peertutor-security-"));
    const db = new sqlite3.Database(join(directory, "peertutoringdb.sqlite"));
    let child;
    try {
        await run(db, "CREATE TABLE admins (id INTEGER PRIMARY KEY, email TEXT UNIQUE, pwd TEXT, access INTEGER)");
        const hash = bcrypt.hashSync("test-password", 4);
        await run(db, "INSERT INTO admins (email, pwd, access) VALUES (?, ?, ?)", ["admin@example.edu", hash, 1]);
        await run(db, "INSERT INTO admins (email, pwd, access) VALUES (?, ?, ?)", ["teacher@example.edu", hash, 2]);
        await new Promise((ok, fail) => db.close((error) => error ? fail(error) : ok()));

        const port = await freePort();
        const base = `http://127.0.0.1:${port}`;
        const serverFile = join(directory, "server.cjs");
        const source = await readFile(join(root, "src/server/tutorsAPI.ts"), "utf8");
        const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } });
        await writeFile(serverFile, compiled.outputText);
        child = spawn(process.execPath, [serverFile], {
            cwd: directory,
            env: { ...process.env, NODE_PATH: [join(root, "src/server/node_modules"), join(root, "node_modules")].join(delimiter), DEV_SERVER: "true", DBHOST: String(port), JWT_SECRET: "integration-test-secret", FRONTEND_ORIGIN: "http://localhost:3000", CLOUDINARY_CLOUD_NAME: "test", CLOUDINARY_API_KEY: "test", CLOUDINARY_API_SECRET: "test" },
            stdio: ["ignore", "pipe", "pipe"],
        });
        let serverError = "";
        child.stderr.on("data", (chunk) => { serverError += chunk.toString(); });

        let ready = false;
        for (let attempt = 0; attempt < 100; attempt++) {
            if (child.exitCode !== null) throw new Error(`Server exited with ${child.exitCode}: ${serverError}`);
            try {
                const probe = await fetch(`${base}/api/session`);
                if (probe.status === 401) { ready = true; break; }
            } catch (_) { /* Server is still starting. */ }
            await new Promise((ok) => setTimeout(ok, 100));
        }
        assert.ok(ready, "server started");

        async function login(email) {
            const response = await fetch(`${base}/api/login`, {
                method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
                body: JSON.stringify({ email, password: "test-password" }),
            });
            assert.equal(response.status, 200);
            const body = await response.json();
            assert.equal(body.token, undefined);
            assert.ok(response.headers.get("set-cookie")?.includes("HttpOnly"));
            return { body, cookie: response.headers.get("set-cookie").split(";")[0] };
        }

        const teacher = await login("teacher@example.edu");
        const admin = await login("admin@example.edu");
        const headers = (session, csrf = true) => ({ Cookie: session.cookie, ...(csrf ? { "X-CSRF-Token": session.body.csrf } : {}), "Content-Type": "application/json" });

        assert.equal((await fetch(`${base}/api/admins`, { headers: headers(teacher) })).status, 403);
        assert.equal((await fetch(`${base}/api/admin/create`, { method: "POST", headers: headers(teacher), body: JSON.stringify({ email: "new@example.edu", password: "password", role: 1 }) })).status, 403);
        assert.equal((await fetch(`${base}/api/tutors`, { method: "POST", headers: headers(teacher), body: "{}" })).status, 403);
        assert.equal((await fetch(`${base}/api/admin/create`, { method: "POST", headers: headers(admin, false), body: "{}" })).status, 403);

        const accounts = await fetch(`${base}/api/admins`, { headers: headers(admin) });
        assert.equal(accounts.status, 200);
        assert.ok((await accounts.json()).every((account) => !Object.hasOwn(account, "pwd")));

        assert.equal((await fetch(`${base}/api/logout`, { method: "POST", headers: headers(admin) })).status, 200);
        assert.equal((await fetch(`${base}/api/admins`, { headers: headers(admin) })).status, 401);
    } finally {
        if (child && child.exitCode === null) {
            child.kill();
            await new Promise((ok) => child.once("exit", ok));
        }
        const target = resolve(directory);
        assert.equal(dirname(target), resolve(tmpdir()));
        assert.ok(basename(target).startsWith("peertutor-security-"));
        await rm(target, { recursive: true, force: true });
    }
});
