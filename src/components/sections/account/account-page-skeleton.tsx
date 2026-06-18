import { Skeleton } from "@/components/ui/skeleton";

export function AccountPageSkeleton() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-36 md:pb-16 md:pt-40">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <Skeleton className="mb-4 h-4 w-36 rounded-md" />

        <div className="space-y-5 md:space-y-6">
          <Skeleton className="h-44 w-full rounded-2xl md:h-48" />

          <div>
            <Skeleton className="mb-3 h-5 w-28 rounded-md" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[88px] rounded-2xl" />
              ))}
            </div>
          </div>

          <Skeleton className="h-72 w-full rounded-2xl" />

          <div className="grid gap-5 lg:grid-cols-2">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton className="h-52 w-full rounded-2xl" />
          </div>

          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
