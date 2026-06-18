"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ImageWithSkeletonProps = ImageProps & {
  skeletonClassName?: string;
};

export function ImageWithSkeleton({
  className,
  skeletonClassName,
  onLoad,
  ...props
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded ? (
        <Skeleton
          className={cn("absolute inset-0 size-full", skeletonClassName)}
          aria-hidden
        />
      ) : null}
      <Image
        {...props}
        className={cn(
          className,
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
}
