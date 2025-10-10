const {app,BrowserWindow} = require("electron");
const path = require("path");


function createWindow(){
    const win = new BrowserWindow({
        width:1000,
        hight:700,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
        },
    
        });
    win.loadFile("index.html");
    win.webContents.openDevTools();

}

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