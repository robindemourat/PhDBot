const CronJob = require('cron').CronJob;
const fs = require('fs');
const publishImage = require('./scripts/publishImage');
const config = require('./config.json');

console.log('starting cron job with freq', config.cronFreq);
const job = new CronJob(config.cronFreq, function() {

  console.log('bip bip bip. Waking up to publish stuff');
  /*
   * Runs every weekday (Monday through Friday)
   * at 19:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
  const sum = fs.readFileSync('data/summary.json', 'utf8');
  console.log(sum);
   try{
    const summary = JSON.parse(sum);
      const activeDate = new Date();
      const dayStamp = activeDate.getFullYear() + '-' + activeDate.getMonth() + '-' + activeDate.getDate();
      const tweetOfTheDay = summary.find(tweet => tweet.id === dayStamp);
      if (tweetOfTheDay) {
        publishImage(tweetOfTheDay.path, tweetOfTheDay.plainCitation, tweetOfTheDay.plainSource + config.tweetSuffix, (err) => {
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
      
  }, function () {
    /* This function is executed when the job stops */
    console.log('job is stopping');
  },
  true, /* Start the job right now */
  'Europe/Paris' /* Time zone of this job. */
);

job.start();