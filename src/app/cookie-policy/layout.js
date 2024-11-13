export const metadata = {
  title: "Scale - Cookie Policy",
  description:
    "Learn about Scale's use of cookies and how we manage your data to enhance your browsing experience and ensure privacy.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/cookie-policy",
    description:
      "Explore Scale's Cookie Policy to understand how we use cookies to improve your experience and protect your privacy.",
    siteName:
      "Scale - Effortlessly organize, prioritize, and track all your project tasks in one place",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}