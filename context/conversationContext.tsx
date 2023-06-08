import { ReactNode, createContext, useReducer, Dispatch } from "react";
import { Message } from "@/types";

const initialState = {
  conversations: [],
};

const HANDLERS = {
  CHAT: "CHAT",
} as const;

type ActionPayload = {
  conversations: Message[];
};

type Action = {
  type: keyof typeof HANDLERS;
  payload: ActionPayload;
};

const ConversationContext = createContext<{
  conversations: Message[];
  dispatch: Dispatch<Action>;
}>({
  conversations: [],
  dispatch: () => null,
});

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
        conversations: state.conversations,
        dispatch,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export { ConversationContext, ConversationProvider };
