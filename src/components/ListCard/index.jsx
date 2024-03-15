"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useMotionValueEvent, useScroll } from "framer-motion";
import React, { useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { BiPlus } from "react-icons/bi";

const ListCard = ({ children, className, maxHeight, showMore = false}) => {
  const ref = useRef(null);
  const [scrollState, setScrollState] = useState(0);

  const { scrollYProgress } = useScroll({
    container: ref,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollState(latest === 0 ? 0 : (latest > 0 && latest < 0.9 ? 1 : 2))
  });

  const isShadow = children.length > 2;

  return (
    <ScrollArea className={cn(className, "relative")}>
      <div ref={ref} className="overflow-y-auto flex flex-col" style={{maxHeight}}>
        {children}
        {showMore ? 
          (<Button variant="ghost" className="w-fit mx-auto mt-1">Show More <BiPlus/>
          </Button>) 
        : null}
      </div>
      <div className={clsx("w-full absolute h-full pointer-events-none -translate-y-full",{
        "shadow-inset-bottom": isShadow && scrollState === 0,
        "shadow-inset-both": isShadow && scrollState === 1,
        "shadow-inset-top": isShadow && scrollState === 2,
      })}></div>
    </ScrollArea>
  );
};

export default ListCard;
