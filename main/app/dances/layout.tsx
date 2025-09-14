import React from "react";
import SideBar from "../components/SideBar";

export default function DanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-4.5rem)] bg-white">
      <div className="flex h-full">
        <aside className="w-72 h-full bg-white border-r border-gray-200 sticky top-16">
          <SideBar />
        </aside>
        <main className="flex-1 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
