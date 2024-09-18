/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC
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
