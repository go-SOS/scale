import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Scale - Build and Empower Your Team",
  description:
    "Manage your team efficiently, assign roles, and collaborate effectively to achieve your project goals.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/backlog",
    description:
      "Manage your team efficiently, assign roles, and collaborate effectively to achieve your project goals.",
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
