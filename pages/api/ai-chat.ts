import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi as OpenAI } from "openai";
import { Message, OpenAIConfig } from "@/types";
import { deserialize } from "@/utils/deserialize";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI(configuration);

interface Props {
  text?: string;
  error?: string;
  is_not_done_typing?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Props>
) {
  try {
    const messages: Message[] = deserialize(req.body);
    const response = await openai.createChatCompletion({
      messages: messages.map((msg) => {
        return {
          role: msg.role,
          content: msg.text,
        };
      }),
      model: OpenAIConfig.model,
      temperature: OpenAIConfig.temperature,
      max_tokens: OpenAIConfig.max_tokens,
      n: OpenAIConfig.number_of_completions,
    });

    if (response.status === 200) {
      return res.status(200).json({
        text: response.data.choices[0]?.message?.content,
        is_not_done_typing: response.data.choices[0].finish_reason !== "stop",
      });
    } else {
      return res.status(500).json({ error: response.statusText });
    }
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

const OpenAIConfig: OpenAIConfig = {
  model: "gpt-3.5-turbo",
  temperature: 0.5,
  max_tokens: 64,
  number_of_completions: 1,
};
