import _ from '../wrap/lodash'
import log from '../log'
import isCallback from '../matchers/is-callback'

const callbackWrongArgsMsg = (name, args, expected, actual) => `
Contract test failed.

Expected:
  ${name}(${args.map(arg => isCallback(arg) ? 'callback' : arg).join(', ')}) to call the callback as callback(${expected.join(', ')})
Actually:
  ${name}(${args.map(arg => isCallback(arg) ? 'callback' : arg).join(', ')}) called the callback as callback(${actual.join(', ')})
`

const callbackNotSatisfiedMsg = (name, args, expected) => `
Contract test failed.

Expected:
  ${name}(${args.map(arg => isCallback(arg) ? 'callback' : arg).join(', ')}) to call the callback as callback(${expected.join(', ')})
Actually:
  ${name}(${args.map(arg => isCallback(arg) ? 'callback' : arg).join(', ')}) did not call the callback
`

function test(double, call, actual, expected) {
  if (!_.isEqual(actual, expected)) {
    log.warn('td.contract', callbackWrongArgsMsg(double.name, call.args, expected, actual))
  }
}

export default function thenCallback(double, call, expectedArguments) {
  function makeCallbackTest() {
    const callbackTest = (...actualArgs) => {
      callbackTest.satisfied = true
      test(double, call, actualArgs, expectedArguments)
    }
    callbackTest.isCallbackTest = true
    return callbackTest
  }

  const invocationArgs = call.args.map(arg => isCallback(arg) ? makeCallbackTest() : arg)
  const callbacks = invocationArgs.filter(x => x.isCallbackTest)
  double.real.apply(call.context, invocationArgs)

  if (callbacks.filter(cb => cb.satisfied).length != callbacks.length) {
    log.warn('td.contract', callbackNotSatisfiedMsg(double.name, call.args, expectedArguments))
  }
}
