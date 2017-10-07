const fs = require('fs');
const dsv = require('d3-dsv');
const markdown = require('markdown').markdown;

module.exports = function(quotesPath, referencesPath, callback) {
  fs.readFile(referencesPath, 'utf8', (err1, str1) => {
    const references = dsv.csvParse(str1);
    fs.readFile(quotesPath, 'utf8', (err2, str2) => {
      const quotes = dsv.csvParse(str2).map(entry => {
        return Object.assign(entry, {
          contenu_html: markdown.toHTML('> ' + entry.contenu_md),
          bibRef : references.find(ref => ref.id === entry.ref_id)
        });
      });
      callback(err2, quotes);
    });
  });
}