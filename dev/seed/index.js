const { seed: seedDocument } = require('./document.js')

const run = async () => {
  await seedDocument()
  process.exit(1)
}

run()
