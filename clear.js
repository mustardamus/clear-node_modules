const { join } = require('path')
const { readdirSync, statSync, existsSync } = require('fs')
const { inspect } = require('util')
const { rm } = require('shelljs')

const deleteIfOlderThan = 21 // days
const codeDir = join(__dirname, '..')
const now = new Date()

readdirSync(codeDir)
  .filter(dir => dir.charAt(0) !== '.')
  .forEach(dir => {
    const pckPath = join(codeDir, dir, 'package.json')

    if (existsSync(pckPath)) {
      const stats = statSync(pckPath)
      const mtime = new Date(inspect(stats.mtime))
      const daysSince = (now.getTime() - mtime.getTime()) / 1000 / 60 / 60 / 24

      if (Math.floor(daysSince) > deleteIfOlderThan) {
        const nmPath = join(codeDir, dir, 'node_modules')

        if (existsSync(nmPath)) {
          rm('-rf', nmPath)
          console.log('Removed:', nmPath)
        }
      }
    }
  })
