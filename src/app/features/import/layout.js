export const metadata = {
  title: "Scale - Simplify Your Imports with Our Tool",
  description:
    "Streamline your import process and handle complex imports with ease and efficiency.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/import",
    description:
      "Streamline your import process and handle complex imports with ease and efficiency.",
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