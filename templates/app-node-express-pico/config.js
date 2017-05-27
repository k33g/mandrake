
module.exports = {
  cmd: function(template_name, app_name, display_name, domain_name, organization, region) {
    return [
        `./templates/${template_name}/newexpress.sh ${app_name}; `
      , `cd ${app_name}; `
      , `ls; `
      , `pwd; `
      , `clever create -t node "${display_name}" --org ${organization} --region ${region} --alias "${display_name}"; `
      , `clever env set PORT 8080 --alias "${display_name}"; `
      , `clever domain add ${domain_name}.cleverapps.io --alias "${display_name}"; `
      , `clever scale --flavor pico --alias "${display_name}"; `
      , `clever deploy --alias "${display_name}"; `
    ].join('');
  }
}
