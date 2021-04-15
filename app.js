const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')
var express = require("express")
const request = require('request');
var wapp = express();
var wserver
var win
var authToken

var callbackUri = "http://localhost:12971/callback"
var idmsaUri = "https://idmsa.idledev.org"
var idmsaId = "BMHpIDSRBGSxRhfA1cCAfKQEnksQRvl71Gn3x7g4"
var idmsaSecret = "0M4frXRRaiMyVEu0Wcmwp8hnyEzt0xF1I67ZPnsb"

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

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.on('init',function(e,a){

    if(authToken === undefined){
        initWASession()
        var _flagCheck = setInterval(function() {
            if (authToken !== undefined) {
                clearInterval(_flagCheck);
                win.webContents.send('auth',authToken)
            }
        }, 100);
    } else {
        win.webContents.send('auth',authToken)
    }

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function initWebAuth() {

    wapp.get("/callback", (req, res) => {
        res.send("Authorisation complete, you may safely return back to the app.")
        request.post({
            url: idmsaUri+"/oauth/token",
            form: {
              grant_type: 'authorization_code',
              code: req.query.code,
              client_id: idmsaId,
              client_secret: idmsaSecret,
              redirect_uri: callbackUri
            }
        }, function (err, httpResponse, body) { 
            authToken = JSON.parse(body).access_token
         })
        wserver.close()
    })

    wserver = wapp.listen(12971)
}

async function initWASession(){

    await initWebAuth();

    shell.openExternal(`${idmsaUri}/oauth/authorize?client_id=${idmsaId}&redirect_uri=${encodeURIComponent(callbackUri)}&response_type=code`)

}