const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  startScan:      () => ipcRenderer.invoke('scan:start'),
  getDeviceUsers: () => ipcRenderer.invoke('device:get-users'),
  onScanResult: (cb) => {
    const listener = (_event, result) => cb(result)
    ipcRenderer.on('scan:result', listener)
    return () => ipcRenderer.removeListener('scan:result', listener)
  },
})
