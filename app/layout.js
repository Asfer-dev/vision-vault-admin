"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// export const metadata = {
//   title: "Admin - Vision Vault",
//   description: "Vision Vault Store Admin",
// };

export default function RootLayout({ session, children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Admin - Vision Vault</title>
      </head>
      <SessionProvider session={session}>
        <body className="min-h-screen bg-neutral-100/50 font-body">
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
