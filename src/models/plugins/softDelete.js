module.exports = (schema) => {
  schema.add({
    deleted: {
      $type: Boolean,
      default: false,
    },
  })

  schema.pre(['find', 'findOne'], function () {
    if (!this.options.skipDeletedCheck) {
      this.where({ deleted: false })
    }
  })

  schema.statics.delete = function (query) {
    return this.findOneAndUpdate(query, { deleted: true }, { new: true })
  }

  schema.statics.restore = function (query) {
    return this.findOneAndUpdate(query, { deleted: false }, { new: true })
  }

  schema.statics.findDeleted = function (query) {
    return this.find(query, null, { skipDeletedCheck: true })
  }
}
