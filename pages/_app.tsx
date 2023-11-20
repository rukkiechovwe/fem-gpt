import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ConversationProvider } from "@/context/conversationContext";
import { AuthContextProvider } from "@/context/authContext";
import Scaffold from "@/components/Scaffold";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <ConversationProvider>
        <Scaffold>
          <Component {...pageProps} />
        </Scaffold>
        <Analytics />
      </ConversationProvider>
    </AuthContextProvider>
  );
}
