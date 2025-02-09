import type { Metadata } from "next";
import { Inter } from "next/font/google";
import bg from "../../public/bg.jpg";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import Header from "./header";
import { Provider } from "jotai";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        width: "100%",
        height: "100%",
      }}
    >
      <body
        className={
          inter.className + " backdrop-filter backdrop-blur-xl min-h-screen"
        }
      >
        <Provider>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto auto 1fr",
            }}
            className="min-h-screen"
          >
            <Header></Header>
            <Separator></Separator>
            {children}
          </div>
          <Toaster></Toaster>
        </Provider>
      </body>
    </html>
  );
}
