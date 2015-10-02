import querystring from 'querystring';
import request from 'request-promise';
import getRequiredEnvVar from './util/env-var';
let debug = require('debug')('wolfram:calls');

const WOLFRAM_APPID = getRequiredEnvVar('WOLFRAM_APPID');

export default async function obtainWolframAlphaResponse(input) {
  let url = generateWolframAlphaUrl(input);
  debug('Asking Wolfram Alpha: %s', input);
  return await request(url);
}

function generateWolframAlphaUrl(input) {
  let params = {
    'appid': WOLFRAM_APPID,
    'input': input,
    'reinterpret': 'true',
    'location': 'Michigan',
    'format': 'plaintext',
   };
  let qs = querystring.stringify(params);
  return 'http://api.wolframalpha.com/v2/query?' + qs;
}
