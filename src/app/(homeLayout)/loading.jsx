import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const HomeLoading = () => {
  return (
    <div className="flex m-3">
      <div className="w-0 sm:w-2/12"></div>
      <div className="w-full sm:w-8/12 md:w-6/12 flex-col mt-3 mr-3 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-md border p-4 space-y-3">
            <Skeleton className="h-8" />
            <Skeleton className="h-4 w-2/12" />
            <div className="space-y-2">

              
              {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-3" />))}
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeLoading;
