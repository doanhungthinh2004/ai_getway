export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ProviderChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
}

export interface ProviderUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface ProviderChatResponse {
  message: {
    role: 'assistant';
    content: string;
  };
  model: string;
  usage: ProviderUsage;
}

export interface AIProvider {
  chat(request: ProviderChatRequest): Promise<ProviderChatResponse>;
  analyze(request: { model: string; input: string; schema: Record<string, unknown> }): Promise<Record<string, unknown>>;
}
