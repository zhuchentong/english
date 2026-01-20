interface TestGlobalThis {
  defineEventHandler: typeof import('h3').defineEventHandler
  getQuery: typeof import('h3').getQuery
  HTTPError: typeof import('h3').HTTPError
  H3Event: typeof import('h3').H3Event
  useFetch: ReturnType<typeof import('vitest').vi.fn>
}

/* eslint-disable vars-on-top */
declare global {
  var defineEventHandler: TestGlobalThis['defineEventHandler']
  var getQuery: TestGlobalThis['getQuery']
  var HTTPError: TestGlobalThis['HTTPError']
  var H3Event: TestGlobalThis['H3Event']
  var useFetch: TestGlobalThis['useFetch']
}
/* eslint-enable vars-on-top */

export {}
