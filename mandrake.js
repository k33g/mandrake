#!/usr/bin/env node

"use strict";
require('shelljs/global')

const inquirer = require('inquirer')
const monet = require('monet')
const level = require('level')

const getTemplateConfig = require('./core/templates').getTemplateConfig;
const isItThefirstTime = require('./core/templates').isItThefirstTime;
const buildTemplatesTitlesList = require('./core/templates').buildTemplatesTitlesList;
const getTemplatesTable = require('./core/templates').getTemplatesTable;

const createBrandNewApp = require('./core/applications').createBrandNewApp;
const createAddon = require('./core/addons').createAddon;
const runCmd = require('./core/commands').runCmd;

const logo = require('./core/logo');


isItThefirstTime()

/**
 * Level section
 * see https://github.com/Level/level
 * Level is used to keep some informations in memory
 * eg: to propose the last used organization, ...
 */

let db = level('./mandrakedb')

let templatesChoice = {
  type: 'list',
  pageSize:15,
  name: 'templateTitle',
  message: 'What kind of application do yo want to generate?',
  choices: buildTemplatesTitlesList
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

let applicationName = {
  type: 'input',
  name: 'application',
  message: 'What is your application name (or project directory name)?',
  validate: function(input) {
    return new Promise((resolve, reject) => {
      db.get(`app:${input}`, (err, value) => {
        if (err) { 
          resolve(true) // if the application name doesn't exist in the database, it's fine 🤗
        } else {
          resolve('😡 This application already exists in the database')
        }
      })
    })
  }
}

let addonName = {
  type: 'input',
  name: 'addon',
  message: 'What is your addon name?',
  validate: function(input) {
    return new Promise((resolve, reject) => {
      db.get(`addon:${input}`, (err, value) => {
        if (err) { 
          resolve(true) // if the addon name doesn't exist in the database, it's fine 🤗
        } else {
          resolve('😡 This addon already exists in the database')
        }
      })
    })
  }
}

let displayName = {
  type: 'input',
  name: 'displayName',
  message: 'What is your display name (the display named in the CC Console)?',
  validate: function(input) {
    return new Promise((resolve, reject) => {
      db.get(`displayName:${input}`, (err, value) => {
        if (err) { 
          resolve(true) // if the display name doesn't exist in the database, it's fine 🤗
        } else {
          resolve('😡 This display name already exists in the database')
        }
      })
    })
  }
}

let domainName = {
  type: 'input',
  name: 'domain',
  message: 'What is your domain name (<domain>.cleverapps.io)?',
  validate: function(input) {
    return new Promise((resolve, reject) => {
      db.get(`domain:${input}`, (err, value) => {
        if (err) { 
          resolve(true) // if the domain name doesn't exist in the database, it's fine 🤗
        } else {
          resolve('😡 This domain already exists in the database')
        }
      })
    })
  }
}

inquirer.prompt([
  templatesChoice
]).then((answers) => {

  //let template = answers.template
  // search templane directory name by title 
  let template = getTemplatesTable().find(item => item.title == answers.templateTitle).template
  
  // Do something more functional
  if(template==null) { throw Error("🐞") }

  switch(template.split("-")[0]) {
      case 'app':
        inquirer.prompt([
          regionChoice, organizationName, applicationName, displayName, domainName
        ]).then((answers) => {

          db.put('last_organization', answers.organization, (err) => {})
          db.put('last_app_region', answers.region, (err) => {})

          //let config = require(`${process.cwd()}/templates/${template}/config.js`)

          getTemplateConfig({template: template}).cata(
            err => {
              console.error(`😡 👎`, err)
              throw new Error("😡 Houston? We have a problem [getTemplateConfig when creating application]")
            },
            config => {
              //TODO: ask for GitHub or Brand new application project
              if(config.prompts) { // check if the template has "embedded" questions
                inquirer.prompt(config.prompts(db)).then(promptsAnswers => {
                  // pass promptsAnswers as parameters to use it cmd
                  createBrandNewApp({template, db, answers, promptsAnswers}).cata(
                    err => console.error(`😡 👎`, err),
                    res => {
                      console.info('🎩 ✨ 😀 👍')
                      console.log(res)
                      db.put("app:"+res.application, res, (err) => {})
                      db.put("domain:"+res.domain, true, (err) => {})
                      db.put("displayName:"+res.displayName, true, (err) => {})
                      console.log("👋 Remember, to deploy again: git push clever master")
                    }
                  )
                }) // end of inquirer.prompt
              } else {
                createBrandNewApp({template, db, answers, promptsAnswers: null}).cata(
                  err => console.error(`😡 👎`, err),
                  res => {
                    console.info('🎩 ✨ 😀 👍')
                    console.log(res)
                    db.put("app:"+res.application, res, (err) => {})
                    db.put("domain:"+res.domain, true, (err) => {})
                    db.put("displayName:"+res.displayName, true, (err) => {})
                     console.log("👋 Remember, to deploy again: git push clever master")
                  }
                )
              } // end of if
            } // end of Right(config)
          ) // end of getTemplateConfig cata 

        })
        break;
      case 'addon':
        inquirer.prompt([
          addOnRegionChoice, organizationName, addonName
        ]).then((answers) => {

          db.put('last_organization', answers.organization, (err) => {})
          db.put('last_addon_region', answers.region, (err) => {})

          createAddon({template, db, answers}).cata(
            err => console.error(`😡 👎`, err),
            res => {
              console.info('🎩 ✨ 😀 👍')
              console.log(res)
              db.put("addon:"+res.addon, res, (err) => {})
            }
          )
        })
        break;
      case 'cmd':
          //let config = require(`${process.cwd()}/templates/${template}/config.js`)

          getTemplateConfig({template: template}).cata(
            err => {
              console.error(`->😡 👎`, err)
              throw new Error("😡 Houston? We have a problem [getTemplateConfig when running command]")
            },
            config => {

              if(config.prompts) { // check if the template has "embedded" questions
                inquirer.prompt(config.prompts(db)).then(promptsAnswers => {
                  runCmd({template, db, promptsAnswers}).cata(
                    err => console.error(`😡 👎`, err),
                    res => {
                      console.info('🎩 ✨ 😀 👍')
                      console.log(res)
                    }
                  )
                })
              } else {
                runCmd({template, db, promptsAnswers: null}).cata(
                  err => console.error(`😡 👎`, err),
                  res => {
                    console.info('🎩 ✨ 😀 👍')
                    console.log(res)
                  }
                )
              } // end of if

            } // end of Right(config)
          ) // end of getTemplateConfig cata 

        break;
      default:
        //TODO
  }

}) // end of inquirer.prompt

