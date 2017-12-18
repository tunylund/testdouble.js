let when, subject
module.exports = {
  beforeEach: () => {
    when = td.replace('../../../src/when/index').default
    subject = require('../../../src/contract/index').default
  },
  after: td.reset(),
  'calls when with ensureContract option': () => {
    const result = subject('_fake rehearsal arg_', {'some': 'option'})
    td.verify(when('_fake rehearsal arg_', {'some': 'option', ensureContract: true}));
  }
}
