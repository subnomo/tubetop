import { app, BrowserWindow } from 'electron';

const debug = process.env.NODE_ENV === 'development';
let installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS;

if (debug) {
  let {
    default: install,
    REACT_DEVELOPER_TOOLS: rdt,
    REDUX_DEVTOOLS: rd,
  } = require('electron-devtools-installer');

  installExtension = install;
  REACT_DEVELOPER_TOOLS = rdt;
  REDUX_DEVTOOLS = rd;
}

let win: Electron.BrowserWindow = null;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  // Install dev extensions
  if (debug) {
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
      .then((name: string[]) => console.log(`Added Extensions: ${name.join(', ')}`))
      .catch((err: any) => console.log('An error occurred: ', err));
  }

  // Load index.html
  const appPath = app.getAppPath();
  win.loadURL(`file://${appPath}/dist/index.html`);

  // Open dev tools
  if (debug) win.webContents.openDevTools();

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
