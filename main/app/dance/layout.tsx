import React from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

export default function DanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="sticky top-0 h-[calc(100vh-72px)] w-64 bg-white border-r flex flex-col">
          <SideBar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
