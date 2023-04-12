export enum OpenAIRole {
  system = "system",
  assistant = "assistant",
  user = "user",
}

export interface Message {
  id: string;
  text: string;
  sent_at?: number;
  is_typing?: boolean;
  role: OpenAIRole;
}

export type OpenAIConfig = {
  model: string;
  temperature: number;
  max_tokens: number;
  number_of_completions: number;
};
