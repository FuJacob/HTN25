"use client";
import {
  FaBook,
  FaCalendarDays,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaLock,
  FaHeart,
  FaPeace,
  FaBacon,
  FaUpload,
} from "react-icons/fa6";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SideBarProps {
  onUploadClick?: () => void;
}

export default function SideBar({ onUploadClick }: SideBarProps) {
  const [listsOpen, setListsOpen] = useState(true);
  const [lists, setLists] = useState<{ id: string; name: string }[]>([
    { id: "favorite", name: "Favorite" },
    { id: "arrays", name: "Want to Learn" },
  ]);
  const [adding, setAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      router.push(`/list/${id}`);
    } else if (e.key === "Escape") {
      setAdding(false);
      setNewListName("");
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file.name);
      // Call the callback to show uploaded content
      onUploadClick?.();
      // You can add your file upload logic here
      // For example, upload to your backend API
    }
  }

  function triggerFileUpload() {
    fileInputRef.current?.click();
  }

  return (
    <nav className="flex flex-col h-full text-gray-900 bg-white">
      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        <Link
          href="/dances"
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FaBook className="w-5 h-5" />
          Library
        </Link>
        <Link
          href="/study-plan"
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FaCalendarDays className="w-5 h-5" />
          Dance Plan
        </Link>
        <button
          onClick={triggerFileUpload}
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors w-full text-left cursor-pointer"
        >
          <FaUpload className="w-5 h-5" />
          Upload Dance
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="video/*,audio/*,.mp4,.mov,.avi,.mp3,.wav"
        />
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
              <Link
                key={list.id}
                href={`/list/${list.id}`}
                className="flex items-center gap-3 px-3 py-2 text-base text-gray-600 hover:text-gray-900 rounded-md transition-colors group"
              >
                {list.id === "favorite" ? (
                  <FaHeart className="w-4 h-4" />
                ) : (
                  <FaBacon className="w-4 h-4" />
                )}
                <span className="truncate">{list.name}</span>
              </Link>
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
