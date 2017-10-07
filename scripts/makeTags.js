const fs = require('fs');
const path = require('path');
const stopFr = fs.readFileSync(path.resolve(__dirname + '/../data/french-stop-words.txt'), 'utf8');
const stopEn = fs.readFileSync(path.resolve(__dirname + '/../data/english-stop-words.txt'), 'utf8');

module.exports = function(str) {
  const stops = stopFr.split('\n').concat(stopEn.split('\n'));
  const stripped = str.replace(/[.,'\/#!$%\^&\*;:{}=\-_`~()]/g," ");
  const parts = stripped.split(' ')
    .filter(obj => obj.length > 1)
    .map(word => word.toLowerCase())
    .filter(word => {
      const bro = stops.find(stop => stop === word);
      return bro === undefined;
    });
  return parts;

}