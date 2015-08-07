import Twit from 'twit';
import {twitter} from '../../config';
import computeAnswer from '../../deepthought/lib/index';

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

  stream.on('tweet', tweetReceived);
}

function tweetReceived(tweet, cb) {
  function defaultCallback(obj) {
    console.log(tweet.id);
    T.post('statuses/update', {
      status: `${obj.answer} https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
    }, function(err, data, resp){
      if (err) throw Error(err);

      console.log(data);
    })
  }
  if (typeof cb === 'undefined') cb = defaultCallback;

  console.log(`Got a tweet: ${tweet.text}`)
  let text = tweet.text.replace(/\@AnswerNanny /g, '');
  computeAnswer(text).then(cb);
}

module.exports = {
  init,
  postTweet,
  getTweets,
  streamTweets,
  tweetReceived
}
