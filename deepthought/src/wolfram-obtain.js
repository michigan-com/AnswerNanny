import querystring from 'querystring';
import request from 'request-promise';
import getRequiredEnvVar from './util/env-var';
let debug = require('debug')('wolfram:calls');

const WOLFRAM_APPID = getRequiredEnvVar('WOLFRAM_APPID');

export default async function obtainWolframAlphaResponse(input) {
  debug('Asking Wolfram Alpha: %s', input);
  return await request(generateWolframAlphaUrl(input));
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

function convertXmlToJson(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
