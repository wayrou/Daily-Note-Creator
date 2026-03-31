const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");

const isMac = process.platform === "darwin";

function createWindow() {
  const window = new BrowserWindow({
    width: 1450,
    height: 980,
    minWidth: 900,
    minHeight: 680,
    title: "Daily Note Creator",
    autoHideMenuBar: true,
    backgroundColor: "#f9f6ef",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadFile(path.join(__dirname, "..", "index.html"));
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

async function getUniqueSavePath(fileName) {
  const downloadsDir = app.getPath("downloads") || os.homedir();
  const parsed = path.parse(fileName || "daily-note.pdf");
  const extension = parsed.ext || ".pdf";
  let candidate = path.join(downloadsDir, `${parsed.name}${extension}`);
  let index = 2;

  while (true) {
    try {
      await fs.access(candidate);
      candidate = path.join(downloadsDir, `${parsed.name} ${index}${extension}`);
      index += 1;
    } catch {
      return candidate;
    }
  }
}

ipcMain.handle("save-pdf", async (_event, { fileName, base64 }) => {
  const targetPath = await getUniqueSavePath(fileName);
  const buffer = Buffer.from(base64, "base64");
  await fs.writeFile(targetPath, buffer);
  return { ok: true, path: targetPath };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
