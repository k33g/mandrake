module.exports = {
  cmd: function(template_name, app_name, service_name, domain_name, organization, region) {
    return [
        `./templates/${template_name}/newscalamsvertx.sh ${app_name}; `
      , `cd ${app_name}; `
      , `clever create -t sbt "${service_name}" --org ${organization} --region ${region} --alias "${service_name}"; `
      , `clever env set PORT 8080 --alias "${service_name}"; `
      , `clever domain add ${domain_name}.cleverapps.io --alias "${service_name}"; `
      , `clever deploy --alias "${service_name}"; `
      //, `clever service link-addon redis000`
    ].join('');
  }
}
