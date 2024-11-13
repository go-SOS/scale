
export const metadata = {
  title:
    "Scale - Effortlessly organize, prioritize, and track all your project tasks in one place",
  description:
    "Effortlessly organize, prioritize, and track all your project tasks in one place",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/backlog",
    description:
      "Effortlessly organize, prioritize, and track all your project tasks in one place",
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
