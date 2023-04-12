import { useEffect, useState } from "react";
import { v4 as uniqueId } from "uuid";
import { Message, OpenAIConfig, OpenAIRole } from "@/types";

const initialPrompt: Message[] = [
  {
    id: uniqueId(),
    role: OpenAIRole.system,
    text: "You're DeleGPT, A 500level course advisor in the department of Computer Engineering, University of Benin.",
  },
  {
    id: uniqueId(),
    role: OpenAIRole.user,
    text: "Introduce yourself briefly",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const askAI = async (messages: Message[]) => {
    const msgId = uniqueId();
    const latestMessages = messages.concat({
      text: "Typing...",
      id: msgId,
      sent_at: Date.now(),
      role: OpenAIRole.assistant,
      is_typing: true,
    });
    setMessages(latestMessages);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        body: JSON.stringify(messages),
      });

      const json = await response.json();

      if (response.ok) {
        console.log(response);

        // setMessages(
        //   latestMessages.map((msg) => {
        //     if (msg.id === msgId) {
        //       msg.text = json.text;
        //       msg.is_typing = false;
        //       return msg;
        //     }
        //     return msg;
        //   })
        // );
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    askAI(initialPrompt);
  }, []);

  return <div>hi</div>;
}
