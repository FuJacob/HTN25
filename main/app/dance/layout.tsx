import React from "react";
import SideBar from "../components/SideBar";

export default function DanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 h-[calc(100vh-4rem)] bg-background border-r border-border sticky top-16">
          <SideBar />
        </aside>
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
