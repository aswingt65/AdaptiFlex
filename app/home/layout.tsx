import Header from './_components/header';
import Footer from './_components/footer';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adaptiflex-Home",
  description: "All-In-One Collaboration and Productivity Platform",
};

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
};
