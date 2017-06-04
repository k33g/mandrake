// very simple Vert-x web appplication to use a discoverable microservice written in Scala
module.exports = {
  title: "Java Vert.x web application - (Small)",
  cmd: function({
    template, application, displayName, domain, organization, region, promptsAnswers
  }) {

    return [
        `mkdir ${application}; `
      , `cp -R ./templates/${template}/webapp-skeleton/* ./${application}; `
      , `cd ${application}; `
      , `clever create -t maven "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `clever env set PORT 8080 --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor S --alias "${displayName}"; `
    ].join('');

  }
}
