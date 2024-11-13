export const metadata = {
  title: "Scale - Find What Matters with Advanced Filters",
  description:
    "Quickly locate the information you need by applying precise filters to your project data.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/filter",
    description:
      "Quickly locate the information you need by applying precise filters to your project data.",
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