import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/config/db';

let token = '';

describe('auth flow', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('alice@example.com');
    expect(res.body.data.token).toBeTruthy();
    token = res.body.data.token;
  });

  it('logs in an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
  });

  it('returns current user for a valid JWT', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('alice@example.com');
  });
});
