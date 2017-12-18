import Call from '../../../src/value/call'
import Double from '../../../src/value/double';
import td from 'testdouble'

let subject, log, realFn, contract, double
const context = {}
const args = ['some-arg']
const call = new Call(context, args)
const expectedValues = ['expected-value']
module.exports = {
  beforeEach: () => {
    log = td.replace('../../../src/log').default
    realFn = td.function()
    double = new Double('some-name', realFn, null);
    subject = require('../../../src/contract/then-return').default
  },
  afterEach: () => td.reset(),
  'thenReturn with a matching return value does nothing': () => {
    td.when(realFn.apply(context, args)).thenReturn('expected-value')

    subject(double, call, expectedValues)

    assert.equal(td.explain(log.warn).callCount, 0)
  },
  'thenReturn with an unmatching return value logs an error': () => {
    td.when(realFn.apply(context, args)).thenReturn('unexpected-value')

    subject(double, call, expectedValues)

    td.verify(log.warn('td.contract', `\nContract test failed.\n\n`
      + `Expected:\n  some-name(some-arg) => expected-value\n`
      + `Actually:\n  some-name(some-arg) => unexpected-value\n`))
  },
  'thenReturn with multiple values': () => {
    td.when(realFn.apply(context, args)).thenReturn('expected-value-a', 'expected-value-b')
    
    subject(double, call, ['expected-value-a', 'expected-value-b'])

    assert.equal(td.explain(realFn).callCount, 2)
    assert.equal(td.explain(log.warn).callCount, 0)
  },
}
