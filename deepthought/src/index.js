import computeWolframAlphaAnswer from './wolfram'

export default async function computeAnswer(input, cachedResponse) {
  return await computeWolframAlphaAnswer(input, cachedResponse)
}
