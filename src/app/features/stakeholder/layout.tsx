import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Scale - Engage and Align Your Stakeholders",
  description:
    "Build trust and ensure alignment with key stakeholders by effectively managing their expectations and involvement in your project.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/backlog",
    description:
      "Build trust and ensure alignment with key stakeholders by effectively managing their expectations and involvement in your project.",
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
