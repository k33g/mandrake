// https://github.com/sdelements/lets-chat
module.exports = {
  title: `GitBucket Application v4.13 (H2 version - S)`,
  prompts: function(db) {
    let fsBucketAddOnNameInput = {
      type: 'input',
      name: 'fsBucketAddOnName',
      message: 'What is the name of the fs-bucket addon?'
    }
    return [fsBucketAddOnNameInput]
  },
  cmd: function({
    template, application, displayName, domain, organization, region, promptsAnswers
  }) {
    let fsbucket_addon_name = promptsAnswers.fsBucketAddOnName
    /*
      GITBUCKET_HOME=/app/storage/.gitbucket
      JAVA_VERSION=8
      PORT=8080
    */
    return [
        `echo "It could be long... Please be patient ⏳"; `
      , `mkdir ${application}; `
      , `cd ${application}; `
      , `clever create -t war "${displayName}" --org ${organization} --region ${region} --alias "${displayName}"; `
      , `echo "JAVA_VERSION=8\nGITBUCKET_HOME=/app/storage/.gitbucket\nPORT=8080" | clever env import --alias "${displayName}"; `
      , `clever service link-addon ${fsbucket_addon_name} --alias "${displayName}"; `
      , `clever domain add ${domain}.cleverapps.io --alias "${displayName}"; `
      , `clever scale --flavor S --alias "${displayName}"; `
    ].join('');

  },
  afterCreate: function({template, application, displayName, domain, organization, region, promptsAnswers, envvars, config, services}) {
    // after create application on Clever Cloud
    let fsbucket_addon_name = promptsAnswers.fsBucketAddOnName

    let bucketId = services.addons.find(item => item.name == fsbucket_addon_name).id.replace("bucket_", "bucket-")
    return [
        `./templates/${template}/genjsonfiles.sh ${application} ${bucketId}; `
      , `cp ./templates/${template}/*.war ./${application}; `
      , `echo "👋 gitbucket.war is copied"; `
    ].join('');
  },
  afterPush: function({template, application, displayName, domain, organization, region, promptsAnswers, envvars, config, services}) {
    // after pushing code to Clever Cloud
    return [
        `echo "Have fun 😃 on http://${domain}.cleverapps.io/"; `
    ].join('');
  }
}
