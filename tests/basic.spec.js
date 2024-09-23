import { describe, expect, test } from 'vitest'
import supertest from 'supertest'
// import { S3Client } from '@aws-sdk/client-s3'
// import { mockClient } from 'aws-sdk-client-mock'

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

  test('/status returns 200', async () => {
    const response = await supertest(app).get('/status').expect(200)
    expect(response.body).toHaveProperty('status', 'success')
  })
})
