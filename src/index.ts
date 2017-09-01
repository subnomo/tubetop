import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const appPath = app.getAppPath();

app.on('ready', () => {
    let win = new BrowserWindow({ width: 800, height: 600 });

    win.loadURL(path.join(appPath, 'dist/index.html'));
});

app.on('window-all-closed', app.quit);
