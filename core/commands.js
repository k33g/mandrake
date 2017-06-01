const monet = require('monet')
require('shelljs/global')

// execute a simple set of commands from config.js file
// not used to create an application
// eg: used with the `cmd-...` templates
function runCmd ({template, db, promptsAnswers}) {
  try {
    // call the template commands
    let cmd = require(`${process.cwd()}/templates/${template}/config.js`)
                .cmd({
                    template: template
                  , promptsAnswers: promptsAnswers
                  , db: db
                  , mandrakeLocation: __dirname
                })

    let res = exec(cmd)

    if(res.code !== 0) { return monet.Either.Left(res.stderr) }
    return monet.Either.Right(res.stdout)
  } catch (error) {
    return monet.Either.Left(error.message)
  }
}

module.exports = {runCmd}