const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const Store = require("electron-store").default;
const store = new Store();

const fs = require("fs");
const tasksPath = path.join(__dirname , "tasks.json");

function createWindow(){
    const win = new BrowserWindow({
        width:1000,
        hight:700,
        webPreferences:{
            preload:path.join(__dirname,"preload.js" ),
            contextIsolation:true,
            nodeIsolation:false,
            sandbox : false,
        },
           
        });
    win.loadFile("index.html");
    win.webContents.openDevTools();

}


ipcMain.handle("read-tasks", () => {
    return store.get("tasks", []);
});

ipcMain.handle("save-tasks", (_event,tasks) => {
    store.set("tasks", tasks);
    return true;
});

app.whenReady().then(createWindow);





// app.whenReady().then(()=>{
//     createWindow;


//     app.on("activate", function (){
//         if (BrowserWindow.getAllWindows().length === 0) createWindow();
//     });
// });


app.on("window-all-closed", ()=>{
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
});