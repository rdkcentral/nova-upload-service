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

import { beforeAll, describe, expect, test } from 'vitest'
import supertest from 'supertest'

import { applicationForVersion as application } from '../../../mocks/application'
import { app, token } from '../../../tests/setup'

let applicationId, applicationVersionId

describe('POST /admin/applications/:appId/versions', () => {
  beforeAll(async () => {
    // Create an application to use in the tests
    const response = await supertest(app)
      .post('/admin/applications')
      .set('Authorization', `Bearer ${token}`)
      .send(application)
      .expect(201)

    applicationId = response.body.data.id
  })

  test('Creating an new application version', async () => {
    const version = '1.0.0'
    const changelog = 'Made the app 10x more awesome!!'
    const response = await supertest(app)
      .post(`/admin/applications/${applicationId}/versions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        version,
        changelog,
      })
      .expect(201)

    expect(response.body.data.version).toBe(version)
    expect(response.body.data.changelog).toBe(changelog)
    expect(response.body.data.applicationId).toBe(applicationId)

    applicationVersionId = response.body.data.id
  })
})

describe('GET /admin/applications/:appId/versions', () => {
  test('Retrieve versions of an application', async () => {
    const response = await supertest(app)
      .get(`/admin/applications/${applicationId}/versions`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.data.length).toBeGreaterThan(0)
  })
})

describe('GET /admin/applications/:appId/versions/:applicationVersionId', () => {
  test('Retrieve a single application version', async () => {
    const response = await supertest(app)
      .get(
        `/admin/applications/${applicationId}/versions/${applicationVersionId}`
      )
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.data.id).toBe(applicationVersionId)
  })
})

describe('PUT /admin/applications/:appId/versions/:applicationVersionId', () => {
  test('Update an application version', async () => {
    const response = await supertest(app)
      .put(
        `/admin/applications/${applicationId}/versions/${applicationVersionId}`
      )
      .set('Authorization', `Bearer ${token}`)
      .send({ changelog: 'Updated changelog' })
      .expect(200)

    expect(response.body.data.changelog).toBe('Updated changelog')
  })
})

describe('DELETE /admin/applications/:appId/versions/:applicationVersionId', () => {
  test('Delete an application version', async () => {
    await supertest(app)
      .delete(
        `/admin/applications/${applicationId}/versions/${applicationVersionId}`
      )
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})
