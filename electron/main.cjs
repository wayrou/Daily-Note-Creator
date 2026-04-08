const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");

const isMac = process.platform === "darwin";
let lastSaveDirectory = null;

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
    title: "Save Daily Note PDF",
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
