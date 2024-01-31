/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
