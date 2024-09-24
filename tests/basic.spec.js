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

import { app } from './setup'

describe('Basic tests', () => {
  test('/404 returns 404', async () => {
    const response = await supertest(app).get('/404').expect(404)
    expect(response.body).toEqual({ message: 'Not Found' })
  })

  test('/ returns 404', async () => {
    const response = await supertest(app).get('/').expect(404)
    expect(response.body).toEqual({ message: 'Not Found' })
  })
})
