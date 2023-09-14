import { rename } from 'node:fs'
import path from 'node:path'

rename(
  path.join(__dirname, './../build/chrome-mv3-prod.zip'),
  path.join(__dirname, './../build/chrome-extension-lanhu.zip'),
  (err) => {
  if (err) {
    throw err
  }

  console.log('zip file successfully renamed~')
})
