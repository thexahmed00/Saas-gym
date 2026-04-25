const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { connectScanner, triggerScan, disconnectScanner, getDeviceUsers } = require('./scanner')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  // Connect to ZKTeco on startup; push every scan event to renderer.
  connectScanner((result) => {
    if (mainWindow) mainWindow.webContents.send('scan:result', result)
  })

  ipcMain.handle('scan:start',       () => triggerScan())
  ipcMain.handle('device:get-users', () => getDeviceUsers())

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  disconnectScanner()
  if (process.platform !== 'darwin') app.quit()
})
