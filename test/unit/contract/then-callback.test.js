import Call from '../../../src/value/call'
import Double from '../../../src/value/double';
import td from 'testdouble'

let subject, log, realFn, double, call
const context = {}
const args = ['some-arg']
const expectedArguments = ['expected-argument']
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/log').default
    realFn = td.function()
    double = new Double('some-name', realFn, null);
    call = new Call(context, ['some-arg', td.callback()])
    subject = require('../../../src/contract/then-callback').default
  },
  afterEach: () => td.reset(),
  'thenCallback with matching arguments does nothing': () => {
    td.when(realFn.apply(context, args)).thenCallback('expected-argument');

    subject(double, call, expectedArguments)

    assert.equal(td.explain(log.warn).callCount, 0)
  },
  'thenCallback with an unmatching return value logs an error': () => {
    td.when(realFn.apply(context, ['some-arg', td.callback])).thenCallback('unexpected-argument')

    subject(double, call, expectedArguments)

    td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
    + `Expected:\n  some-name(some-arg, callback) to call the callback as callback(expected-argument)\n`
    + `Actually:\n  some-name(some-arg, callback) called the callback as callback(unexpected-argument)\n`))
  },
  'thenCallback with the callback in an arbitrary position is satisfied': () => {
    td.when(realFn.apply(context, [td.callback, 'some-arg'])).thenCallback('expected-argument');
    const callWithCallbackAsFirstArg = new Call(context, [td.callback(), 'some-arg'])

    subject(double, callWithCallbackAsFirstArg, expectedArguments)

    assert.equal(td.explain(log.warn).callCount, 0)
  },
  'thenCallback with no callback logs an error': () => {
    td.when(realFn.apply(context, ['some-arg'])).thenReturn()

    subject(double, call, expectedArguments)

    td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
    + `Expected:\n  some-name(some-arg, callback) to call the callback as callback(expected-argument)\n`
    + `Actually:\n  some-name(some-arg, callback) did not call the callback\n`))
  },
  'thenCallback with the multiple callbacks calls them all': () => {
    const fnThatCallsOnlyOneCallback = (a, b) => a(expectedArguments[0]);
    const double = new Double('some-name', fnThatCallsOnlyOneCallback, null);
    const callWithMultipleCallbacks = new Call(context, [td.callback(), td.callback()])

    subject(double, callWithMultipleCallbacks, expectedArguments)

    td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
    + `Expected:\n  some-name(callback, callback) to call the callback as callback(expected-argument)\n`
    + `Actually:\n  some-name(callback, callback) did not call the callback\n`))
  },

}
