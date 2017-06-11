//Available plans: vine, gunnera, shamrock, hazelnut, peanut
module.exports = {
  title: "Add on FS-Bucket",
  cmd: function(addon_name, organization, region) {
    return [
        `clever addon create fs-bucket "${addon_name}" --plan s --org ${organization} --region ${region}; `
    ].join('');
  }
}
