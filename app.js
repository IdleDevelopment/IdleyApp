const { app, BrowserWindow } = require('electron')
const path = require('path')
const expressServer = require("./express")
var win

function createWindow () {
    if(process.platform === 'darwin'){
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
            titleBarStyle: 'hidden'
        })
    } else {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false
            }
        })
    }

    win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  expressServer.init();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})