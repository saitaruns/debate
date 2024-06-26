import React, { useCallback, useEffect, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SearchIcon } from "lucide-react";
import { useClickAway } from "@uidotdev/usehooks";

const supabase = createClient();
const SearchBar = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [items, setItems] = useState([]);
  const [sugOpen, setSugOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const searchRef = useClickAway(() => {
    setSugOpen(false);
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has("query")) {
      setSearch(params.get("query"));
    } else {
      setSearch("");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isTyping) {
      setSugOpen(true);
      setItems([]);
    }
  }, [isTyping]);

  const fetchItems = async (query) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Argument")
      .select("title")
      .ilike("title", `%${query.trim()}%`)
      .limit(5);
    setLoading(false);
    if (error) {
      console.error("Error fetching search suggestions", error);
    } else {
      setItems([
        ...data.map((item) => ({
          label: item.title,
          value: item.title,
        })),
      ]);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchItemsDebounced = useCallback(
    debounce((query) => {
      fetchItems(query);
      setIsTyping(false);
    }, 300),
    []
  );

  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    replace(`${location.origin}/home?${params.toString()}`);
  }

  const handleSelect = (value) => {
    setSugOpen(false);
    setSearch(value);
    handleSearch(value);
  };

  return (
    <Command loop className="border bg-transparent" ref={searchRef}>
      <CommandInput
        placeholder="Search"
        className="h-9"
        value={search}
        onValueChange={(value) => {
          setSearch(value);
          setIsTyping(true);
          if (value.length > 0) {
            fetchItemsDebounced(value);
          }
        }}
        onFocus={() => setSugOpen(true)}
      />
      <CommandList
        className={cn(
          "absolute top-full bg-background w-full border shadow-lg rounded-md",
          "h-[var(--cmdk-list-height)] transition-[height] duration-75 ease-in-out",
          {
            hidden: !sugOpen || search.length === 0,
          }
        )}
      >
        <CommandGroup
          className={cn("p-0 ", {
            hidden: search.length === 0,
          })}
        >
          <CommandItem
            className="px-3 rounded"
            key={search}
            value={search}
            onSelect={handleSelect}
          >
            <SearchIcon className="size-3 mr-2 text-slate-400" />
            Search for: {search}
          </CommandItem>
        </CommandGroup>
        {(isTyping || loading) && (
          <CommandLoading>
            <div className="space-y-2 p-2 pb-3">
              <Skeleton className={cn("h-5 mx-1 rounded-full w-9/12")} />
              <Skeleton className={cn("h-5 mx-1 rounded-full w-8/12")} />
              <Skeleton className={cn("h-5 mx-1 rounded-full w-11/12")} />
            </div>
          </CommandLoading>
        )}
        <CommandGroup className="p-0" heading="Suggestions">
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={handleSelect}
              className="px-3 rounded-none"
            >
              <SearchIcon className="size-3 mr-2 text-slate-400" />
              <span
                className="truncate max-w-[calc(100%-2rem)]"
                title={item.label}
              >
                {item.label}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default SearchBar;
