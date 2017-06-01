
module.exports = {
  title: "Mandrake cmd: reload templates",
  cmd: function({template, promptsAnswers, db, mandrakeLocation}) {
    console.log("🎩 is reloading the templates")
    return `cp -R ${mandrakeLocation}/../templates ./`
  }
}
