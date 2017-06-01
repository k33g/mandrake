const monet = require('monet')
require('shelljs/global')

// execute a set of commands from config.js file
// to create a Clever Cloud Addon
// uses by the `addon-...` templates
function createAddon ({template, db, answers}) {
  // call the template commands
  try {
    let cmd = require(`${process.cwd()}/templates/${template}/config.js`)
                .cmd(
                    answers.addon
                  , answers.organization
                  , answers.region
                  , db
                  , __dirname
                )
    let res = exec(cmd)
    if(res.code !== 0) {
      return monet.Either.Left(res.stderr)
    }
    //return monet.Either.Right(res.stdout)
    return monet.Either.Right(Object.assign({template}, answers))

  } catch(err) {
    return monet.Either.Left(err.message)
  }

}

module.exports = {createAddon}