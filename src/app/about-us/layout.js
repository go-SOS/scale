export const metadata = {
  title: "Scale - Learn More About Scale",
  description:
    "Discover what makes Scale the ideal solution for managing your projects.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/product/about-pages",
    description:
      "Discover what makes Scale the ideal solution for managing your projects.",
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
