import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Scale - Time Tracking Made Easy",
  description:
    "Our Timer feature helps you keep track of time spent on tasks, ensuring accurate billing, productivity tracking.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/backlog",
    description:
      "Our Timer feature helps you keep track of time spent on tasks, ensuring accurate billing, productivity tracking.",
    siteName: "Scale - Work, Project and Task management App.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
