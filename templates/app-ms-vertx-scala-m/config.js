module.exports = {
  cmd: function(template_name, app_name, display_name, domain_name, organization, region) {
    return [
        `./templates/${template_name}/newscalamsvertx.sh ${app_name}; `
      , `cd ${app_name}; `
      , `clever create -t sbt "${display_name}" --org ${organization} --region ${region} --alias "${display_name}"; `
      , `clever env set PORT 8080 --alias "${display_name}"; `
      , `clever domain add ${domain_name}.cleverapps.io --alias "${display_name}"; `
      , `clever scale --flavor M --alias "${display_name}"; `
      , `clever deploy --alias "${display_name}"; `
    ].join('');
  }
}
