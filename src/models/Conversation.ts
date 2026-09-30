import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  model: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant', 'system'],
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

export const Conversation =
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);
