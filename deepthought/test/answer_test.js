import { ok, equal, deepEqual } from 'assert'
import computeAnswer from '../lib/index'
import fs from 'fs'
import Path from 'path'

const MODES = ['play', 'rec', 'rerec', 'live']
let mode = process.env.NETMODE || 'play'
if (MODES.indexOf(mode) < 0) {
  throw new Error('NETMODE must be one of ' + MODES.join(', '))
}

describe('Deep Thought', function () {
  o('who is the governor of Michigan?',
    'governor.xml',
    'Rick Snyder')
  o('how warm is it?',
    'weather-warm.xml',
    '15 °C (wind chill: 15 °C; 40 minutes ago)')
  o('What are anagrams of plate?',
    'anagrams-plate.xml',
    'lepta, petal, pleat, tepal')
  o('If I have 12 apples, and Jane has 7, and then Jane gives me 2 apples, how many more apples do I have than Jane?',
    'apples-jane.xml',
    'I have 9 apples more than Jane has.')
  o('What is morse code for Michigan?',
    'morse-michigan.xml',
    '-- .. -.-. .... .. --. .- -.')
  o('Current price of an iPhone 6S',
    'iphone-price.xml',
    'median $799.99; highest $999.99; lowest $549.99')
  o('What is the airspeed velocity of an unladen swallow?',
    'unladen-swallow-velocity.xml',
    '11 m/s (meters per second; asked, but not answered, about a general swallow in the 1975 film Monty Python and the Holy Grail)')
  o('US$100 1900 in 2015',
    'us100-1900-2015.xml',
    '$2957.09 (2015 US dollars; based on Consumer Price Index)')
  o('What are the odds of a royal flush in poker?',
    'poker-odds-royalflush.xml',
    'number of possible hands: 4 (5‐card hand), 4324 (7‐card hand)\n' +
    'approximate probability: 1.539×10^-6 (5‐card hand), 3.232×10^-5 (7‐card hand)\n' +
    'approximate chance: ≈ 1 in 649740 (5‐card hand), ≈ 1 in 30940 (7‐card hand)')
  o('Microsoft | Apple',
    'ms-apple.xml',
    'MSFT $51.78; AAPL $105.68')
  o('United Airlines flight 3318',
    'united-3318.xml',
    'carrier code UA; name United Air Lines Inc.; airline ID 19977')
  o('What is the first name of the governor of Michigan?',
    'governor-first-name.xml',
    '')
  o('How many cities in China have a population of more than 1,000,000?',
    'china-cities-1m.xml',
    'Shanghai, Beijing, Zhoukou, Nanyang, Baoding, Chengdu, Linyi, Harbin, Tianjin, Shijiazhuang, Xuzhou, Handan, Heze, Shangqiu, Ganzhou, Zhumadian, Weifang, Xinyang, Wuhan, Jining, … (total: 340)')
/*
  o('',
    '.xml',
    'xxx')
  o('',
    '.xml',
    'xxx')
  o('',
    '.xml',
    'xxx')
  o('',
    '.xml',
    'xxx')
*/
})

function o (input, fileName, expectedAnswer) {
  let filePath = Path.join(__dirname, 'responses', fileName)

  it(`should answer "${input}" with "${expectedAnswer}"`, function () {
    let cachedResponse = null
    let exists = fs.existsSync(filePath)
    if (mode === 'play' || (mode === 'rec' && exists)) {
      cachedResponse = fs.readFileSync(filePath, 'utf8')
    }

    return computeAnswer(input, cachedResponse).then((obj) => {
      if (mode === 'rec' || mode === 'rerec') {
        if ((mode === 'rerec') || !exists) {
          fs.writeFileSync(filePath, obj.cacheableResponse)
        }
      }

      equal(obj.answer, expectedAnswer)
    })
  })
}
