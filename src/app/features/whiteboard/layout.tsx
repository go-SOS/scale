import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Scale - Visualize and Collaborate with the Whiteboard",
  description:
    "Brainstorm ideas, plan projects, and visualize your workflow with an interactive, collaborative whiteboard.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/backlog",
    description:
      "Brainstorm ideas, plan projects, and visualize your workflow with an interactive, collaborative whiteboard.",
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
