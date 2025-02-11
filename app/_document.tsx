import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script
          data-embed-id="eaa63ade-d1f7-4d50-ac90-6b5310c8e495"
          data-base-api-url="https://chatai.afrainity.com/api/embed"
          src="https://chatai.afrainity.com/embed/anythingllm-chat-widget.min.js"
        ></script>
      </body>
    </Html>
  );
}