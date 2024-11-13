export const metadata = {
  title: "Scale - Changelog",
  description: "Changelog",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/contact",
    description: "Changelog",
    siteName: "Scale - Changelog.",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
