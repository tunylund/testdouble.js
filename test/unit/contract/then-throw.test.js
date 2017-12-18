import Call from '../../../src/value/call'
import Double from '../../../src/value/double';
import td from 'testdouble'

let subject, log, realFn, contract, double
const context = {}
const args = ['some-arg']
const call = new Call(context, args)
const expectedErrors = ['expected-error']
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/log').default
    realFn = td.function()
    double = new Double('some-name', realFn, null);
    subject = require('../../../src/contract/then-throw').default
  },
  afterEach: () => td.reset(),
  'thenThrow with a matching error does nothing': () => {
    td.when(realFn.apply(context, args)).thenThrow('expected-error')

    subject(double, call, expectedErrors)

    assert.equal(td.explain(log.warn).callCount, 0)
  },
  'thenThrow with no error thrown logs an error': () => {
    td.when(realFn.apply(context, args)).thenDo(() => {})

    subject(double, call, expectedErrors)

    td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
      + `Expected:\n  some-name(some-arg) to throw expected-error\n`
      + `Actually:\n  some-name(some-arg) did not throw\n`))
  },
  'thenThrow with an unmatching return value logs an error': () => {
    td.when(realFn.apply(context, args)).thenThrow('unexpected-error')

    subject(double, call, expectedErrors)

    td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
      + `Expected:\n  some-name(some-arg) to throw expected-error\n`
      + `Actually:\n  some-name(some-arg) threw unexpected-error\n`))
  },
  'thenThrow with multiple errors calls the subject several times': () => {
    td.when(realFn.apply(context, args)).thenThrow('expected-error-a', 'expected-error-b')

    subject(double, call, ['expected-error-a', 'expected-error-b'])

    assert.equal(td.explain(realFn).callCount, 2)
    assert.equal(td.explain(log.warn).callCount, 0)
  },
}
