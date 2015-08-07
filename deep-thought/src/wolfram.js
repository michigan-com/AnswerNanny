import obtainWolframAlphaResponse from './wolfram-obtain';
import preprocessWolframAlphaResponse from './wolfram-preproc';

// reponse is optional, for testing
export default async function computeWolframAlphaAnswer(input, rawResponse) {
  if (!rawResponse) {
    rawResponse = await obtainWolframAlphaResponse(input);
  }

  let json = await preprocessWolframAlphaResponse(rawResponse);

  let answer = null;

  let result = json.queryresult;
  let log = [];
  if (result.$.success === 'true') {
    for (let pod of result.pod || []) {
      log.push(`POD id=${pod.$.id} scanner=${pod.$.scanner} title=${JSON.stringify(pod.$.title)}`);
      for (let subpod of pod.subpod || []) {
        let text = (subpod.plaintext || [])[0] || '';
        log.push(`  SUBPOD title=${JSON.stringify(subpod.$.title)} text=${JSON.stringify(text)}`);
        if (text && (!answer || (pod.$.id === 'Result'))) {
          answer = text;
        }
      }
    }
  }

  return {
    cacheableResponse: rawResponse,
    log,
    answer
  }
}
