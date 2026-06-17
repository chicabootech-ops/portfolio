import Navbar from "@/components/navbar";

export default function ProductsPage() {
  return (
    <div className="w-screen min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 px-8">
        <h1 className="text-3xl font-semibold text-foreground">View Products</h1>
      </main>
    </div>
  );
}
