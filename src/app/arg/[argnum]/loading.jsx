import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import React from "react";

const Loading = () => {
  return (
    <div className="w-11/12 lg:w-10/12 mx-auto space-y-5">
      <Skeleton className="w-10/12 sm:w-8/12 md:w-7/12 h-8 mt-4" />
      {[1, 2].map((i) => (
        <div key={i} className={clsx("flex flex-col space-y-3", i % 2 === 0 ? "items-end" : "items-start")}>
          {[1, 2].map((j)=>(
            <div key={j} className="w-11/12 sm:w-10/12 md:w-8/12 space-y-3 py-7 px-5 border rounded-lg">
              {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-3" />))}
              {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-4 w-8/12" />))}
              <div className="space-x-4 flex">
                {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-4 w-24" />))}
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-4 w-44" />
              </div>
            </div>))}
        </div>
      ))}
    </div>
  );
};

export default Loading;
