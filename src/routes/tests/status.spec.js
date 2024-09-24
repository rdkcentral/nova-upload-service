import { describe, expect, test } from 'vitest'
import supertest from 'supertest'

import { app } from '../../../tests/setup'

describe('GET /status', () => {
  test('Status returns 200', async () => {
    const response = await supertest(app).get('/status').expect(200)
    expect(response.body).toHaveProperty('status', 'success')
  })
})
