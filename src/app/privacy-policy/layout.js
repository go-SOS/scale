export const metadata = {
  title: "Scale - Privacy Policy Page",
  description:
    "Learn about how Scale handles your data with our Privacy Policy.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/privacy-policy",
    description:
      "Learn about how Scale handles your data with our Privacy Policy.",
    siteName: "Scale - Work, Project, and Task Management App",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}

