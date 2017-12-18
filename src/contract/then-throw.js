import _ from '../wrap/lodash'
import log from '../log'
import { fail } from 'assert';

const mismatchingErrorMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.join(', ')}) to throw ${expected}
Actually:
  ${name}(${args.join(', ')}) threw ${actual}
`

const noErrorMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.join(', ')}) to throw ${expected}
Actually:
  ${name}(${args.join(', ')}) did not throw
`

export default function thenThrow (double, call, expectedErrors) {
  expectedErrors.forEach(expectedError => {
    try {
      double.real.apply(call.context, call.args)
      log.warn('td.contract', noErrorMsg(double.name, call.args, expectedError))
    } catch (actualError) {
      if (!_.isEqual(actualError, expectedError)) {
        log.warn('td.contract', mismatchingErrorMsg(double.name, call.args, expectedError, actualError))
      }
    }
  }) 
}
