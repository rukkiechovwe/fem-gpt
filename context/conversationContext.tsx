import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { v4 as uniqueId } from "uuid";
import { Message, OpenAIRole } from "@/types";

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

const initialState = {
  conversations: initialPrompt,
};

const ConversationContext = createContext({
  conversations: initialPrompt,
});

const HANDLERS = {
  CHAT: "CHAT",
} as const;

type ActionPayload = {
  conversations?: Message[];
};

type Action = {
  type: keyof typeof HANDLERS;
  payload: ActionPayload;
};

const reducer = (state: any, action: Action) => {
  const { conversations } = action.payload;

  switch (action.type) {
    case HANDLERS.CHAT:
      // console.log('conversations in context', conversations);
      return {
        ...state,
        conversations,
      };

    default:
      throw new Error("Something went wrong");
  }
};

const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ConversationContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export { ConversationContext, ConversationProvider };
