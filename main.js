'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const iconPath = 'resources/app.ico';

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		title: 'Subtitle downloader',
		width: 1000,
		height: 500,
		icon: iconPath,
		frame: false
	});

	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
