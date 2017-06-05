//Available plans: vine, gunnera, shamrock, hazelnut, peanut
module.exports = {
  title: "Add on MongoDb (Peanut)",
  cmd: function(addon_name, organization, region) {
    return [
        `clever addon create mongodb-addon "${addon_name}" --plan peanut --org ${organization} --region ${region}; `
    ].join('');
  }
}
