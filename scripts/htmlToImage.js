var webshot = require('webshot');

module.exports = function(html, path, callback) {
  webshot(html, path, {
    siteType:'html'
  }, (err) => {
    callback(err);
  });
}