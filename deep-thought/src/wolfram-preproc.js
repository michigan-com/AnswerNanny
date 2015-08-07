import xml2js from 'xml2js';

export default async function preprocessWolframAlphaResponse(xml) {
  let json = await convertXmlToJson(xml);
  return json;
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
