export const metadata = {
  title: "Scale - Streamline Your Document Workflow",
  description:
    "Manage your documents with ease, ensuring accuracy, consistency, and compliance across all your projects.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/document",
    description:
      "Manage your documents with ease, ensuring accuracy, consistency, and compliance across all your projects.",
    siteName: "Scale - Work, Project and Task management App.",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}