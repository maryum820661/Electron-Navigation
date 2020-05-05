const electron = require("electron");
const webContents=require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const BrowserView=electron.BrowserView;
const {session} = require('electron');
const path = require('path')


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.allowRendererProcessReuse = true;
// create the browser window.
function createWindow() {
  browserWindow = new BrowserWindow({ 
    width:1300,
    height:800,
  //fullscreen:true,
  center:true,
  backgroundColor: "#fff",
 });
    //browserWindow.loadURL("https://google.com");
   
   let browserView1 = new BrowserView({webPreferences: {
  nodeIntegration:true,
  webviewTag:true,
}});
    let browserView2 = new BrowserView({webPreferences: {
  nodeIntegration:true,
  webviewTag:true,
}});
    browserWindow.addBrowserView(browserView1);
    browserWindow.addBrowserView(browserView2);
    browserView1.setBounds({ x: 0, y: 30, width: 650, height: 600 });
    browserView2.setBounds({ x: 650, y: 30, width: 650, height: 600});
    browserView1.webContents.loadFile('index.html');
    browserView2.webContents.loadFile('index.html');
}
app.on('ready', createWindow);
//security measures applied.
//1.Handling session permission request from Remote Content.
app.on('ready',()=>{
  session
    .fromPartition('some-partition')
    .setPermissionRequestHandler((webContents, permission, callback) => {
      const url = webContents.getURL()
  
      if (permission === 'notifications') {
        // Approves the permissions request
        callback(true)
      }
  
      // Verify URL
      if (!url.startsWith('https://google.com/')) {
        // Denies the permissions request
        return callback(false)
      }
    })
})
//2.limit the navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (parsedUrl.origin !== 'https://google.com') {
      event.preventDefault()
    }
  })
})
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  data = {
    bounds: browserWindow.getBounds()
  };
  app.quit();
});
