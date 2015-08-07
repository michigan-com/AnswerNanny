import Twit from 'twit';
import {twitter} from '../../config';
import computeAnswer from '../../deepthought/lib/index';
import { NannyAnswer } from '../db';

let NANNY_USER_ID = 2317922462;
let NANNY_USER_ID_STR = '2317922462';

var T = new Twit(twitter);

function init() {

}

function postTweet(tweet={status: 'Hello World'}) {
  T.post('statuses/update', tweet, function(err, data, resp) {
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
  function reply(obj) {
    let responseTweet = formatTweetForReply(tweet, obj)
    postTweet(responseTweet);

    // Save in mongo
    let answer = NannyAnswer({
      tweet,
      wolfram: obj,
      response: responseTweet
    });

    answer.save(function(err) {
      if (err) throw new Error(err);
    });
  }

  if (typeof cb === 'undefined') cb = reply;

  if (tweet.user.id === NANNY_USER_ID) {
    console.log('Tweet from nanny, ignoring');
    return;
  }

  console.log(`Got a tweet: ${tweet.text}`)
  let text = tweet.text.replace(/\@AnswerNanny /g, '');
  computeAnswer(text).then(cb);
}

/**
 * Given a tweet and a Wolfram response, compose the tweet to reply to the user
 *
 * @param {Object} tweet - Tweet object
 * @param {Object} obj - computeAnswer() return object
 */
function formatTweetForReply(tweet, obj) {
  let answer = obj.answer ? obj.answer : 'Not sure!';

  let sliceEnd = 140 - (tweet.user.screen_name.length + 2); // 2 == @ and ' '
  answer = answer.slice(0, sliceEnd);

  return {
    status: `@${tweet.user.screen_name} ${answer}`,
    in_reply_to_status_id: tweet.id_str
  }
}

module.exports = {
  init,
  postTweet,
  getTweets,
  streamTweets,
  tweetReceived,
  formatTweetForReply
}
