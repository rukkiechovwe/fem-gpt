import { useEffect, useRef, useState } from "react";
import { v4 as uniqueId } from "uuid";
import { Message, OpenAIConfig, OpenAIRole } from "@/types";
import styles from "@/styles/chat.module.css";
import Header from "@/components/Header";

const initialPrompt: Message[] = [
  {
    id: uniqueId(),
    role: OpenAIRole.system,
    text: "You're FemGPT, A female health advisor. Please only provide answers related to female health",
  },
  {
    id: uniqueId(),
    role: OpenAIRole.user,
    text: "Introduce yourself briefly",
  },
];

export default function Chat() {
  const bottomRef = useRef(null);
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
        if (json.is_not_done_typing) {
          askFemGPT(latestConversation);
        }
      } else {
        setError(json.error ?? "Something went wrong");
      }
    } catch (e: any) {
      setError(e.error ?? "Something went wrong");
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

  const scrollToBottom = () => {
    if (bottomRef.current) {
      // @ts-ignore
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    askFemGPT(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

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
    <div className={styles.chat}>
      <Header />
      {/* <div className="flex flex-col my-2 p-4 overflow-auto h-full scroll"> */}
      <div className="flex flex-col p-4 gap-3">
        {conversation.slice(2).map((msg, key) => (
          <div
            ref={key > 2 ? bottomRef : null}
            className={
              msg.role === "system" || msg.role === "assistant"
                ? styles.system
                : styles.user
            }
            key={key}
          >
            {msg.text.split("\n").map((item, index) => (
              <p className="mb-2 text-sm " key={index}>
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.type_message}>
        <div>
          <input
            value={userMessage}
            onChange={handleType}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Write a reply"
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
    </div>
  );
}
