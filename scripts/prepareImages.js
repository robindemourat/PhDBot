const path = require('path');
const fs = require('fs');
var h2p = require('html2plaintext');
const async = require('async');

const parseCitations = require('./parseCitations');
const toImage = require('./htmlToImage');
const formatCitation = require('./formatCitation');

module.exports = function prepareImages(imagesDir, dataDir, callback) {

  const items = [];

  const style = fs.readFileSync(path.resolve(dataDir + '/style.css'), 'utf8');

  const date = new Date();
  let activeDate = date;

  parseCitations(
    path.resolve(dataDir + '/quotes.csv'), 
    path.resolve(dataDir + '/references.csv'), 
    (err, quotes) => {
      let cont = 0;
      async.mapSeries(quotes, (quote, quoteCb) => {
        cont++;
        const citation = formatCitation(quote.bibRef.bibtex, quote.localisateur);
        const displayDate = activeDate.getFullYear() + '-' + activeDate.getMonth() + '-' + activeDate.getDate();
        const pat = path.resolve(imagesDir + '/' + displayDate + '.jpg');
        // adding a day to the date
        var dat = new Date(activeDate.valueOf());
        dat.setDate(dat.getDate() + 1);
        activeDate = dat;
        const plainSource = h2p(citation);
        const plainCitation = h2p(quote.contenu_html);
        items.push({
          id: displayDate,
          path: pat,
          plainSource: plainSource,
          plainCitation: plainCitation
        })
        const content = `
  <html>
    <meta>
  <link href="https://fonts.googleapis.com/css?family=Manuale:400,400i,700,700i" rel="stylesheet">
      <style>
  ${style}
      </style>
    </meta>
    <body>${quote.contenu_html}\n${citation}</body>
  </html>`;
        toImage(content, pat, quoteCb);
      }, err => {
        console.log('done creating all images !');
        fs.writeFileSync(dataDir + '/summary.json', JSON.stringify(items, null, 2));
        console.log('data was written');
        callback(err);
      });
    }
  );
}