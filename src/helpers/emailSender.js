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

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

/**
 * Persist image to storage bucket at specified key
 * @param {String} bucket  name of the bucket
 * @param {String} key destination of file
 * @param {Buffer} body image buffer
 * @returns a promise
 */
const sendEmail = async (to, subject, body) => {
  try {
    const client = new SESClient({
      region: process.env.AWS_DEFAULT_REGION,
    })
    console.log('1')
    const input = {
      // SendEmailRequest
      Source: 'no-reply@custom.fireboltconnect.com', // required
      Destination: {
        // Destination
        ToAddresses: to,
        // CcAddresses: ['STRING_VALUE'],
        // BccAddresses: ['STRING_VALUE'],
      },
      Message: {
        // Message
        Subject: {
          // Content
          Data: subject, // required
          Charset: 'UTF-8',
        },
        Body: {
          // Body
          Text: {
            Data: 'This is the message body in text format.', // required
            Charset: 'UTF-8',
          },
          Html: {
            Data: body, // required
            Charset: 'UTF-8',
          },
        },
      },
    }
    console.log('2')
    const command = new SendEmailCommand(input)
    console.log('3')
    const result = await client.send(command)
    console.log('Email send result', result)
    return result
  } catch (error) {
    console.log('Error sending email', error)
    return null
  }
}

module.exports = {
  sendEmail,
}
