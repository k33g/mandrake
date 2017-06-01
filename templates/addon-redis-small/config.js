
module.exports = {
  title: "Add on Redis (Small)",
  cmd: function(addon_name, organization, region) {
    return [
        `clever addon create redis-addon "${addon_name}" --plan s --org ${organization} --region ${region}; `
    ].join('');
  }
}
