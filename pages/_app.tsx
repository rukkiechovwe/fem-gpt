import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { ConversationProvider } from "@/context/conversationContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConversationProvider>
      <Component {...pageProps} />
      <Analytics />
    </ConversationProvider>
  );
}
