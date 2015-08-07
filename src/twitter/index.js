import Twit from 'twit';
import {twitter} from '../../config';

var T = new Twit(twitter);

function init() {

}

function postTweet(status='Hello World') {
  T.post('statuses/update', { status }, function(err, data, resp) {
    if (err) throw Error(err);
    console.log(data);
  });
}

function getTweets(q='@AnswerNanny') {
  T.get('search/tweets', {q}, function(err, data, resp) {
    if (err) throw Error(err);
    console.log(data);
  });
}

function streamTweets(track='@AnswerNanny') {

  let stream = T.stream('statuses/filter', {track});

  stream.on('tweet', function(tweet) {
    console.log('We got a tweet!');
    console.log(tweet);
  })
}

module.exports = {
  init,
  postTweet,
  getTweets,
  streamTweets
}
