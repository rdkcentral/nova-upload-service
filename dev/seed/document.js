if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const { signedDocument } = require('../../mocks/document.js')
const {
  model: SignedDocumentModel,
} = require('../../src/models/SignedDocument.js')

const seed = async () => {
  try {
    const result = await SignedDocumentModel.create(signedDocument)

    console.log('Document seeded:')
    console.log(result)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  seed,
}
