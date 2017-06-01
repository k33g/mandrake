const monet = require('monet')
require('shelljs/global')

function initializeTemplates() {
  try {
    let res = exec(`cp -R ${__dirname}/templates ./templates`)
    if(res.code !== 0) {
      return monet.Either.Left("😡 Error when copying templates")
    }
    return monet.Either.Right(res.code)
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

module.exports = {initializeTemplates}