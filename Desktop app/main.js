const {app,BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const Store = require("electron-store").default;

const store = new Store();

function createWindow(){
    const win = new BrowserWindow({
        width:1000,
        hight:700,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            preload:path.join(__dirname,"preload.js" ),
        },
           
        });
    win.loadFile("index.html");
    win.webContents.openDevTools();

}


ipcMain.handle("get-tasks",()=>{
    return store.get('tasks') || [];
});

ipcMain.handle("save-tasks",(event,tasks)=>{
    store.set('tasks', tasks);
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