module.exports = {
  title: "Spirit web app",
  cmd: function({
    template, application, displayName, domain, organization, region, promptsAnswers
  }) {

    return [
        `mkdir ${application}; `
      , `cp -R ./templates/${template}/spirit-skeleton/* ./${application}; `
      , `cd ${application}; `
      , `clever create -t node "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `clever env set PORT 8080 --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor S --alias "${displayName}"; `
    ].join('');

  }
}
