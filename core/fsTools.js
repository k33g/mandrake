
const fs = require('fs')
const monet = require('monet')
const path = require('path')


function getDirectories ({srcpath}) {
  try {
    let directoryList = fs.readdirSync(srcpath)
      .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
    return monet.Either.Right(directoryList)
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

module.exports = {getDirectories}