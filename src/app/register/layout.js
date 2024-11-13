export const metadata = {
  title: "Scale - Sign Up and Get Started",
  description:
    "Join Scale today and take the first step towards seamless project management.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/register",
    description:
      "Create your Scale account and start organizing, prioritizing, and tracking your projects effortlessly.",
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