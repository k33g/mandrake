const monet = require('monet')
const getDirectories = require('./fsTools').getDirectories;
const inquirer = require('inquirer')

require('shelljs/global')

function initializeTemplates() {
  try {
    let res = exec(`cp -R ${__dirname}/../templates ./templates`)
    if(res.code !== 0) {
      return monet.Either.Left("😡 Error when copying templates")
    }
    return monet.Either.Right(res.code)
  } catch(err) {
    return monet.Either.Left(err.message)
  }
}

// for the local template
function getTemplateConfig({template}) {
  try {
    let config = require(`${process.cwd()}/templates/${template}/config.js`)
    return monet.Either.Right(config)
  } catch (error) {
    return monet.Either.Left(err.message)
  }
}


function getReadableTitlesList({templatesList}) {
  let titlesTemplatesList = []
  let templatesTable = []

  templatesList.forEach( template => { // template is the name of the directory of the template eg: app-bot-hubot-slack

    if(template.startsWith("---[")) {
      titlesTemplatesList.push(new inquirer.Separator(template))
    } else {
      getTemplateConfig({template}).cata(
        err => { 
          throw new Error("😡 Houston? We have a problem [getReadableTitlesList]")
        },
        config => {
          titlesTemplatesList.push(config.title)
          templatesTable.push({title: config.title, template: template})
        }
      )
    }

  }) // end for each
  // should return something more functional...
  return {titlesTemplatesList, templatesTable} // return titles and a table of templates
}

function isItThefirstTime() {
  getDirectories({srcpath: './templates'}).cata(
    err => {
      console.log("🎩 There is no template in you project")
      console.log("🎩 Copying the templates ...")
      initializeTemplates().cata(
        err => {
          throw new Error("😡 Houston? We have a problem [initializing the templates list]")
        },
        code => {
          console.log("🎩 ✨ Templates list generated❗️\n")
        }
      )
    },
    res => {
      // all is all right
    }
  )
}

function buildTemplatesTitlesList() {
  return getDirectories({srcpath: './templates'}).cata(
    err => {
      throw new Error("😡 Houston? We have a problem [buildTemplatesTitlesList]")
    },
    templatesList => {
      // prettify the list adding separator
      let newTemplatesList = [].concat(
          "---[ADDONS]---------"
        , templatesList.filter(item => item.startsWith("addon-"))
        , "---[APPLICATIONS]---"
        , templatesList.filter(item => item.startsWith("app-"))
        , "---[COMMANDS]-------"
        , templatesList.filter(item => item.startsWith("cmd-"))
      )
      return getReadableTitlesList({templatesList: newTemplatesList}).titlesTemplatesList
    }
  )
}

function getTemplatesTable() {
  return getDirectories({srcpath: './templates'}).cata(
    err => {
      throw new Error("😡 Houston? We have a problem [getTemplatesTable]")
    },
    templatesList => {
      return getReadableTitlesList({templatesList}).templatesTable
    }
  )
}

module.exports = {
    initializeTemplates
  , getTemplateConfig
  , getReadableTitlesList
  , isItThefirstTime
  , buildTemplatesTitlesList
  , getTemplatesTable
}