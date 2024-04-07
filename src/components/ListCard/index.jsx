"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useMotionValueEvent, useScroll } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

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
            lastChild.tagName.toLowerCase() === "button"
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
    <ScrollArea className={cn(className, "relative")}>
      <div
        ref={ref}
        className="overflow-y-auto flex flex-col"
        style={{ maxHeight }}
      >
        {children}
      </div>
      <div
        className={clsx(
          "w-full absolute h-full pointer-events-none -translate-y-full",
          {
            "shadow-inset-bottom": isShadow && scrollState === 0,
            "shadow-inset-both": isShadow && scrollState === 1,
            "shadow-inset-top": isShadow && scrollState === 2,
          }
        )}
      ></div>
    </ScrollArea>
  );
};

export default ListCard;
