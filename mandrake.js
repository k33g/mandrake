#!/usr/bin/env node

"use strict";
require('shelljs/global')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const monet = require('monet')
const level = require('level')


function getDirectories (srcpath) {
  try {
    let directoryList = fs.readdirSync(srcpath)
      .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
    return monet.Either.Right(directoryList)
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

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

function createAddon (template, answers) {
  // call the template commands
  try {
    let cmd = require(`./templates/${template}/config.js`)
                .cmd(
                    answers.addon
                  , answers.organization
                  , answers.region
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

function createGitRepositoryAndPushToCleverCloud(app_id, answers) {
  try {
    let cmd = [
        `cd ${answers.application}; `
      , `git add .; `
      , `git commit -m "First 🚀 of ${answers.service}"; `
      , `git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/${app_id}.git; `
      , `git push clever master`
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

function getCleverCloudApplicationConfiguration(answers) {
  try {
    let conf = require(
      `${process.cwd()}/${answers.application}/.clever.json`
    ).apps[0]
    return monet.Either.Right(conf)
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

function createRawScaler (template, answers) {
  try {
    // call the template commands
    let cmd = require(`./templates/${template}/config.js`)
                .cmd(
                    template
                  , answers.application
                  , answers.service
                  , answers.domain
                  , answers.organization
                  , answers.region
                )

    let res = exec(cmd)

    if(res.code !== 0) { return monet.Either.Left(res.stderr) }
    // creation on Clever Cloud is OK
    // so, get the generated configuration file
    // create a git repository
    // push to Clever-Cloud
    console.info(res.stdout)
    return getCleverCloudApplicationConfiguration(answers).cata(
      err => monet.Either.Left(err),
      conf => {
        console.log("🎩 Application configuration: ", conf)
        let app_id = conf.app_id // Clever application Id
        console.log("🎩 Your Clever Application id is: ", app_id)
        console.log("🎩 Creating a git repository, then push to 💭 ☁️ ...")

        return createGitRepositoryAndPushToCleverCloud(app_id, answers).cata(
          err => monet.Either.Left(err),
          res => monet.Either.Right(Object.assign({app_id, template}, answers))
        ) // createGitRepositoryAndPushToCleverCloud
      }
    ) // getCleverCloudApplicationConfiguration
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

/**
 * Display some ASCII Art at startup
 */

let startUpMessage = `                                
 _____           _         _       
|     |___ ___ _| |___ ___| |_ ___ 
| | | | .'|   | . |  _| .'| '_| -_|
|_|_|_|__,|_|_|___|_| |__,|_,_|___|`;

console.log(startUpMessage)
console.log('\n🎩 by @k33g_org for Clever-Cloud\n')

/**
 * Level section
 * see https://github.com/Level/level
 */

let db = level('./mandrakedb')

let templatesList = getDirectories('./templates').cata(
  err => {
    console.log("🎩 There is no template in you project")
    console.log("🎩 Copying the templates ...")

    return initializeTemplates().cata(
      err => {
        throw new Error("😡 Houston? We have a problem [initializing the templates list]")
      },
      code => {
        return getDirectories(`${__dirname}/templates`).cata(
          err => { throw new Error("😡 Houston? We have a problem [getting the default templates list]") },
          templatesList => {
            console.log("🎩 ✨ Templates list generated❗️")
            return templatesList
          }
        )
      }
    )
  },
  templatesList => {
    return templatesList
  }
)

let templatesChoice = {
  type: 'list',
  name: 'template',
  message: 'What kind of application do yo want to generate?',
  choices: templatesList
}

let regionChoice = {
  type: 'list',
  name: 'region',
  message: 'Where do you want to deploy your application?',
  choices: ['par', 'mtl'],
  default: function() {
    return new Promise((resolve, reject) => {
        db.get('last_app_region', (err, value) => {
          //if (err) reject('???')
          resolve(value)
        })
    })
  }
}

let addOnRegionChoice = {
  type: 'list',
  name: 'region',
  message: 'Where do you want to deploy your addon?',
  choices: ['eu', 'us'],
  default: function() {
    return new Promise((resolve, reject) => {
        db.get('last_addon_region', (err, value) => {
          //if (err) reject('???')
          resolve(value)
        })
    })
  }
}

let organizationName = {
  type: 'input',
  name: 'organization',
  message: 'What is your organization name?',
  default: function() {
    return new Promise((resolve, reject) => {
        db.get('last_organization', (err, value) => {
          //if (err) reject('???')
          resolve(value)
        })
    })
  }
}

//TO CHECK IN DB
let applicationName = {
  type: 'input',
  name: 'application',
  message: 'What is your application name (or project directory name)?',
}

//TO CHECK IN DB
let addonName = {
  type: 'input',
  name: 'addon',
  message: 'What is your addon name ?',
}

//TO CHECK IN DB
let serviceName = {
  type: 'input',
  name: 'service',
  message: 'What is your service name (the display named in the CC Console)?',
}

//TO CHECK IN DB
let domainName = {
  type: 'input',
  name: 'domain',
  message: 'What is your domain name (<domain>.cleverapps.io)?',
}

inquirer.prompt([
  templatesChoice
]).then((answers) => {

  let template = answers.template

  switch(template.split("-")[0]) {
      case 'app':
        inquirer.prompt([
          regionChoice, organizationName, applicationName, serviceName, domainName
        ]).then((answers) => {

          db.put('last_organization', answers.organization, (err) => {})
          db.put('last_app_region', answers.region, (err) => {})

          createRawScaler(template, answers).cata(
            err => console.error(`😡 👎`, err),
            res => {
              console.info('🎩 ✨ 😀 👍')
              console.log(res)
              db.put("app:"+res.application, res, (err) => {})
              db.put("domain:"+res.domain, true, (err) => {})
              db.put("service:"+res.service, true, (err) => {})
            }
          )
        })
        break;
      case 'addon':
        inquirer.prompt([
          addOnRegionChoice, organizationName, addonName
        ]).then((answers) => {

          db.put('last_organization', answers.organization, (err) => {})
          db.put('last_addon_region', answers.region, (err) => {})


          createAddon(template, answers).cata(
            err => console.error(`😡 👎`, err),
            res => {
              console.info('🎩 ✨ 😀 👍')
              console.log(res)
              db.put("addon:"+res.addon, res, (err) => {})
            }
          )
        })
        break;
      default:
        //TODO
  }

}) // end of inquirer.prompt

// $ clever addon create postgresql-addon my-addon-pg --plan dev --region mtl
// clever addon create redis-addon redis000 --plan s
// clever service link-addon redis000 --alias 🐱-micro-service-005
// à faire sur une organisation
