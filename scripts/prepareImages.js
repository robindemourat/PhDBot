const path = require('path');
const fs = require('fs');
var h2p = require('html2plaintext');
const async = require('async');
const arrayShuffle = require('array-shuffle');
var ProgressBar = require('progress');

const parseCitations = require('./parseCitations');
const toImage = require('./htmlToImage');
const formatCitation = require('./formatCitation');
const makeTags = require('./makeTags');

module.exports = function prepareImages(imagesDir, dataDir, callback) {

  const items = [];

  const style = fs.readFileSync(path.resolve(dataDir + '/style.css'), 'utf8');

  const date = new Date();
  let activeDate = date;


  parseCitations(
    path.resolve(dataDir + '/quotes.csv'), 
    path.resolve(dataDir + '/references.csv'), 
    (err, quotes) => {
      const bar = new ProgressBar(':bar :percent :eta', { total: quotes.length });
      let cont = 0;
      async.mapSeries(arrayShuffle(quotes), (quote, quoteCb) => {
        cont++;
        bar.tick();
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
          tags: makeTags(plainCitation),
          path: pat,
          plainSource: plainSource,
          plainCitation: plainCitation
        });
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
        const tags = {};
        items.forEach(item => {
          item.tags.forEach(tag => {
            tags[tag] = tags[tag] === undefined ? 1 : tags[tag] ++;
          })
        });
        items.forEach(item => {
          item.tags = item.tags.sort((a, b) => {
            if (tags[a] > tags[b]) {
              return 1;
            } else return -1;
          })
        });
        fs.writeFileSync(dataDir + '/summary.json', JSON.stringify(items, null, 2));
        fs.writeFileSync(dataDir + '/tags.json', JSON.stringify(tags, null, 2));
        console.log('data was written');
        callback(err);
      });
    }
  );
}