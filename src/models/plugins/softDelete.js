module.exports = (schema) => {
  schema.add({
    deleted: {
      $type: Boolean,
      default: false,
    },
  })

  schema.pre(['find', 'findOne'], function () {
    this.where({ deleted: false })
  })

  schema.methods.delete = function () {
    this.deleted = true
    this.save()
  }

  schema.methods.restore = function () {
    this.deleted = false
    this.save()
  }
}
