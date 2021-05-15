const { app, BrowserWindow } = require("electron");
const { url } = require("url");
const path = require("path");

let win;

function createWindow() {
    //TODO: Chech why logo is not reflected
    // Create the browser window.
    win = new BrowserWindow({
        width: 600,
        height: 800,
        icon: `file://${__dirname}/dist/assets/logo.png`,
        webPreferences: {
            preload: path.resolve(__dirname, "preload.js")
        }
    });

    // Load the application url
    win.loadURL(`file://${__dirname}/dist/index.html`);

    // Event when the window is closed.
    win.on('closed', function() {
        win = null;
    });
    
    // win.webContents.openDevTools();
}

// Create window on electron initialization
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function() {
    // Quit when all windows are closed, except on macOS.
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if(win === null) {
        createWindow();
    }
});


