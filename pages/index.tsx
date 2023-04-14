import { useEffect, useMemo, useState } from "react";
import { v4 as uniqueId } from "uuid";
import { Message, OpenAIConfig, OpenAIRole } from "@/types";
import styles from "@/styles/chat.module.css";

const initialPrompt: Message[] = [
  {
    id: uniqueId(),
    role: OpenAIRole.system,
    text: "You're FemGPT, A female health advisor, I give reliable information about a woman's physical and emotional well-being.",
  },
  {
    id: uniqueId(),
    role: OpenAIRole.user,
    text: "Introduce yourself briefly",
  },
];

export default function Chat() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const askFemGPT = async (conversation: Message[]) => {
    const msgId = uniqueId();
    const latestConversation = conversation.concat({
      text: "Typing...",
      id: msgId,
      sent_at: Date.now(),
      role: OpenAIRole.assistant,
      is_typing: true,
    });
    setConversation(latestConversation);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        body: JSON.stringify(conversation),
      });

      const json = await response.json();

      if (response.ok) {
        console.log(json);

        setConversation(
          latestConversation.map((msg) => {
            if (msg.id === msgId) {
              msg.text = json.text;
              msg.is_typing = false;
              return msg;
            }
            return msg;
          })
        );
      } else {
        console.log(json);
        setError(json.error ?? "Something went wrong");
      }
    } catch (e: any) {
      console.log(e);
      setError(e.message ?? "Something went wrong");
    }
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserMessage(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      sendMessage(userMessage).then((_) => setUserMessage(""));
  };

  const sendMessage = async (message: string) => {
    // check if message is empty, if empty prompt the user to type something else
    if (message.length < 3) return;
    const msg: Message = {
      id: uniqueId(),
      role: OpenAIRole.user,
      sent_at: Date.now(),
      text: message,
    };
    const latestConversation = conversation.concat(msg);
    setConversation(latestConversation);
    await askFemGPT(latestConversation);
  };

  useMemo(() => askFemGPT(initialPrompt), []);

  if (error.length != 0)
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-medium">{error}</h1>
        <button
          className="bg-primary text-white font-sm px-3 py-1.5 rounded mt-8"
          style={{ background: "#be6db7" }}
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );

  return (
    <div className="relative min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex flex-col">
        {conversation.slice(2).map((msg, key) => (
          <div
            className={`mb-2 ${
              msg.role === "system" || msg.role === "assistant"
                ? styles.system
                : styles.user
            }`}
            key={key}
          >
            {msg.text.split("\n").map((item, index) => (
              <p className="mb-2" key={index}>
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* type message */}
      <div className={styles.type_message}>
        <input
          value={userMessage}
          onChange={handleType}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Write a reply"
          className=""
        />
        <button
          onClick={() =>
            sendMessage(userMessage).then((_) => setUserMessage(""))
          }
        >
          Send
        </button>
      </div>
    </div>
  );
}
