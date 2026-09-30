import { z } from 'zod';

export const chatSchema = z.object({
  model: z.string().min(1),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1),
      }),
    )
    .min(1),
  temperature: z.number().min(0).max(2).optional(),
});

export const analyzeSchema = z.object({
  model: z.string().min(1),
  input: z.string().min(1),
  schema: z.record(z.string(), z.any()),
});
