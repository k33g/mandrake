const monet = require('monet')
require('shelljs/global')

const createGitRepositoryAndPushToCleverCloud = require('./clever').createGitRepositoryAndPushToCleverCloud;
const getCleverCloudApplicationConfiguration = require('./clever').getCleverCloudApplicationConfiguration;

// execute a set of commands from config.js file
// to create a Clever Cloud Application
// uses by the `app-...` templates
function createBrandNewApp ({template, db, answers, promptsAnswers}) {
  try {
    // call the template commands
    let cmd = require(`${process.cwd()}/templates/${template}/config.js`)
                .cmd({
                    template: template
                  , application: answers.application
                  , displayName: answers.displayName
                  , domain: answers.domain
                  , organization: answers.organization
                  , region: answers.region
                  , promptsAnswers: promptsAnswers
                  , db: db
                  , mandrakeLocation: __dirname
                })

    let res = exec(cmd)

    if(res.code !== 0) { return monet.Either.Left(res.stderr) }
    // creation on Clever Cloud is OK
    // so, get the generated configuration file
    // create a git repository
    // push to Clever-Cloud
    //console.info(res.stdout)

    return getCleverCloudApplicationConfiguration({answers}).cata(
      err => monet.Either.Left(err),
      conf => {
        console.log("🎩 Application configuration: ", conf)
        let app_id = conf.app_id // Clever application Id
        console.log("🎩 Your Clever Application id is: ", app_id)
        console.log("🎩 Creating a git repository, then push to 💭 ☁️ ...")

        return createGitRepositoryAndPushToCleverCloud({app_id, answers}).cata(
          err => monet.Either.Left(err),
          res => monet.Either.Right(Object.assign({app_id, template}, answers))
        ) // createGitRepositoryAndPushToCleverCloud
      }
    ) // getCleverCloudApplicationConfiguration
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

module.exports = {createBrandNewApp}