import Twit from 'twit';
import {twitter} from '../../config';
import computeAnswer from '../../deepthought/lib/index';

let NANNY_USER_ID = 2317922462;
let NANNY_USER_ID_STR = '2317922462';

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

  let stream = T.stream('user', {replies: 'all'});

  stream.on('tweet', tweetReceived);
}

function tweetReceived(tweet, cb) {
  function defaultCallback(obj) {
    let answer = obj.answer ? obj.answer : 'Not sure!';
    T.post('statuses/update', {
      status: `${answer} @${tweet.user.screen_name} https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      in_reply_to_status_id: tweet.is_str
    }, function(err, data, resp){
      if (err) throw Error(err);

      console.log(data);
    })
  }
  if (typeof cb === 'undefined') cb = defaultCallback;

  if (tweet.user.id === NANNY_USER_ID) {
    console.log('Tweet from nanny, ignoring');
    return;
  }

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
