export const metadata = {
  title: "Scale - Plan Your Project's Journey with the Roadmap",
  description:
    "Outline your project's strategic direction and key milestones with a clear, visual roadmap.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/roadmap",
    description:
      "Outline your project's strategic direction and key milestones with a clear, visual roadmap.",
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