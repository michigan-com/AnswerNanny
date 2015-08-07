import obtainWolframAlphaResponse from './wolfram-obtain';
import preprocessWolframAlphaResponse from './wolfram-preproc';
let debug = require('debug')('wolfram:parse');

// reponse is optional, for testing
export default async function computeWolframAlphaAnswer(input, rawResponse) {
  if (!rawResponse) {
    rawResponse = await obtainWolframAlphaResponse(input);
  }

  let json = await preprocessWolframAlphaResponse(rawResponse);

  let answer = null;

  let result = json.queryresult;
  if (result.$.success === 'true') {
    for (let pod of result.pod || []) {
      debug(`POD id=${pod.$.id} scanner=${pod.$.scanner} title=${JSON.stringify(pod.$.title)}`);
      for (let subpod of pod.subpod || []) {
        let text = (subpod.plaintext || [])[0] || '';
        debug(`  SUBPOD title=${JSON.stringify(subpod.$.title)} text=${JSON.stringify(text)}`);
        if (text && (!answer || (pod.$.id === 'Result'))) {
          answer = text;
        }
      }
    }
  }
  return {
    cacheableResponse: rawResponse,
    answer
  }
}
