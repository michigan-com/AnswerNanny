import {ok, equal, deepEqual} from 'assert';
import computeAnswer from '../lib/index';
import fs from 'fs';
import Path from 'path';

const MODES = ['play', 'record', 'rerecord', 'live'];
let mode = process.env.NETMODE || 'play';
if (MODES.indexOf(mode) < 0) {
  throw new Error('NETMODE must be one of ' + MODES.join(", "));
}

describe('Deep Thought', function() {
  o("who is the governor of Michigan?", 'governor.xml', "Rick Snyder");
});

function o(input, fileName, expectedAnswer) {
  it(`should answer "${input}" with "${expectedAnswer}"`, function(done) {
    let filePath = Path.join(__dirname, 'responses', fileName);
    let cachedResponse = null;
    if (mode === 'play') {
      cachedResponse = fs.readFileSync(filePath, 'utf8');
    }

    computeAnswer(input, cachedResponse).then((obj) => {
      if (mode === 'record' || mode === 'rerecord') {
        if ((mode === 'rerecord') || !fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, obj.cacheableResponse);
        }
      }

      for (let message of obj.log || []) {
        console.log(message);
      }

      // get out of the helpful swallowing of errors that promises do
      // TODO: find out why the catch block doesn't catch them
      process.nextTick(() => {
        equal(obj.answer, expectedAnswer);
        done();
      });
    }).catch((err) => {
      throw err;
    });
  });
}
