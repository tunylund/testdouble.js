import _ from '../wrap/lodash'
import log from '../log'

const returnValueWarningMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.join(', ')}) => ${expected}
Actually:
  ${name}(${args.join(', ')}) => ${actual}
`

export default function thenReturn(double, call, expectedValues) {
  expectedValues.forEach(expectedValue => {
    const actualValue = double.real.apply(call.context, call.args)
    if (!_.isEqual(actualValue, expectedValue)) {
      log.warn('td.contract', returnValueWarningMsg(double.name, call.args, expectedValue, actualValue))
    }
  })
}
