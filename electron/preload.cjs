const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dailyNoteDesktop", {
  savePdf: async ({ fileName, base64 }) => ipcRenderer.invoke("save-pdf", { fileName, base64 }),
});
