// Auralis desktop shell.
// Boots the bundled Garmin backend in-process, then opens a native window
// pointing at the local server — so the whole app runs offline-capable as a
// real desktop application, no browser involved.
const { app, BrowserWindow, shell } = require('electron')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

const PORT = process.env.PORT || '8787'
process.env.PORT = PORT
// Dev (Vite HMR) only when explicitly requested; otherwise the bundled
// backend serves the built UI on a single local origin.
const isDev = process.env.ELECTRON_DEV === '1'
const UI_URL = isDev ? 'http://localhost:5173' : `http://localhost:${PORT}`

let win

async function startBackend() {
  // The backend is an ESM module that auto-listens on import.
  const entry = pathToFileURL(path.join(__dirname, '..', 'server', 'index.mjs')).href
  try {
    await import(entry)
  } catch (e) {
    console.error('Backend non avviato:', e)
  }
}

async function loadWithRetry(target, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      await win.loadURL(target)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 400))
    }
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1240,
    height: 840,
    minWidth: 380,
    minHeight: 640,
    backgroundColor: '#06080f',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 18, y: 22 },
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.once('ready-to-show', () => win.show())

  // Open external links in the system browser, keep app links in-app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost')) return { action: 'allow' }
    shell.openExternal(url)
    return { action: 'deny' }
  })

  loadWithRetry(UI_URL)
}

app.whenReady().then(async () => {
  await startBackend()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
