import "./globals.css";

export const metadata = {
  title: "AI Lesson Planner",
  description: "Generate lesson plans and teaching materials in seconds",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
