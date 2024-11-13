export const metadata = {
  title: "Scale - Contact Us",
  description: "Get in touch with the Scale team for support, inquiries, or feedback.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/contact",
    description: "Reach out to the Scale team for any support, inquiries, or feedback.",
    siteName: "Scale - Work, Project and Task Management App.",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
