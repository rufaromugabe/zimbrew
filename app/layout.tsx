import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Zim Brew",
  description: "Get your favorite coffee at Zim Brew",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <script
          data-embed-id="eaa63ade-d1f7-4d50-ac90-6b5310c8e495"
          data-base-api-url="https://chatai.afrainity.com/api/embed"
          src="https://chatai.afrainity.com/embed/anythingllm-chat-widget.min.js"
        ></script>
      </body>
    </html>
  )
}

