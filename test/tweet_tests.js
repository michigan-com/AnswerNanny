import {ok, equal, deepEqual} from 'assert';
import twitter from '../src/twitter/index';

function twitterObject(text) {
  return {
    text
  }
}

describe('Twitter tests', function() {

  it ('Tests tweetReceived', function(done) {
    let tweet = twitterObject('what is the governor of Michigan?')
    let answer = 'Rick Snyder';
    twitter.tweetReceived(tweet, function(obj) {
      equal(obj.answer, answer);
      done();
    })
  });
});
