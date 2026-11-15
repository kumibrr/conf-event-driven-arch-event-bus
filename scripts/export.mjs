import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-chromium'

// Use the bundled full Chromium; the headless-shell renderer can stall on macOS.
const cli = fileURLToPath(import.meta.resolve('@slidev/cli/bin/slidev.mjs'))
const result = spawnSync(process.execPath, [
  cli, 'export', '--dark',
  '--executable-path', chromium.executablePath(),
  ...process.argv.slice(2),
], { stdio: 'inherit' })

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}
process.exit(result.status ?? 1)
