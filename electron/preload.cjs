const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dailyNoteDesktop", {
  savePdf: async ({ fileName, base64 }) => ipcRenderer.invoke("save-pdf", { fileName, base64 }),
  savePdfSilently: async ({ fileName, base64, directory }) => ipcRenderer.invoke("save-pdf-silent", { fileName, base64, directory }),
  pickExportDirectory: async ({ folderName }) => ipcRenderer.invoke("pick-export-directory", { folderName }),
  startMobileSession: async () => ipcRenderer.invoke("mobile-session-start"),
  stopMobileSession: async () => ipcRenderer.invoke("mobile-session-stop"),
  getMobileSessionStatus: async () => ipcRenderer.invoke("mobile-session-status"),
  onMobileSubmission: (callback) => {
    if (typeof callback !== "function") {
      return () => {};
    }

    const handler = (_event, payload) => {
      callback(payload);
    };

    ipcRenderer.on("mobile-session-submission", handler);
    return () => ipcRenderer.removeListener("mobile-session-submission", handler);
  },
});
