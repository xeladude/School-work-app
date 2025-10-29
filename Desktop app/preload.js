// expose electrons ipc ststem to the Front 

// after update app.js to replace manual import export with saving
const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("electronAPI",{
    readTasks: () => ipcRenderer.invoke("read-tasks"),
    saveTasks: (tasks) => ipcRenderer.invoke("save-tasks", tasks),
});