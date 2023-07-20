const test = require('tape')

test('Exit', function (assert) {
  assert.end()
  process.exit()
})
