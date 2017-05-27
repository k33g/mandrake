
module.exports = {
  cmd: function(template_name, app_name, service_name, domain_name, organization, region) {
    return [
        `./templates/${template_name}/newexpress.sh ${app_name}; `
      , `cd ${app_name}; `
      , `git init; `
      , `ls; `
      , `pwd; `
      , `clever create -t node "${service_name}" --org ${organization} --region ${region} --alias "${service_name}"; `
      , `clever env set PORT 8080 --alias "${service_name}"; `
      , `clever domain add ${domain_name}.cleverapps.io --alias "${service_name}"; `
      , `clever deploy --alias "${service_name}"; `
    ].join('');
  }
}
