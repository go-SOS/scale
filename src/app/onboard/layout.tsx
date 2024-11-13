import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scale - Onboarding Page",
  description:
    "We need some more details about you to tailor our service to your needs.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/onboard",
    description:
      "We need some more details about you to tailor our service to your needs.",
    siteName: "Scale - Work, Project, and Task Management App",
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
