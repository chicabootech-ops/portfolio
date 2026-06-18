import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <Skeleton className="absolute top-6 left-6 h-4 w-28 rounded-md md:top-8 md:left-8" />
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-40 rounded-md" />
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </main>
  );
}
