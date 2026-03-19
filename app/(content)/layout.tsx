import type { ReactNode } from "react";

import { Footer } from "@/widgets/layout/footer";
import { Header } from "@/widgets/layout/header";

interface ContentLayoutProps {
  children: ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
