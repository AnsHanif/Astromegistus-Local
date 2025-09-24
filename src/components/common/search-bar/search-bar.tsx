'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onSearch: (value: string) => void; // callback for parent
  className?: string; // extra tailwind classes
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  value,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    // Call onSearch immediately for real-time search
    if (onSearch) onSearch(newValue.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border pl-10 text-gray-700  focus:ring-0 focus:border-black border-black focus:outline-none placeholder-gray-400 transition"
      />
    </form>
  );
}
