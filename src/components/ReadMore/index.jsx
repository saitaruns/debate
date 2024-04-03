"use client";

import clsx from "clsx";
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

  const pClass = clsx(
    isTruncated && `line-clamp-${minLines}`,
    "text-sm overflow-hidden break-words w-full"
  );

  if (!text) return null;

  return (
    <div className={className}>
      <p ref={paragraphRef} className={pClass}>
        {text}
      </p>
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
