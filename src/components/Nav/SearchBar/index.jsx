import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const SearchBar = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const searchRef = useRef(null);
  useOnClickOutside(searchRef, () => {
    setItems([]);
  });

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has("query")) {
      setSearch(params.get("query"));
    } else {
      setSearch("");
    }
  }, [searchParams]);

  const fetchItems = async () => {
    setLoading(true);
    setItems([]);
    const { data, error } = await supabase
      .from("Argument")
      .select("title")
      .ilike("title", `%${search}%`)
      .limit(5);
    setLoading(false);
    if (error) {
      console.error("Error fetching search suggestions", error);
    } else {
      setItems(data.map((item) => ({ label: item.title, value: item.title })));
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchItemsDebounced = useCallback(debounce(fetchItems, 300), []);

  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    replace(`${location.origin}?${params.toString()}`);
  }

  return (
    <Command loop className="border bg-transparent " ref={searchRef}>
      <CommandInput
        placeholder="Search framework..."
        className="h-9"
        value={search}
        onValueChange={(value) => {
          setSearch(value);
          if (value.length > 0) {
            fetchItemsDebounced();
          } else {
            setItems([]);
          }
        }}
      />
      <CommandList
        className={cn(
          "absolute top-full bg-background w-full border shadow-md",
          {
            hidden: !loading && !items.length,
          }
        )}
      >
        {!loading && <CommandEmpty>No results found.</CommandEmpty>}
        {loading && (
          <CommandLoading className="w-full bg-background">
            {Array.from({ length: 3 }).map((_, index) => {
              return <Skeleton key={index} className=" h-6 my-2 mx-1" />;
            })}
          </CommandLoading>
        )}
        <CommandGroup>
          <CommandItem
            key={search}
            value={search}
            onSelect={(currentValue) => {
              setItems([]);
              handleSearch(currentValue);
            }}
          >
            Search for: {search}
          </CommandItem>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(currentValue) => {
                setItems([]);
                handleSearch(currentValue);
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default SearchBar;
