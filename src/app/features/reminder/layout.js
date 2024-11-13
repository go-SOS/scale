export const metadata = {
  title: "Scale - Stay on Top of Your Tasks",
  description:
    "With our Reminder feature, you’ll never miss a deadline or important event.",
  openGraph: {
    images: ["https://scale.ac/share.png"],
    type: "website",
    url: "https://scale.ac/features/reminder",
    description:
      "With our Reminder feature, you’ll never miss a deadline or important event.",
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