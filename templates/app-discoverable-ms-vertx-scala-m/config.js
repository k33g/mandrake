// very simple Vert-x discoverable microservice written in Scala
module.exports = {
  title: "Scala Vert-x discoverable microservice",
  prompts: function(db) {
    let objectNameInput = {
      type: 'input',
      name: 'object',
      message: 'What is the scala file name of the microservice?'
    }
    let microServiceIdInput = {
      type: 'input',
      name: 'microserviceId',
      message: 'What is the id of the microservice (eg calculator)?'
    }
    let redisAddOnNameInput = {
      type: 'input',
      name: 'redisAddOnName',
      message: 'What is the name of redis addon?'
    }
    return [objectNameInput, microServiceIdInput, redisAddOnNameInput]
  },
  cmd: function({
    template, application, displayName, domain, organization, region, promptsAnswers
  }) {
    let object_name = promptsAnswers.object
    let microservice_id = promptsAnswers.microserviceId
    let redis_addon_name = promptsAnswers.redisAddOnName

    // dont't forget that the service has to register as listening on 80

    return [
        `./templates/${template}/newscalamsvertx.sh ${application} ${object_name}; `
      , `cd ${application}; `
      , `clever create -t sbt "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `clever env set SERVICE_PORT 80 --alias "${displayName}"; `
      , `clever env set SERVICE_ID ${microservice_id} --alias "${displayName}"; `
      , `clever env set SERVICE_HOST ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever env set SERVICE_ROOT "/api" --alias "${displayName}"; `
      , `clever env set PORT 8080 --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor M --alias "${displayName}"; `
      , `clever service link-addon ${redis_addon_name} --alias "${displayName}"; `
    ].join('');


  }
}
