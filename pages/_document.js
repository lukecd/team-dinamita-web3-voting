import { CssBaseline } from "@nextui-org/react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [<>{initialProps.styles}</>],
    };
  }

  render() {
    return (
      <Html>
        <Head>
          {CssBaseline.flush()}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <div id="messagePortal" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
