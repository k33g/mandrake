module.exports = {
  prompts: function(db) {
    let objectNameInput = {
      type: 'input',
      name: 'object',
      message: 'What is the scala file name of the web application?'
    }
    let microServiceIdInput = {
      type: 'input',
      name: 'microserviceId',
      message: 'What is the id of the microservice to call (eg calculator)?'
    }
    let redisAddOnNameInput = {
      type: 'input',
      name: 'redisAddOnName',
      message: 'What is the name of redis addon?'
    }
    return [objectNameInput, microServiceIdInput, redisAddOnNameInput]
  },
  cmd: function(template_name, app_name, display_name, domain_name, organization, region, answers) {

    let object_name = answers.object
    let microservice_id = answers.microserviceId
    let redis_addon_name = answers.redisAddOnName


    return [
        `./templates/${template_name}/newscalamsvertx.sh ${app_name} ${object_name} ${microservice_id}; `
      , `cd ${app_name}; `
      , `clever create -t sbt "${display_name}" --org ${organization} --region ${region} --alias "${display_name}"; `
      , `clever env set PORT 8080 --alias "${display_name}"; `
      , `clever domain add ${domain_name}.cleverapps.io --alias "${display_name}"; `
      , `clever scale --flavor M --alias "${display_name}"; `
      , `clever service link-addon ${redis_addon_name} --alias "${display_name}"; `
      , `clever deploy --alias "${display_name}"; `
    ].join('');


  }
}
