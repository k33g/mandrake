
module.exports = {
  cmd: function({template, promptsAnswers, db, mandrakeLocation}) {
    console.log("🎩 is reloading the templates")
    return `cp -R ${mandrakeLocation}/templates ./`
  }
}
