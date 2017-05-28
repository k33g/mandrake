// very simple Express web application
module.exports = {
  cmd: function({
    template, application, displayName, domain, organization, region
    }) {
    return [
        `./templates/${template}/newexpress.sh ${application}; `
      , `cd ${application}; `
      , `ls; `
      , `pwd; `
      , `clever create -t node "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `clever env set PORT 8080 --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor pico --alias "${displayName}"; `
      , `clever deploy --alias "${displayName}"; `
    ].join('');
  }
}
