"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useMotionValueEvent, useScroll } from "framer-motion";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const ListCard = ({ children, className, maxHeight }) => {
  const ref = useRef(null);
  const [scrollState, setScrollState] = useState(0);
  const [isShadow, setIsShadow] = useState(false);

  const { scrollYProgress } = useScroll({
    container: ref,
  });

  useEffect(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
    setIsShadow(React.Children.count(children) > 3);
  }, [children]);

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
