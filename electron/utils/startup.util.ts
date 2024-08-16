export function toggleStartUp(app: Electron.App, value: boolean) {
  try {
    app?.setLoginItemSettings({
      openAtLogin: value,
      path: app.getPath('exe'),
    })
  } catch {}
}
