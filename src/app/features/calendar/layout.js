export const metadata = {
  title: "Scale - Master Your Schedule with Calendar",
  description:
    "Seamlessly organize your tasks, meetings, and deadlines with a powerful calendar tool designed for productivity.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/calendar",
    description:
      "Seamlessly organize your tasks, meetings, and deadlines with a powerful calendar tool designed for productivity.",
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