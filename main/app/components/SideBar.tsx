"use client";
import {
  FaBook,
  FaCalendarDays,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaLock,
  FaHeart,
} from "react-icons/fa6";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const [listsOpen, setListsOpen] = useState(true);
  const [lists, setLists] = useState<{ id: string; name: string }[]>([
    { id: "favorite", name: "Favorite" },
    { id: "arrays", name: "arrays n strings" },
  ]);
  const [adding, setAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (adding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adding]);

  function handleAddList(e: React.MouseEvent) {
    e.stopPropagation();
    setAdding(true);
    setListsOpen(true);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && newListName.trim()) {
      const id = Date.now().toString();
      setLists((prev) => [...prev, { id, name: newListName.trim() }]);
      setAdding(false);
      setNewListName("");
      router.push(`/dance/list/${id}`);
    } else if (e.key === "Escape") {
      setAdding(false);
      setNewListName("");
    }
  }

  return (
    <nav className="flex flex-col h-full text-gray-900 bg-white">
      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        <a
          href="/dance"
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FaBook className="w-5 h-5" />
          Library
        </a>
        <a
          href="/dance/study-plan"
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FaCalendarDays className="w-5 h-5" />
          Study Plan
        </a>
      </div>

      {/* My Lists Section */}
      <div className="px-4 pb-4">
        <div
          className="flex items-center justify-between cursor-pointer group px-3 py-3 text-base font-medium"
          onClick={() => setListsOpen((open) => !open)}
        >
          <span className="text-gray-900">My Lists</span>
          <div className="flex items-center gap-1">
            {listsOpen ? (
              <FaChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
            ) : (
              <FaChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
            )}
            <FaPlus
              className="w-4 h-4 ml-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
              onClick={handleAddList}
            />
          </div>
        </div>
        {listsOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {lists.map((list) => (
              <a
                key={list.id}
                href={`/dance/list/${list.id}`}
                className="flex items-center gap-3 px-3 py-2 text-base text-gray-600 hover:text-gray-900 rounded-md transition-colors group"
              >
                {list.id === "favorite" ? (
                  <FaHeart className="w-4 h-4" />
                ) : (
                  <FaLock className="w-4 h-4" />
                )}
                <span className="truncate">{list.name}</span>
              </a>
            ))}
            {adding && (
              <div className="px-3">
                <input
                  ref={inputRef}
                  className="w-full text-base px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-tiktok-red focus:border-tiktok-red"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="New list name"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
