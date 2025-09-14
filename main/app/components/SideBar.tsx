
"use client";
import { 
  FaBook, 
  FaCalendarDays, 
  FaChevronDown, 
  FaChevronRight, 
  FaPlus,
  FaLock,
  FaHeart
} from "react-icons/fa6";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const [listsOpen, setListsOpen] = useState(true);
  const [lists, setLists] = useState<{ id: string; name: string }[]>([
    { id: "favorite", name: "Favorite" },
    { id: "arrays", name: "arrays n strings" }
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
    <nav className="flex flex-col h-full text-foreground">
      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        <a href="/dance" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          <FaBook className="w-4 h-4" />
          Library
        </a>
        <a href="/dance/study-plan" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          <FaCalendarDays className="w-4 h-4" />
          Study Plan
        </a>
      </div>

      {/* My Lists Section */}
      <div className="px-4 pb-4">
        <div
          className="flex items-center justify-between cursor-pointer group px-3 py-2 text-sm font-medium"
          onClick={() => setListsOpen((open) => !open)}
        >
          <span className="text-foreground">My Lists</span>
          <div className="flex items-center gap-1">
            {listsOpen ? (
              <FaChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <FaChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
            <FaPlus
              className="w-3 h-3 ml-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
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
                className="flex items-center gap-3 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md transition-colors group"
              >
                {list.id === "favorite" ? (
                  <FaHeart className="w-3 h-3" />
                ) : (
                  <FaLock className="w-3 h-3" />
                )}
                <span className="truncate">{list.name}</span>
              </a>
            ))}
            {adding && (
              <div className="px-3">
                <input
                  ref={inputRef}
                  className="w-full text-sm px-2 py-1 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onClick={e => e.stopPropagation()}
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
