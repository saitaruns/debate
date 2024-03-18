import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

function FancyNumber({ number, className }) {
  const numberArray = useMemo(() => {
    const arr = [];
    for (let i = number - 5; i < number + 6; i++) {
      arr.push(i);
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ensure the array is only created once

  return (
    <motion.div
      className={cn(
        className,
        "relative w-6 h-6 pointer-events-none overflow-hidden"
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
          className="absolute inset-0 flex justify-center"
        >
          {num}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default FancyNumber;
