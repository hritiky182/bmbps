import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NRFA BoardConnect | National Road Fund Agency, Zambia",
  description:
    "Enterprise Board Governance & Digital Board Pack Platform for the National Road Fund Agency (NRFA), Republic of Zambia. Compliant with Act No. 13 of 2002.",
  keywords: [
    "NRFA",
    "National Road Fund Agency",
    "Zambia",
    "BoardConnect",
    "Board Management",
    "Digital Board Pack",
    "Governance",
    "Circular Resolutions",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
