import Call from '../../../src/value/call'
import Double from '../../../src/value/double';
import td from 'testdouble'

let subject, log, realFn, double, ensurePromise
const context = {}
const args = ['some-arg']
const call = new Call(context, args)
const expectedErrors = ['expected-error']
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/log').default
    realFn = td.function()
    double = new Double('some-name', realFn, null);
    ensurePromise = td.replace('../../../src/log/ensure-promise').default
    subject = require('../../../src/contract/then-promise').thenReject
  },
  afterEach: () => td.reset(),
  'thenReject with a matching error does nothing': (done) => {
    td.when(realFn.apply(context, args)).thenReject('expected-error')

    subject(double, call, expectedErrors).then(() => {
      assert.equal(td.explain(log.warn).callCount, 0)
      done()
    })
  },
  'thenReject with an unmatching error logs an error': (done) => {
    td.when(realFn.apply(context, args)).thenReject('unexpected-error')

    subject(double, call, expectedErrors).then(() => {
      td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
      + `Expected:\n  some-name(some-arg) to reject with expected-error\n`
      + `Actually:\n  some-name(some-arg) rejected with unexpected-error\n`))
      done()
    })
  },
  'thenReject with a resolved promise logs an error': (done) => {
    td.when(realFn.apply(context, args)).thenResolve('unexpected-value')

    subject(double, call, expectedErrors).then(() => {
      td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
      + `Expected:\n  some-name(some-arg) to reject with expected-error\n`
      + `Actually:\n  some-name(some-arg) resolved with unexpected-value\n`))
      done()
    })
  },
  'thenReject with multiple values': () => {
    td.when(realFn.apply(context, args)).thenReject('expected-error-a', 'expected-error-b')
    
    subject(double, call, ['expected-error-a', 'expected-error-b'])

    assert.equal(td.explain(realFn).callCount, 2)
    assert.equal(td.explain(log.warn).callCount, 0)
  },
}
