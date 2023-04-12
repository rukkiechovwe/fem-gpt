import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <title>FemGPT</title> */}
        <meta name="robots" content="follow, index" />
        {/* <link href="/assets/icon.png" rel="shortcut icon" /> */}
        <meta content="Female AI health advisor" name="description" />
        {/* <meta property="og:url" content="https://dele-gpt.vercel.app/" /> */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FemGPT" />
        <meta property="og:description" content="Female AI health advisor" />
        <meta property="og:title" content="FemGPT" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
