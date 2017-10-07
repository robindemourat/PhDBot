const textToImage = require('text-to-image');
const fs = require('fs');

module.exports = function(text, path, callback) {
  textToImage.generate(text).then(function (uri) {
    const data = uri.split('data:image/png;base64,')[1];
    fs.writeFile(path, data, 'base64', callback);
  });
}