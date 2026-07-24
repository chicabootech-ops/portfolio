import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <Skeleton className="absolute top-6 left-6 h-4 w-36 rounded-md md:top-8 md:left-8" />
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-40 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-[28rem] w-full rounded-2xl" />
      </div>
    </main>
  );
}
