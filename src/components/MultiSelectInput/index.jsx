import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { BiPlusCircle } from "react-icons/bi";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { ViewLink } from "../CounterCard";

const MultiSelectInput = React.forwardRef(
  ({ options, selectedValues, onChange, maxSelected, props }, ref) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const GetButton = () => (
      <Button
        variant="outline"
        type="button"
        size="sm"
        className="h-8 border-dashed flex"
      >
        <BiPlusCircle className="mr-2 h-4 w-4" />
        <span className="hidden lg:block">Add Logical Fallacies</span>
        {selectedValues?.length > 0 && (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal lg:hidden"
            >
              {selectedValues.length}
            </Badge>
            <div className="hidden space-x-1 lg:flex flex-1">
              {selectedValues.length > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedValues.length} selected
                </Badge>
              ) : (
                options
                  .filter((option) => selectedValues.includes(option.value))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        )}
      </Button>
    );

    if (!isDesktop) {
      return (
        <Drawer>
          <DrawerTrigger asChild>{GetButton()}</DrawerTrigger>
          <DrawerContent>
            <CommandBox
              options={options}
              selectedValues={selectedValues}
              onChange={onChange}
              maxSelected={maxSelected}
            />
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Popover {...props} modal>
        <PopoverTrigger asChild>{GetButton()}</PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <CommandBox
            options={options}
            selectedValues={selectedValues}
            onChange={onChange}
            maxSelected={maxSelected}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelectInput.displayName = "MultiSelectInput";

const CommandBox = ({ options, selectedValues, onChange, maxSelected }) => {
  const MotionCommandItem = motion(CommandItem, { forwardMotionProps: true });
  const MotionCommandGroup = motion(CommandGroup, { forwardMotionProps: true });

  return (
    <Command>
      <CommandInput placeholder="Search for fallacies" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <MotionCommandGroup layout layoutRoot>
          {options
            .toSorted((a, b) => {
              if (selectedValues.includes(a.value)) return -1;
              if (selectedValues.includes(b.value)) return 1;
              return 0;
            })
            .map((option) => (
              <MotionCommandItem
                layout
                key={option.value}
                layoutId={option.value}
                className={cn({
                  "bg-primary-foreground/70": selectedValues.includes(
                    option.value
                  ),
                })}
                onSelect={() => {
                  if (
                    !selectedValues.includes(option.value) &&
                    selectedValues.length >= maxSelected
                  ) {
                    toast.error(
                      `You can only select up to ${maxSelected} items.`
                    );
                    return;
                  }
                  onChange(
                    selectedValues.includes(option.value)
                      ? selectedValues.filter((item) => item !== option.value)
                      : [...selectedValues, option.value]
                  );
                }}
              >
                <span className="w-7/12">{option.label}</span>
                <span className="w-4/12 text-center">
                  {selectedValues.includes(option.value) && (
                    <Badge variant="secondary">Selected</Badge>
                  )}
                </span>
                <Popover key={option.value}>
                  <PopoverTrigger
                    asChild
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="center" side="bottom">
                    <ViewLink
                      link={`https://en.wikipedia.org/api/rest_v1/page/summary/${option.label}`}
                    />
                  </PopoverContent>
                </Popover>
              </MotionCommandItem>
            ))}
        </MotionCommandGroup>
      </CommandList>
    </Command>
  );
};

export default MultiSelectInput;
