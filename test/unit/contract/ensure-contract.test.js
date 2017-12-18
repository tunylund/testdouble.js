import Call from '../../../src/value/call'
import Double from '../../../src/value/double';
import td from 'testdouble'

let subject, thenReturn, thenCallback, thenThrow, thenResolve, thenReject, log
const double = {}, call = {}, outcomes = []
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/log').default
    thenReturn = td.replace('../../../src/contract/then-return').default
    thenCallback = td.replace('../../../src/contract/then-callback').default
    thenThrow = td.replace('../../../src/contract/then-throw').default
    const thenPromise = td.replace('../../../src/contract/then-promise')
    thenResolve = thenPromise.thenResolve
    thenReject = thenPromise.thenReject
    subject = require('../../../src/contract/ensure-contract').default
  },
  afterEach: () => td.reset(),
  'thenReturn should be tested with thenReturnTest': () => {
    subject('thenReturn', double, call, outcomes)
    td.verify(thenReturn(double, call, outcomes))
  },
  'thenCallback should be tested with thenCallbackTest': () => {
    subject('thenCallback', double, call, outcomes)
    td.verify(thenCallback(double, call, outcomes))
  },
  '.thenThrow should be tested with thenThrowTest': () => {
    subject('thenThrow', double, call, outcomes)
    td.verify(thenThrow(double, call, outcomes))
  },
  '.thenResolve should be tested with thenResolveTest': () => {
    subject('thenResolve', double, call, outcomes)
    td.verify(thenResolve(double, call, outcomes))
  },
  '.thenReject should be tested with thenRejectTest': () => {
    subject('thenReject', double, call, outcomes)
    td.verify(thenReject(double, call, outcomes))
  },
  '.thenDo should log a warning': () => {
    subject('thenDo', double, call, outcomes)
    td.verify(log.warn('td.contract', `\nContract for a thenDo scenario cannot be validatd.\n`
    + `Please use td.when instead in order to avoid the false sense of security syndrome.\n`))
  },

  //does not support matchers
}
