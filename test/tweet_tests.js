import {ok, equal, deepEqual} from 'assert';
import twitter from '../src/twitter/index';
import {stub} from 'sinon';
import Twit from 'twit';


function defaultTweet() {
  return {
    user: {
      id: -1,
      screen_name: 'testName'
    },
    text: '@AnswerNanny who is the governor of Michigan?'
  }
}

describe('Twitter tests', function() {

  it ('Tests tweetReceived', function(done) {
    let answer = 'Rick Snyder';
    twitter.tweetReceived(defaultTweet(), function(obj) {
      equal(obj.answer, answer);
      done();
    });
  });

  it('Tests the formatting of a tweet', function(done) {
    let tweet = defaultTweet()
    let answer = 'Rick Snyder';
    let expectedTweet = `@${tweet.user.screen_name} ${answer}`

    twitter.tweetReceived(tweet, function(obj) {
      let responseTweet = twitter.formatTweetForReply(tweet, obj);
      equal(responseTweet.status, expectedTweet);
      done();
    });

  });
});
