import Link from "next/link";
import { BookOpen, Compass, Home } from "lucide-react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6] text-slate-900">
      <Header variant="standard" />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-24">
        <Container className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5A2A5A]/20 bg-[#FAF5EE] px-3.5 py-1 text-xs font-bold text-[#3B0D3B] shadow-2xs mb-4">
            <span>ERROR 404</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Page not found
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] px-5 py-3 text-sm font-bold text-[#FDFAF6] shadow-md hover:bg-[#5A2A5A] active:scale-95 transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/#courses"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-2xs hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Compass className="h-4 w-4 text-[#3B0D3B]" />
              <span>Explore Programs</span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-[#F5EDE0] bg-[#FAF5EE] px-5 py-3 text-sm font-semibold text-[#3B0D3B] shadow-2xs hover:bg-[#F5EDE0] active:scale-95 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Field Notes</span>
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
