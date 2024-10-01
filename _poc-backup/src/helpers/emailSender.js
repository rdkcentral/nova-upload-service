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

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

/**
 * Persist image to storage bucket at specified key
 * @param {String} bucket  name of the bucket
 * @param {String} key destination of file
 * @param {Buffer} body image buffer
 * @returns a promise
 */
const sendEmail = async (to, subject, htmlBody, txtBody) => {
  try {
    const client = new SESClient({
      region: process.env.AWS_DEFAULT_REGION,
    })
    const input = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: htmlBody,
          },
          Text: {
            Charset: 'UTF-8',
            Data: txtBody,
          },
        },
      },
    }
    const command = new SendEmailCommand(input)
    const result = await client.send(command)
    console.log('Email send successfully', result.MessageId)
    return result
  } catch (error) {
    console.error('Error sending email', error)
    throw new Error('Error sending email')
  }
}

module.exports = {
  sendEmail,
}
