"use client";

import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const ListCard = ({ children, className, autoScroll = false, maxHeight }) => {
  const ref = useRef(null);
  const [scrollState, setScrollState] = useState(0);
  const [isShadow, setIsShadow] = useState(false);
  const prevChildrenLength = useRef(3);

  const { scrollYProgress } = useScroll({
    container: ref,
  });

  useEffect(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      const offsetHeight = ref.current.offsetHeight;
      const currentChildrenLength = React.Children.count(children);

      if (currentChildrenLength > prevChildrenLength.current) {
        if (autoScroll) {
          const lastChild = ref.current.lastChild;
          const el =
            lastChild.id === "show-more"
              ? lastChild.previousElementSibling
              : lastChild;

          //scroll to the last child
          el.scrollIntoView({
            block: "center",
            inline: "center",
            behavior: "smooth",
          });

          // highlight the newly added children
          [
            ...Array(
              currentChildrenLength - prevChildrenLength.current - 1
            ).keys(),
          ]
            .reduce(
              (acc, _) => [...acc, acc.at(-1).previousElementSibling],
              [el]
            )
            .forEach((elem) => {
              elem.animate(
                [
                  { backgroundColor: "hsl(var(--primary) / 0.1)" },
                  { backgroundColor: "initial" },
                ],
                { duration: 2000, iterations: 1 }
              );
            });
        }
        prevChildrenLength.current = currentChildrenLength;
      }

      setIsShadow(scrollHeight > offsetHeight);
    }
  }, [autoScroll, children]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollState(latest === 0 ? 0 : latest > 0 && latest < 0.9 ? 1 : 2);
  });

  return (
    <div className={cn(className, "relative")}>
      {isShadow && (
        <div
          className={cn(
            "absolute pointer-events-none top-0 right-0 w-full h-[10%] z-10",
            "bg-gradient-to-b from-neutral-300 via-transparent to-transparent blur-sm",
            "dark:from-neutral-700 dark:via-transparent dark:to-transparent",
            "opacity-0 transition-opacity duration-200 ease-in-out",
            {
              "opacity-1000": scrollState === 1,
              "opacity-100": scrollState === 2,
            }
          )}
        />
      )}

      <div
        ref={ref}
        className="overflow-y-auto flex flex-col"
        style={{ maxHeight }}
      >
        {children}
      </div>

      {isShadow && (
        <div
          className={cn(
            "absolute pointer-events-none bottom-0 right-0 w-full h-[10%] z-10",
            "bg-gradient-to-t from-neutral-300 via-transparent to-transparent blur-sm",
            "dark:from-neutral-700 dark:via-transparent dark:to-transparent",
            "opacity-100 transition-opacity duration-200 ease-in-out",
            {
              "opacity-0": scrollState === 2,
            }
          )}
        />
      )}
    </div>
  );
};

export default ListCard;
