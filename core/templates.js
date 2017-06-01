const monet = require('monet')
const getDirectories = require('./fsTools').getDirectories;

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

  templatesList.forEach( template => {
    getTemplateConfig({template}).cata(
      err => { 
        // foo...
      },
      config => {
        titlesTemplatesList.push(config.title)
        templatesTable.push({title: config.title, template: template})
      }
    )
  })
  return {titlesTemplatesList, templatesTable} // return titles and a table of templates
}

function isItThefistTime() {
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
      // foo
    },
    templatesList => {
      return getReadableTitlesList({templatesList}).titlesTemplatesList
    }
  )
}

function getTemplatesTable() {
  return getDirectories({srcpath: './templates'}).cata(
    err => {
      // foo
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
  , isItThefistTime
  , buildTemplatesTitlesList
  , getTemplatesTable
}