const packager = require('electron-packager')
const fs = require('fs')
const archiver = require('archiver')
const path = require('path')

let options = {
  dir: './',
  arch: 'x64',
  asar: true,
  name: 'Dow 30 Grid',
  out: 'build',
  platform: 'linux, win32, darwin',
  appBundleId: 'dow-30-grid',
  win32metadata: {
    FileDescription: 'Dow 30 Grid'
  }
}

process.argv.forEach(arg => {
  switch (arg) {
    case '--mac':
      options.platform = 'darwin'
      break
    case '--win':
      options.platform = 'win32'
      break
    case '--linux':
      options.platform = 'linux'
      break
  }
})

packager(options)
  .then((appPaths) => {
    appPaths.forEach(buildDir => {
      let buildName = buildDir.split(path.sep)[1]
      let output = fs.createWriteStream(`build/${buildName}.zip`)
      let archive = archiver('zip', {
        zlib: { level: 9 }
      })

      console.log(`Packing ${buildName} into a zip...`)

      output.on('close', () => {
        console.log(`Successfully zipped ${buildName}`)
      })

      archive.on('warning', (err) => {
        console.warn(err)
      })

      archive.on('error', (err) => {
        throw err
      })

      archive.pipe(output)
      archive.directory(buildDir, false)
      archive.finalize()
    })
  })
