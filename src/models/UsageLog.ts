import mongoose, { Document, Schema } from 'mongoose';

export interface IUsageLog {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  model: string;
  timestamp: Date;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  status: 'success' | 'error';
  errorCode?: string;
  errorMessage?: string;
  requestId: string;
  provider: string;
  createdAt: Date;
}

const usageLogSchema = new Schema<IUsageLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    latencyMs: {
      type: Number,
      required: true,
    },
    inputTokens: {
      type: Number,
      required: true,
      default: 0,
    },
    outputTokens: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTokens: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'error'],
    },
    errorCode: String,
    errorMessage: String,
    requestId: {
      type: String,
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      default: 'openai',
    },
  },
  {
    timestamps: true,
  },
);

export const UsageLog = mongoose.models.UsageLog || mongoose.model<IUsageLog>('UsageLog', usageLogSchema);
