
"use client";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";

export default function SideBar() {
  const [listsOpen, setListsOpen] = useState(true);
  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);
  const [adding, setAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useUser();

  // Key for localStorage based on user ID
  const userKey = user?.sub || user?.email || "guest";
  const storageKey = `lists_${userKey}`;

  // Load lists from localStorage on user change
  React.useEffect(() => {
    if (userKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setLists(JSON.parse(stored));
      } else {
        setLists([]);
      }
    }
  }, [userKey]);

  // Save lists to localStorage when lists change
  React.useEffect(() => {
    if (userKey) {
      localStorage.setItem(storageKey, JSON.stringify(lists));
    }
  }, [lists, userKey]);

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
    <nav className="flex flex-col h-full p-6 gap-4">
      <div className="flex flex-col gap-2">
        <a href="#" className="font-semibold text-lg hover:underline">Library</a>
        <a href="#" className="font-semibold text-lg hover:underline">Study Plan</a>
      </div>
      <hr className="my-4 border-gray-200" />
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setListsOpen((open) => !open)}
        >
          <span className="font-semibold text-md">My Lists</span>
          <div className="flex items-center gap-1">
            {listsOpen ? (
              <ChevronDown className="w-4 h-4 group-hover:text-primary transition" />
            ) : (
              <ChevronRight className="w-4 h-4 group-hover:text-primary transition" />
            )}
            <Plus
              className="w-4 h-4 ml-2 hover:text-primary cursor-pointer"
              onClick={handleAddList}
            />
          </div>
        </div>
        {listsOpen && (
          <div className="ml-4 mt-2 flex flex-col gap-1">
            {lists.map((list) => (
              <a
                key={list.id}
                href={`/dance/list/${list.id}`}
                className="text-sm text-gray-700 hover:underline"
              >
                {list.name}
              </a>
            ))}
            {adding && (
              <input
                ref={inputRef}
                className="text-sm px-2 py-1 border rounded mt-1 outline-none"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onClick={e => e.stopPropagation()}
                placeholder="New list name"
              />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
