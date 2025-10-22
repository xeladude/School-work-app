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
            nodeIntegration:true,
            contextIsolation:false,
            preload:path.join(__dirname,"preload.js" ),
        },
           
        });
    win.loadFile("index.html");
    win.webContents.openDevTools();

}


ipcMain.handle("read-tasks", () => {
    try {
        if (!fs.existsSync(tasksPath)) return [];
        const data = fs.readFileSync(tasksPath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading tasks:", err);
        return[];
    }
});

ipcMain.handle("write-tasks", async (_event,tasks) => {
    try {
        fs.writeFileSync(tasksPath , JSON.stringify(tasks , null , 2), "utf-8");
        return true;
    } catch (err) {
        console.error("Error writing tasks", err);
        return false;
    }
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