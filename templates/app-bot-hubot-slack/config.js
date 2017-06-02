// very simple Vert-x web appplication to use a discoverable microservice written in Scala
module.exports = {
  title: "Hubot for Slack on Clever Cloud",
  prompts: function(db) {
    let slackToken = {
      type: 'input',
      name: 'slackToken',
      message: 'What is your Slack token?'
    }

    return [slackToken]
  },
  cmd: function({
    template, application, displayName, domain, organization, region, promptsAnswers
  }) {

    let slackToken = promptsAnswers.slackToken

    return [
        `mkdir ${application}; `
      , `cp -R ./templates/${template}/bot-skeleton/* ./${application}; `
      , `cd ${application}; `
      , `clever create -t node "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `clever env set PORT 8080 --alias "${displayName}"; `
      , `clever env set EXPRESS_PORT 8080 --alias "${displayName}"; `
      , `clever env set HUBOT_SLACK_TOKEN ${slackToken} --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor S --alias "${displayName}"; `
    ].join('');

  }
}
