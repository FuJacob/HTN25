import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
import "./globals.css";
import { Auth0Provider } from "@auth0/nextjs-auth0";

export const metadata: Metadata = {
  title: "2 Sum Dance",
  description: "A platform for dance enthusiasts to connect and collaborate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased`}>
        <Auth0Provider>
          <main className="h-[calc(100vh-4.5rem)]">{children}</main>
        </Auth0Provider>
      </body>
    </html>
  );
}
