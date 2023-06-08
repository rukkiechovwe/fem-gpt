import { useState, useEffect, useRef, useContext } from "react";
import { v4 as uniqueId } from "uuid";
import { Message, OpenAIRole } from "@/types";
import { ConversationContext } from "@/context/conversationContext";

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

const useFemGPT = () => {
  const bottomRef = useRef(null);
  const { conversations, dispatch } = useContext(ConversationContext);

  const [conversation, setConversation] = useState<Message[]>([]);
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
    dispatch({ type: "CHAT", payload: { conversations: latestConversation } });

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
        dispatch({
          type: "CHAT",
          payload: {
            conversations: latestConversation.map((msg) => {
              if (msg.id === msgId) {
                msg.text = json.text;
                msg.is_typing = false;
                return msg;
              }
              return msg;
            }),
          },
        });

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
    dispatch({
      type: "CHAT",
      payload: {
        conversations: latestConversation,
      },
    });
    await askFemGPT(latestConversation);
  };

  const clearConversation = () => {
    askFemGPT(initialPrompt);
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      // @ts-ignore
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const existingConversations = localStorage.getItem("femGPT_conversations");

    if (existingConversations && existingConversations?.length !== 0) {
      setConversation(JSON.parse(existingConversations));
      dispatch({
        type: "CHAT",
        payload: { conversations: JSON.parse(existingConversations) },
      });
    } else {
      askFemGPT(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (conversation.length > 2) {
      localStorage.setItem(
        "femGPT_conversations",
        JSON.stringify(conversation)
      );
    }
  }, [conversation]);

  return {
    sendMessage,
    clearConversation,
    conversations,
    error,
    bottomRef,
  };
};

export default useFemGPT;
