
import Header from "./components/Header";
import Hero from "./components/Hero";

 
export default function Home() {
  return (
    <div className="min-h-screen bg-indigo-950 text-white">
      <Header />
      <main>
        <Hero />
      </main>
      <footer className=" text-gray-600 py-2 px-6 text-center">
        © 2025 FinFlow
      </footer>
    </div>
  );
}