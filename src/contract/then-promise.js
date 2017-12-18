import _ from '../wrap/lodash'
import log from '../log'
import config from '../config'
import ensurePromise from '../log/ensure-promise'

const valueWarningMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.join(', ')}) to resolve with ${expected}
Actually:
  ${name}(${args.join(', ')}) resolved with ${actual}
`

const errorWarningMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.join(', ')}) to reject with ${expected}
Actually:
  ${name}(${args.join(', ')}) rejected with ${actual}
`

const rejectionWarningMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.join(', ')}) to resolve with ${expected}
Actually:
  ${name}(${args.join(', ')}) rejected with ${actual}
`

const resolveWarningMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.join(', ')}) to reject with ${expected}
Actually:
  ${name}(${args.join(', ')}) resolved with ${actual}
`

function testValue(actual, expected, msg) {
  if (!_.isEqual(actual, expected)) {
    log.warn('td.contract', msg)
  }
}

function callSubject(double, call) {
  return double.real.apply(call.context, call.args)
}

function promise() {
  const Promise = config().promiseConstructor
  ensurePromise(Promise)
  return Promise
}

export function thenResolve(double, call, expectedValues) {
  return promise().all(expectedValues.map(expectedValue => {
    return callSubject(double, call)
      .then(actualValue => 
        testValue(actualValue, expectedValue, valueWarningMsg(double.name, call.args, expectedValue, actualValue)))
      .catch(actualError => 
        log.warn('td.contract', rejectionWarningMsg(double.name, call.args, expectedValue, actualError)))
  }))
}

export function thenReject(double, call, expectedErrors) {
  return promise().all(expectedErrors.map(expectedError => {
    return callSubject(double, call)
      .then(actualValue =>
        log.warn('td.contract', resolveWarningMsg(double.name, call.args, expectedError, actualValue)))
      .catch(actualError =>
        testValue(actualError, expectedError, errorWarningMsg(double.name, call.args, expectedError, actualError)))
  }))
}
