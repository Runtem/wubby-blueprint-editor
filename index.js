const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: "wubby-blueprint-editor.png",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  win.maximize()
  win.loadFile('site/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})