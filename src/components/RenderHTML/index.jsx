"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

const RenderHTML = ({ html, className, prose = false }) => {
  return (
    <div
      className={cn("line-clamp-2 text-xs break-all", className, {
        prose: prose,
      })}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    ></div>
  );
};

export default RenderHTML;
