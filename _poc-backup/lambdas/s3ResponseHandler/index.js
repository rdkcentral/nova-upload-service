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

/*
 * This function is used to modify the origin response as a Lambda@Edge function.
 * It is triggered on Cloudfront's Origin Response event.
 */
exports.handler = async (event) => {
  const request = event.Records[0].cf.request
  const response = event.Records[0].cf.response
  const statusCode = response.status
  const subdomain = request.uri.split('/')[2]
  const domain = `${subdomain}.{process.env.CDN_DOMAIN}`
  const uriRegex = /^\/apps\/[a-z0-9]+(\/index\.html|\/)$/g

  // Check if the status code is 4xx and the request is for / or /index.html
  if (statusCode >= 400 && statusCode < 500 && uriRegex.test(request.uri)) {
    response.status = '302'
    response.statusDescription = 'Found'
    response.headers['location'] = [
      {
        key: 'Location',
        value: `https://${domain}/latest/index.html`,
      },
    ]
  }
  return response
}
