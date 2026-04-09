const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const crypto = require("crypto");
const http = require("http");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");
const QRCode = require("qrcode");

const isMac = process.platform === "darwin";
const appRoot = path.join(__dirname, "..");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

let lastSaveDirectory = null;
let mainWindow = null;
let mobileSession = null;
const desktopIconPath = path.join(appRoot, "assets", "koala-logo.png");

function createWindow() {
  const window = new BrowserWindow({
    width: 1450,
    height: 980,
    minWidth: 900,
    minHeight: 680,
    title: "Koala",
    autoHideMenuBar: true,
    backgroundColor: "#f9f6ef",
    icon: desktopIconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow = window;
  window.loadFile(path.join(appRoot, "index.html"));
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  window.on("closed", () => {
    if (mainWindow === window) {
      mainWindow = null;
    }
  });
}

function getLocalNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      const family = typeof entry.family === "string" ? entry.family : entry.family === 4 ? "IPv4" : "";
      if (family !== "IPv4" || entry.internal || !entry.address || entry.address.startsWith("169.254.")) {
        continue;
      }
      return entry.address;
    }
  }
  return "";
}

function buildMobileSessionInfo() {
  if (!mobileSession) {
    return { active: false };
  }

  return {
    active: true,
    url: mobileSession.url,
    qrCodeDataUrl: mobileSession.qrCodeDataUrl,
    startedAt: mobileSession.startedAt,
    submissionCount: mobileSession.submissionCount,
    latestSubmissionAt: mobileSession.latestSubmissionAt,
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req, maxBytes = 1024 * 1024) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > maxBytes) {
      throw new Error("Request body too large.");
    }
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

async function serveStaticFile(req, res, pathname) {
  const requestPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.join(appRoot, requestPath);

  if (!filePath.startsWith(appRoot)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

function broadcastMobileSubmission(payload) {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("mobile-session-submission", payload);
  });
}

async function handleMobileRequest(req, res) {
  const requestUrl = new URL(req.url || "/", "http://127.0.0.1");

  if (requestUrl.pathname === "/api/mobile-session" && req.method === "GET") {
    sendJson(res, 200, buildMobileSessionInfo());
    return;
  }

  if (requestUrl.pathname === "/api/mobile-submit" && req.method === "POST") {
    if (!mobileSession) {
      sendJson(res, 410, { ok: false, error: "Mobile session is not active." });
      return;
    }

    try {
      const payload = await readJsonBody(req);
      if (payload.token !== mobileSession.token) {
        sendJson(res, 403, { ok: false, error: "Mobile session token is invalid." });
        return;
      }
      if (!payload.formState || typeof payload.formState !== "object" || Array.isArray(payload.formState)) {
        sendJson(res, 400, { ok: false, error: "Form data was missing from the request." });
        return;
      }

      const submission = {
        formState: payload.formState,
        submittedAt: new Date().toISOString(),
        deviceLabel: typeof payload.deviceLabel === "string" ? payload.deviceLabel.slice(0, 120) : "",
      };

      mobileSession.latestSubmissionAt = submission.submittedAt;
      mobileSession.submissionCount += 1;
      broadcastMobileSubmission(submission);
      sendJson(res, 200, { ok: true, receivedAt: submission.submittedAt });
      return;
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error instanceof Error ? error.message : "Could not read the mobile request.",
      });
      return;
    }
  }

  if (!["GET", "HEAD"].includes(req.method || "GET")) {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  await serveStaticFile(req, res, requestUrl.pathname);
}

async function startMobileSession() {
  if (mobileSession) {
    return buildMobileSessionInfo();
  }

  if (!mainWindow) {
    throw new Error("The desktop window is not ready yet.");
  }

  const localAddress = getLocalNetworkAddress();
  if (!localAddress) {
    throw new Error("Could not find a local network address. Connect the computer to Wi-Fi or Ethernet first.");
  }

  const server = http.createServer((req, res) => {
    handleMobileRequest(req, res).catch((error) => {
      console.error("Mobile session server error:", error);
      sendJson(res, 500, { ok: false, error: "The mobile session server hit an unexpected error." });
    });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "0.0.0.0", () => {
      server.off("error", reject);
      resolve();
    });
  });

  const addressInfo = server.address();
  const port = typeof addressInfo === "object" && addressInfo ? addressInfo.port : 0;
  const token = crypto.randomBytes(24).toString("hex");
  const url = `http://${localAddress}:${port}/?mode=mobile&session=${token}`;
  const qrCodeDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 240,
    color: {
      dark: "#0f7b72",
      light: "#fffdf8",
    },
  });

  mobileSession = {
    server,
    token,
    url,
    qrCodeDataUrl,
    startedAt: new Date().toISOString(),
    submissionCount: 0,
    latestSubmissionAt: "",
  };

  return buildMobileSessionInfo();
}

async function stopMobileSession() {
  if (!mobileSession) {
    return { active: false };
  }

  const activeSession = mobileSession;
  mobileSession = null;

  await new Promise((resolve) => {
    activeSession.server.close(() => resolve());
  });

  return { active: false };
}

async function getUniqueSavePath(directory, fileName) {
  const baseDirectory = directory || app.getPath("downloads") || os.homedir();
  const parsed = path.parse(fileName || "daily-note.pdf");
  const extension = parsed.ext || ".pdf";
  let candidate = path.join(baseDirectory, `${parsed.name}${extension}`);
  let index = 2;

  while (true) {
    try {
      await fs.access(candidate);
      candidate = path.join(baseDirectory, `${parsed.name} ${index}${extension}`);
      index += 1;
    } catch {
      return candidate;
    }
  }
}

ipcMain.handle("save-pdf", async (event, { fileName, base64 }) => {
  const targetWindow = BrowserWindow.fromWebContents(event.sender);
  const suggestedPath = await getUniqueSavePath(lastSaveDirectory, fileName);
  const { canceled, filePath } = await dialog.showSaveDialog(targetWindow, {
    title: "Save Koala PDF",
    defaultPath: suggestedPath,
    filters: [{ name: "PDF", extensions: ["pdf"] }],
  });

  if (canceled || !filePath) {
    return { canceled: true };
  }

  const normalizedPath = path.extname(filePath) ? filePath : `${filePath}.pdf`;
  const buffer = Buffer.from(base64, "base64");
  await fs.writeFile(normalizedPath, buffer);
  lastSaveDirectory = path.dirname(normalizedPath);
  return { canceled: false, path: normalizedPath };
});

ipcMain.handle("save-pdf-silent", async (_event, { fileName, base64 }) => {
  const normalizedPath = await getUniqueSavePath(lastSaveDirectory, fileName);
  const buffer = Buffer.from(base64, "base64");
  await fs.writeFile(normalizedPath, buffer);
  lastSaveDirectory = path.dirname(normalizedPath);
  return { canceled: false, path: normalizedPath };
});

ipcMain.handle("mobile-session-start", async () => startMobileSession());
ipcMain.handle("mobile-session-stop", async () => stopMobileSession());
ipcMain.handle("mobile-session-status", async () => buildMobileSessionInfo());

app.whenReady().then(() => {
  app.setName("Koala");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", () => {
  if (mobileSession) {
    mobileSession.server.close();
  }
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
