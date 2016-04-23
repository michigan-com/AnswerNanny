let debug = require('debug')('wolfram:parse')

export default function parseWolframAlphaResponse (json) {
  if (!json) {
    debug(`failed to parse: no json`)
    return null
  }

  let result = json.queryresult
  if (!result) {
    debug(`failed to parse: no queryresult`)
    return null
  }

  if (result.$.success !== 'true') {
    debug(`failed to parse: success isn't 'true': %s`, result.$.success)
    return null
  }

  let pods = (result.pod || []).map(parsePod)
  if (debug.enabled) {
    debug(`PODS = %s`, JSON.stringify(pods, null, 2))
  }

  return pods
}

function parsePod (json) {
  let subpods = (json.subpod || []).map(parseSubpod)
  let id = json.$.id

  let text = ''
  for (let subpod of subpods) if (!text && subpod.text) {
      text = subpod.text
  }

  return {
    id: id,
    scanner: json.$.scanner,
    title: json.$.title,
    text: text,
    isInputPod: (id === 'Input'),
    isResultPod: (id === 'Result'),
    isPrimary: (json.$.primary === 'true'),

    subpods: subpods
  }
}

function parseSubpod (json) {
  return {
    title: json.$.title,
    text: (json.plaintext || [])[0] || ''
  }
}
