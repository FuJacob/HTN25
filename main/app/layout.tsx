import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });
import "./globals.css";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import Header from "./components/Header";

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
      <body className={`${montserrat.className} antialiased`}>
        <Auth0Provider>
          <Header />
          <main className="h-[calc(100vh-4rem)] overflow-hidden">{children}</main>
        </Auth0Provider>
      </body>
    </html>
  );
}
