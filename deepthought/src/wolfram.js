import obtainWolframAlphaResponse from './wolfram-obtain'
import convertWolframAlphaResponse from './wolfram-convert'
import parseWolframAlphaResponse from './wolfram-parse'
import prettifyWolframAlphaResponseText from './wolfram-prettify'
let debug = require('debug')('wolfram:parse')

// reponse is optional, for testing
export default async function computeWolframAlphaAnswer(input, rawResponse) {
  if (!rawResponse) {
    rawResponse = await obtainWolframAlphaResponse(input)
  }

  let json = await convertWolframAlphaResponse(rawResponse)

  let pods = parseWolframAlphaResponse(json)
  let answer = null

  if (pods) {
    for (let pod of pods) if (!answer && pod.isPrimary && pod.text) {
      answer = prettifyWolframAlphaResponseText(pod.text, pod)
    }
    for (let pod of pods) if (!answer && pod.isResultPod && pod.text) {
      answer = prettifyWolframAlphaResponseText(pod.text, pod)
    }
    for (let pod of pods) if (!answer && !pod.isInputPod && pod.text) {
      answer = prettifyWolframAlphaResponseText(pod.text, pod)
    }
  }

  return {
    cacheableResponse: rawResponse,
    answer
  }
}
