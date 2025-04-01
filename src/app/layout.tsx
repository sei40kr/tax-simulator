import type { Metadata, Viewport } from "next";
import "../../styled-system/index.css";
import { Provider } from "@/components/ui/provider";

export const metadata: Metadata = {
  title: "Tax Simulator",
  description: "A simulator for Japanese freelancers to calculate taxes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
