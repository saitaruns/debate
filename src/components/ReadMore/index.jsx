"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef, useLayoutEffect } from "react";

const ReadMore = ({ children: text, className, minLines = 3 }) => {
  const [overflown, setOverflown] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);
  const paragraphRef = useRef(null);

  useLayoutEffect(() => {
    const paragraphElement = paragraphRef.current;
    if (paragraphElement) {
      const lineHeight = parseInt(
        getComputedStyle(paragraphElement).lineHeight
      );

      const maxHeight = lineHeight * minLines;

      if (paragraphElement.scrollHeight > maxHeight) {
        setOverflown(true);
      }
    }
  }, [text, minLines]);

  const toggleTruncation = () => {
    setIsTruncated(!isTruncated);
  };

  if (!text) return null;

  return (
    <div className={className}>
      <span
        ref={paragraphRef}
        className={cn(
          "w-11/12 text-sm overflow-hidden break-all hyphens-auto inline-block",
          {
            [`line-clamp-${minLines}`]: isTruncated,
          }
        )}
      >
        {text}
      </span>
      {overflown && (
        <button
          onClick={toggleTruncation}
          type="button"
          className="text-[14px] w-fit hover:underline font-medium"
        >
          {isTruncated ? "Read more" : "Read less"}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
