/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2024 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
import { describe, expect, test } from 'vitest'
import supertest from 'supertest'

import { app, token } from '../../../tests/setup'

const falseDocumentId = '66f406134efbc26c04d40ccb'
const shortDocumentId = '66f406134efbc26c04d40cc'
let documentId

describe('GET /admin/signeddocuments', () => {
  test('Get latest signed document', async () => {
    const response = await supertest(app)
      .get('/admin/signeddocuments')
      .expect(200)
    expect(response.body).toHaveProperty('status', 'success')

    documentId = response.body.data.id
  })
})

describe('POST /admin/signeddocuments/sign', () => {
  test('Return 403 when signing a document without a token', async () => {
    await supertest(app)
      .post('/admin/signeddocuments/sign')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        documentId,
        company: 'RDK',
      })
      .expect(403)
  })

  test('Return 404 when signing a document with a false documentId', async () => {
    await supertest(app)
      .post('/admin/signeddocuments/sign')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        documentId: falseDocumentId,
        company: 'RDK',
      })
      .expect(404)
  })

  test('Return 400 when signing a document with a short documentId', async () => {
    await supertest(app)
      .post('/admin/signeddocuments/sign')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        documentId: shortDocumentId,
        company: 'RDK',
      })
      .expect(400)
  })

  test('Sign a document', async () => {
    const response = await supertest(app)
      .post('/admin/signeddocuments/sign')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        documentId,
        company: 'RDK',
      })
      .expect(201)
    expect(response.body).toHaveProperty('status', 'success')
  })
})
