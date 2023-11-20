import { useState } from "react";
import styles from "@/styles/chat.module.css";
import Header from "@/components/Header";
import useFemGPT from "@/utils/useFemGPT";
import ErrorScreen from "@/components/ErrorScreen";

const Chat = () => {
  const { sendMessage, conversations, error, bottomRef } = useFemGPT();
  const [userMessage, setUserMessage] = useState<string>("");

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserMessage(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      sendMessage(userMessage).then((_) => setUserMessage(""));
  };

  if (error.length != 0) return <ErrorScreen error={error} />;

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
};

export default Chat;
