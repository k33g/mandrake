// https://github.com/sdelements/lets-chat
module.exports = {
  title: `🐱 Lets Chat: chat app for small teams [git clone]`,
  prompts: function(db) {
    let mongDbAddOnNameInput = {
      type: 'input',
      name: 'mongDbAddOnName',
      message: 'What is the name of mongDb addon?'
    }
    return [mongDbAddOnNameInput]
  },
  cmd: function({
    template, application, displayName, domain, organization, region, promptsAnswers
  }) {
    let mongodb_addon_name = promptsAnswers.mongDbAddOnName

    return [
        `echo "It could be long... Please be patient ⏳"; `
      , `git clone https://github.com/sdelements/lets-chat.git ${application}; `
      , `cd ${application}; `
      , `clever create -t node "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `echo "LCB_HTTP_PORT=8080\nLCB_DATABASE_URI=null\nPORT=8080" | clever env import --alias "${displayName}"; `
      , `clever service link-addon ${mongodb_addon_name} --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor M --alias "${displayName}"; `
    ].join('');

  },
  afterCreate: function({template, application, displayName, domain, organization, region, envvars}) {
    // after create application on Clever Cloud 
    return [
        `cd ${application}; `
      , `clever env set LCB_DATABASE_URI ${envvars.find(item => item.name === "MONGODB_ADDON_URI").value} --alias "${displayName}"; `
    ].join('');
  },
  afterPush: function({template, application, displayName, domain, organization, region, envvars}) {
    // after pushing code to Clever Cloud 
    return [
        `echo "Have fun 😃"; `
    ].join('');
  }
}
