import React from "react";
import SideBar from "../components/SideBar";

export default function DanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <aside className="w-72 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 sticky top-16">
          <SideBar />
        </aside>
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
