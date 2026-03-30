import { cn } from "@/lib/utils";

interface ProductSkeletonProps {
  className?: string;
}

export function ProductSkeleton({ className }: ProductSkeletonProps) {
  return (
    <div className={cn("", className)}>
      <div className="rounded-lg overflow-hidden">
        {/* Image skeleton */}
        <div className="aspect-square skeleton-shimmer rounded-lg" />
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          <div className="h-3 w-16 skeleton-shimmer rounded" />
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          <div className="h-5 w-20 skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="tocasa-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
