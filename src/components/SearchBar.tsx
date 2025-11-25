"use client";

import React from "react";
import { Input } from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onSearch, className }) => (
  <div className="w-full max-w-md mx-auto">
    <Input
      type="text"
      placeholder="Search products..."
      value={query}
      onChange={(e) => onSearch(e.target.value)}
      startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      className={className || "rounded-full shadow-lg bg-white/70 backdrop-blur-md dark:bg-gray-800/70"}
    />
  </div>
);
