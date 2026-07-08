import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header />

          <main className="min-w-0 flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
            {children}
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}