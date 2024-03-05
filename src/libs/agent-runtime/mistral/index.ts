import {
  ChatCompletionResponseChunk,
  ChatCompletionResponseChunkChoice,
} from '@mistralai/mistralai';
import { MistralStream, StreamingTextResponse } from 'ai';

import { debugStream } from '@/libs/agent-runtime/utils/debugStream';
import { DEBUG_CHAT_COMPLETION } from '@/libs/agent-runtime/utils/env';
import { ChatStreamPayload } from '@/types/openai/chat';

import { LobeRuntimeAI } from '../BaseAI';

export async function* chatStream(
  myRequest: any,
  apiKey: any,
  endpoint: any,
): AsyncGenerator<ChatCompletionResponseChunk> {
  const response = await fetch(endpoint, {
    body: JSON.stringify(myRequest),
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`HTTP error, status = ${response.status}`);
  }
  const jsonResponse = await response.json();

  for (let choice of jsonResponse.data.choices) {
    const chatCompletionResponseChunkChoice: ChatCompletionResponseChunkChoice = {
      delta: {
        content: choice.message?.content,
        role: choice.message?.role,
      },
      finish_reason: choice.finish_reason,
      index: choice.index,
    };

    // @ts-ignore
    const chatCompletionResponseChunk: ChatCompletionResponseChunk = {
      choices: [chatCompletionResponseChunkChoice],
      created: jsonResponse.data.created,
      id: '0',
      model: jsonResponse.data.model,
      object: 'chat.completion.chunk',
    };

    yield chatCompletionResponseChunk;
  }
}

export class LobeMistralAI implements LobeRuntimeAI {
  isNode: boolean;

  private _apiVersion: string;
  private readonly endpoint: string;
  private readonly apiKey: string;
  public baseURL: string | undefined;

  constructor(apiKey: string, endpoint: string, apiVersion: string) {
    this.endpoint = endpoint;
    this._apiVersion = apiVersion;
    // this._llm = oai;
    // this.baseURL = this._llm.baseURL;
    this.apiKey = apiKey;
    this.endpoint = 'https://api.infomaniak.com/1/llm/153';
    this.isNode = true;
  }

  async chat(payload: ChatStreamPayload): Promise<StreamingTextResponse> {
    const myRequest = {
      // "max_new_tokens": payload.max_tokens,
      messages: payload.messages.filter((message) => message.role !== 'system'),
      // "repetition_penalty": payload.presence_penalty,
      system_prompt: payload.messages.find((message) => message.role === 'system')?.content,
      // "temperature": payload.temperature,
      // "top_p": payload.top_p,
    };

    try {
      const response = chatStream(myRequest, this.apiKey, this.endpoint);
      const stream = MistralStream(response);

      const [debug, prod] = stream.tee();

      if (DEBUG_CHAT_COMPLETION) {
        debugStream(debug).catch(console.error);
      }

      return new StreamingTextResponse(prod);
    } catch (error) {
      console.error(error); // Error handling here
      // @ts-ignore
      throw new Error('Error occurred while requesting chat API: ' + error.message);
    }
  }
}
