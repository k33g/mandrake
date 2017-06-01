// very simple Vert-x microservice written in Scala
module.exports = {
  title: "Simple Vert-x microservice written in Scala",
  cmd: function({
    template, application, displayName, domain, organization, region
  }) {
    return [
        `./templates/${template}/newscalamsvertx.sh ${application}; `
      , `cd ${application}; `
      , `clever create -t sbt "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `clever env set PORT 8080 --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor M --alias "${displayName}"; `
      , `clever deploy --alias "${displayName}"; `
    ].join('');
  }
}
