import prisma from "@/db/src/prisma";
 import Link from "next/link";

 
export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* AppBar */}
      <header className="bg-blue-500 text-white py-4 px-6 flex items-center justify-between">
        <div className="text-xl font-semibold">FinFlow App</div>
        <Link href="/login" className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-md hover:bg-blue-100">
          Login
        </Link>
      </header>

      {/* Main Content Area (you can add more content here later) */}
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-lg">Welcome to FinFlow!</div>
      </main>

      {/* Optional Footer */}
      <footer className="bg-gray-200 text-gray-600 py-2 px-6 text-center">
        © 2025 FinFlow
      </footer>
    </div>
  );
}