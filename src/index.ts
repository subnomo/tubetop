import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} = require('electron-devtools-installer');

let win: Electron.BrowserWindow;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });

    // Install dev extensions
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
        .then((name: any) => console.log(`Added Extensions: ${name.join(', ')}`))
        .catch((err: any) => console.log('An error occurred: ', err));

    // Load index.html
    const appPath = app.getAppPath();
    win.loadURL(path.join(appPath, 'dist/index.html'));

    // Open dev tools
    win.webContents.openDevTools();

    // Dereference win on close
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
