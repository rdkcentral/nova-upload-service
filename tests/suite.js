const globby = require('globby')

globby(['**/**.test.js']).then(function (files) {
  files
    .filter(function (file) {
      return !/^node_modules/i.test(file)
    })
    .sort(function (a, b) {
      return parseInt(a.split('/').pop()) < parseInt(b.split('/').pop())
        ? -1
        : 1
    })
    .forEach(function (file) {
      import('../' + file)
    })
})
