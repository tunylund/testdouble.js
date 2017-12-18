import Call from '../../../src/value/call'
import Double from '../../../src/value/double';
import td from 'testdouble'

let subject, log, realFn, double, ensurePromise
const context = {}
const args = ['some-arg']
const call = new Call(context, args)
const expectedValues = ['expected-value']
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/log').default
    realFn = td.function()
    double = new Double('some-name', realFn, null);
    ensurePromise = td.replace('../../../src/log/ensure-promise').default
    subject = require('../../../src/contract/then-promise').thenResolve
  },
  afterEach: () => td.reset(),
  'thenResolve with a matching return value does nothing': (done) => {
    td.when(realFn.apply(context, args)).thenResolve('expected-value')

    subject(double, call, expectedValues).then(() => {
      assert.equal(td.explain(log.warn).callCount, 0)
      done()
    })
  },
  'thenResolve with an unmatching return value logs an error': (done) => {
    td.when(realFn.apply(context, args)).thenResolve('unexpected-value')

    subject(double, call, expectedValues).then(() => {
      td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
      + `Expected:\n  some-name(some-arg) to resolve with expected-value\n`
      + `Actually:\n  some-name(some-arg) resolved with unexpected-value\n`))
      done()
    })
  },
  'thenResolve with a rejected promise logs an error': (done) => {
    td.when(realFn.apply(context, args)).thenReject('unexpected-error')

    subject(double, call, expectedValues).then(() => {
      td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
      + `Expected:\n  some-name(some-arg) to resolve with expected-value\n`
      + `Actually:\n  some-name(some-arg) rejected with unexpected-error\n`))
      done()
    })
  },
  'thenResolve with multiple values': () => {
    td.when(realFn.apply(context, args)).thenResolve('expected-value-a', 'expected-value-b')
    
    subject(double, call, ['expected-value-a', 'expected-value-b'])

    assert.equal(td.explain(realFn).callCount, 2)
    assert.equal(td.explain(log.warn).callCount, 0)
  },
}
