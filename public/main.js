const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const isDev = require('electron-is-dev');

let win;
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //load the index.html from a url
  win.loadURL(
    isDev ? "http://localhost:3000" : `file://${__dirname}/../build/index.html`
  );
  // win.loadURL(`file://${__dirname}/../build/index.html` );

  // Open the DevTools.
  // win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("click:num", (event, obj) => {
  // console.log(obj);
  const { value, calc } = obj;
  calc.num =
    calc.num === 0 && value === "0"
      ? "0"
      : calc.num % 1 === 0
      ? Number(calc.num + value)
      : calc.num + value;
  calc.result = !calc.sign ? 0 : calc.result;

  win.webContents.send("num:clicked", obj);
  // console.log(obj);
});

ipcMain.on("click:decimal", (event, obj) => {
  const { value, calc } = obj;
  calc.num = !calc.num.toString().includes(".") ? calc.num + value : calc.num; //to avoid multiple decimal point
  win.webContents.send("decimal:clicked", obj);
});

ipcMain.on("click:operator", (event, obj) => {
  const { value, calc } = obj;
  calc.result = !calc.result && calc.num ? calc.num : calc.result;
  calc.sign = value;
  calc.num = 0;
  win.webContents.send("operator:clicked", obj);
});

ipcMain.on("click:equals", (event, calc) => {
  // Function to perform calculation
  const calculateFunction = (a, b, operator) => {
    return operator === "+"
      ? a + b
      : operator === "-"
      ? a - b
      : operator === "/"
      ? a / b
      : a * b;
  };

  calc.result =
    calc.num === "0" && calc.sign === "/"
      ? "can't divide with 0"
      : calculateFunction(Number(calc.result), Number(calc.num), calc.sign);
  calc.num = 0;
  calc.sign = "";

  win.webContents.send("equals:clicked", calc);
});

ipcMain.on("click:percent", (event, calc) => {
  let num = calc.num ? parseFloat(calc.num) : 0;
  let result = calc.result ? parseFloat(calc.result) : 0;
  calc.num = num /= Math.pow(100, 1);
  calc.result = result /= Math.pow(100, 1);

  win.webContents.send("percent:clicked", calc);
});

ipcMain.on("click:invert", (event, calc) => {
  calc.num = calc.num ? calc.num * -1 : 0;
  calc.result = calc.result ? calc.result * -1 : 0;
  calc.sign = "";
  win.webContents.send("invert:clicked", calc);
});

ipcMain.on("click:reset", (event, calc) => {
  calc.num = 0;
  calc.result = 0;
  calc.sign = "";
  win.webContents.send("reset:clicked", calc);
});
