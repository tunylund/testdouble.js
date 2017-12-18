import thenReturn from './then-return'
import thenCallback from './then-callback'
import thenThrow from './then-throw'
import { thenResolve, thenReject } from './then-promise'
import log from '../log'

export default function ensureContract (type, double, call, outcomes) {
  switch (type) {
    case 'thenReturn':
      thenReturn(double, call, outcomes)
      break
    case 'thenCallback':
      thenCallback(double, call, outcomes)
      break
    case 'thenThrow':
      thenThrow(double, call, outcomes)
      break
    case 'thenResolve':
      thenResolve(double, call, outcomes)
      break
    case 'thenReject':
      thenReject(double, call, outcomes)
      break
    case 'thenDo':
      log.warn('td.contract', `\nContract for a thenDo scenario cannot be validated.\n`
      + `Please use td.when instead in order to avoid the false sense of security syndrome.\n`)
      break
  }
}
