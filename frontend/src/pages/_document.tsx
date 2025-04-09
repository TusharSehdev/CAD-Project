import { Html, Head, Main, NextScript } from "next/document";
import { getBlockerScript } from "../utils/bitdefenderBlocker";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Priority script that runs before any other scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: getBlockerScript(),
          }}
        />

        {/* Add a meta tag with CSP to block BitDefender scripts */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'; frame-src 'self'; frame-ancestors 'self';"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
