const path = require('path');
const fs = require('fs');
const prepareImages = require('./scripts/prepareImages');
const publishImage = require('./scripts/publishImage');

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive(path.resolve(__dirname + '/images'));
fs.mkdirSync('images');

prepareImages(
  path.resolve(__dirname + '/images'), 
  path.resolve(__dirname + '/data'), 
  (err) => {
    console.log(err);
  }
);