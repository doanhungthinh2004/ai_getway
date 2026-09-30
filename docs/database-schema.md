# Database Schema

## users

Collection: `users`

Fields:
- `_id`: ObjectId
- `email`: string, unique, indexed
- `passwordHash`: string
- `name`: string
- `createdAt`: Date
- `updatedAt`: Date

Purpose:
- Store authenticated client identities.

## conversations

Collection: `conversations`

Fields:
- `_id`: ObjectId
- `userId`: ObjectId, indexed
- `title`: string
- `model`: string
- `messages`: array of { role, content, createdAt }
- `createdAt`: Date
- `updatedAt`: Date

Purpose:
- Persist AI chats per user.

## usage_logs

Collection: `usage_logs`

Fields:
- `_id`: ObjectId
- `userId`: ObjectId, indexed
- `model`: string
- `timestamp`: Date, indexed
- `latencyMs`: number
- `inputTokens`: number
- `outputTokens`: number
- `totalTokens`: number
- `status`: success | error
- `errorCode`: string
- `errorMessage`: string
- `requestId`: string
- `provider`: string
- `createdAt`: Date

Purpose:
- Track AI request performance and usage metrics.
