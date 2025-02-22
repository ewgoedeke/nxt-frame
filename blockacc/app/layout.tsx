import HeaderAuth from "@/app/ui/header-auth";
import SideNav from "@/app/ui/dashboard/sidenav";

import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log('***', children)
  
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">

            <div className="relative flex flex-1 w-full">

              <div className="absolute top-5 right-5 flex flex-col items-center">
                <HeaderAuth />
                <hr className="w-full border-gray-300 mt-2" />
              </div>

              <div>
                <SideNav />
              </div>

              <div className="flex flex-col gap-20 max-w-5xl p-5 mx-auto">{children}</div>
            </div>
            
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
