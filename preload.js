const electron = require('electron');
const fs = require('fs');
const path = require('path');

electron.contextBridge.exposeInMainWorld(
  'addressbook',
  {
    fs: fs,
    path: path
  }
)