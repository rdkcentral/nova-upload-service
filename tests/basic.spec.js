import { beforeAll, describe, afterAll, expect, test } from 'vitest'
import supertest from 'supertest'
// import { S3Client } from '@aws-sdk/client-s3'
// import { mockClient } from 'aws-sdk-client-mock'

import { initApp } from './setup'

// mockClient(S3Client)

let app

describe('Basic tests', () => {
  beforeAll(async () => {
    app = await initApp()
  })

  test('/404 returns 404', async () => {
    const response = await supertest(app).get('/404').expect(404)
    expect(response.body).toEqual({ message: 'Not Found' })
  })

  test('/ returns 404', async () => {
    const response = await supertest(app).get('/').expect(404)
    expect(response.body).toEqual({ message: 'Not Found' })
  })

  test('/status returns 200', async () => {
    const response = await supertest(app).get('/status').expect(200)
    expect(response.body).toHaveProperty('status', 'success')
  })

  afterAll(() => {
    app = null
  })
})
