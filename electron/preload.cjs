// Minimal, secure preload. The renderer is a standard web app talking to the
// local backend over HTTP, so we only expose a tiny, safe surface.
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('auralis', {
  desktop: true,
  platform: process.platform,
})
