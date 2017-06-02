const monet = require('monet')
require('shelljs/global')

function createGitRepositoryAndPushToCleverCloud({app_id, answers}) {
  try {
    let cmd = [
        `cd ${answers.application}; `
      , `git init; `
      , `git add .; `
      , `git commit -m "First 🚀 of ${answers.displayName}"; `
      , `git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/${app_id}.git; `
      , `git push clever master;`
    ].join('');
    let res = exec(cmd)
    if(res.code !== 0) {
      return monet.Either.Left(res.stderr)
    }
    return monet.Either.Right(res.stdout)

  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

function getCleverCloudApplicationConfiguration({answers}) {
  try {
    let conf = require(
      `${process.cwd()}/${answers.application}/.clever.json`
    ).apps[0]

    return monet.Either.Right(conf)
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

module.exports = {createGitRepositoryAndPushToCleverCloud, getCleverCloudApplicationConfiguration}