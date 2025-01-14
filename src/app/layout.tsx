import type { Metadata } from "next";
import "./globals.css";
import { firaCode } from "./fonts";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Hackathon Management",
  description:
    "Build a dynamic web application to manage hackathons, empowering users to discover exciting events, create their own hackathons, and seamlessly participate in innovative competitions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${firaCode.className} font-firaCode bg-gray-950 text-white antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
