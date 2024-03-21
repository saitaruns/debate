"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

function FancyNumber({ className, number: _num, children }) {
  const number = parseInt(_num, 10) || children;

  const numberArray = useMemo(() => {
    const arr = [];
    for (let i = number - 5; i < number + 6; i++) {
      arr.push(i);
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ensure the array is only created once

  return (
    <motion.span
      className={cn(
        className,
        "relative pointer-events-none overflow-hidden h-6",
        {
          "w-3": number < 10,
          "w-6": number >= 10 && number < 100,
          "w-8": number >= 100,
          "w-10": number >= 1000,
        }
      )}
    >
      {numberArray.map((num) => (
        <motion.span
          style={{
            y: -22 * (num - number + 5),
          }}
          animate={{
            y: -22 * (num - number),
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
          key={num}
          className="absolute inset-0 flex justify-center items-center"
        >
          {num}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default FancyNumber;
