import Hero from "@/components/Hero";
import TripForm from "@/components/TripForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6">
      <Hero />
      <TripForm />
    </main>
  );
}