const fs = require('fs');
const express = require('express')
const app = express()
const config = require('./config.json');

app.get('/', function (req, res) {
  const sum = fs.readFileSync('data/summary.json', 'utf8');
   try{
    const summary = JSON.parse(sum);
      const activeDate = new Date();
      const dayStamp = activeDate.getFullYear() + '-' + activeDate.getMonth() + '-' + activeDate.getDate();
      const tweetOfTheDay = summary.find(tweet => tweet.id === dayStamp);
      if (tweetOfTheDay) {
        const image = fs.readFileSync(tweetOfTheDay.path, 'base64');
        const date = config.cronFreq.split(' ').slice(0, 3).reverse().join(':')
        const base = 
        res.send(`<html><body>
            <img src="data:image/png;base64,${image}" />
            <p>
              Publishing setup to ${date}
            </p>
          </body></html>`)
      } else {
        res.status(404).send('no tweet today');
      }
    } catch(e) {
      console.log('error: ', e);
      res.status(500).send('bad json');
    }
})

app.listen(3000)