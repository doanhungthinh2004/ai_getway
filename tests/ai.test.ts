import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/config/db';

let token = '';

describe('AI endpoints', () => {
  beforeAll(async () => {
    await connectDatabase();

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'AI Tester',
        email: 'ai-tester@example.com',
        password: 'password123',
      });

    token = registerRes.body.data.token;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('returns a valid chat response from the gateway', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Explain what an API Gateway is in one sentence.' }],
        temperature: 0.7,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.message.role).toBe('assistant');
    expect(res.body.data.message.content).toBeTruthy();
    expect(res.body.usage.total_tokens).toBeGreaterThan(0);
    expect(res.body.meta.request_id).toBeTruthy();
  });

  it('returns structured output for analyze', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({
        model: 'gpt-4o-mini',
        input: 'The app is fast and easy to use but checkout is confusing.',
        schema: {
          sentiment: 'string',
          score: 'number',
          summary: 'string',
        },
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('sentiment');
    expect(res.body.data).toHaveProperty('score');
    expect(res.body.data).toHaveProperty('summary');
    expect(res.body.meta.request_id).toBeTruthy();
  });
});
