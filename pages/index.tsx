import { useState } from "react";
import styles from "@/styles/chat.module.css";
import Header from "@/components/Header";
import useFemGPT from "@/utils/useFemGPT";

export default function Chat() {
  const { sendMessage, conversations, error, bottomRef } = useFemGPT();
  const [userMessage, setUserMessage] = useState<string>("");

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserMessage(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      sendMessage(userMessage).then((_) => setUserMessage(""));
  };

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
      <div className={styles.conversations}>
        {conversations?.slice(2).map((msg, key) => (
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
