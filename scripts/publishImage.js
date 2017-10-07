let credentials;
if (process.env.NODE_ENV === 'production') {
  credentials = {
   "consumer_key": process.env.consumer_key,
   "consumer_secret": process.env.consumer_secret,
   "access_token": process.env.access_token,
   "access_token_secret": process.env.access_token_secret,
  };
} else {
  credentials = require('../secrets.json');
}
const postImage = require('post-image-to-twitter');
const Twit = require('twit');
const fs = require('fs');

module.exports = function(path, altText, caption, callback) {
  console.log('publishing image', path);
  console.log('alt text: ', altText);
  console.log('caption: ', caption);
  fs.readFile(path, function(err, data) {
     var buffer = new Buffer(data).toString('base64');

     const altTextR = altText.length < (420 - 3) ? altText : altText.substr(0, 417) + "...";
     const captionR = caption.length < (420 - 3) ? caption : caption.substr(0, 417) + "...";

     var postImageOpts = {
      twit: new Twit(credentials),
      base64Image: buffer.toString('base64'),
      altText: altTextR, // : 'This a picture of a philosopher.',
      caption: captionR// : 'Check out my philosopher, Twitter dot com!'
    };

    postImage(postImageOpts, wrapUp);

    function wrapUp(error, data) {
      if (error) {
        console.log('done with error: ', error, error.stack);

        if (data) {
          console.log('done, data:', data);
        }
      }
      callback(error, data);
    }
  });
}