const fs = require('fs');
const path = require('path');
const publishImage = require('./scripts/publishImage');
const config = require('./config.json');

const tweet = function() {

  console.log('bip bip bip. Waking up to publish stuff');
  /*
   * Runs every weekday (Monday through Friday)
   * at 19:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
  const sum = fs.readFileSync('data/summary.json', 'utf8');
   try{
    const summary = JSON.parse(sum);
      const activeDate = new Date();
      const dayStamp = activeDate.getFullYear() + '-' + activeDate.getMonth() + '-' + activeDate.getDate();
      const tweetOfTheDay = summary.find(tweet => tweet.id === dayStamp);
      let tweetContent = tweetOfTheDay.plainSource + config.tweetSuffix;
      const tags = tweetOfTheDay.tags.slice();
      while(tags.length && (tweetContent + ' #' + tags[0]).length < 140) {
        tweetContent += ' #' + tags[0];
        tags.shift();
      }
      if (tweetOfTheDay) {
        publishImage(
          path.resolve(__dirname + '/images/' + tweetOfTheDay.id  + '.jpg'), 
          tweetOfTheDay.plainCitation, 
          tweetContent, //  + tweetOfTheDay.tags.join(' #'), 
          (err) => {
          if (err) {
            console.log('error while publishing : ', err);

          } else {
            console.log('published, cron going back to sleep');
          }
        })
      } else {
        console.log('oups, tweet not found');
      }
    } catch(e) {
      console.log('json invalid', e);
    }
}

module.exports = tweet;