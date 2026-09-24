"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { GovCertsContent } from "@/lib/content-db";

const defaultCerts = [
  { src: "/msme.webp", label: "MSME Registered", sub: "Ministry of MSME, Govt. of India" },
  { src: "/001.webp", label: "Recognized by DPIIT", sub: "Department for Promotion of Industry and Internal Trade" },
  { src: "/dpiit.webp", label: "DPIIT Recognised", sub: "Startup India, Govt. of India" },
];

export function GovCertSection({ content }: { content?: GovCertsContent }) {
  const title = content?.title || "Government Certified";
  const titleHighlight = content?.titleHighlight || "Institution";
  const subtitle = content?.subtitle || "Recognised by official government initiatives & accredited ministries";
  const certs = content?.certs && content.certs.length > 0 ? content.certs : defaultCerts;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 2.5 seconds in a loop on mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certs.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [certs.length]);

  return (
    <section className="relative overflow-hidden bg-[#3B0D3B] py-8 sm:py-10 lg:py-12 text-white border-y border-[#5A2A5A]/50 shadow-inner">
      <Container className="max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left: Title & Subtitle */}
          <div className="text-center lg:text-left lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl lg:text-[1.85rem] font-black tracking-tight text-white leading-tight">
              {title}{" "}
              <span className="text-[#FDFAF6]/90">
                {titleHighlight}
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#FAF5EE]/80 font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
              {subtitle}
            </p>
          </div>

          {/* Right: The 3 Certification Cards */}
          <div className="w-full lg:col-span-7">
            {/* Mobile Carousel (under 640px) */}
            <div className="sm:hidden relative flex flex-col items-center justify-center min-h-[100px] overflow-hidden">
              <div className="relative w-full h-22 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -30) {
                        setCurrentIndex((prev) => (prev + 1) % certs.length);
                      } else if (info.offset.x > 30) {
                        setCurrentIndex((prev) => (prev - 1 + certs.length) % certs.length);
                      }
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-1 cursor-grab active:cursor-grabbing"
                  >
                    <div className="w-full max-w-[260px] h-20 flex items-center justify-center rounded-2xl bg-white border border-white/25 px-5 py-3 shadow-md">
                      <Image
                        src={certs[currentIndex].src}
                        alt={certs[currentIndex].label}
                        width={200}
                        height={70}
                        unoptimized
                        className="h-11 w-auto max-w-[170px] object-contain mx-auto"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dot Indicators */}
              <div className="mt-2.5 flex items-center justify-center gap-1.5">
                {certs.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300 cursor-pointer",
                      currentIndex === i ? "w-5 bg-white" : "w-1.5 bg-white/40"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Tablet & Desktop: 3 Cards Side-by-Side */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-4 lg:gap-5 items-center">
              {certs.map((cert, idx) => (
                <motion.div
                  key={cert.label || idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.07 }}
                  className="flex justify-center items-center transition-transform duration-300 hover:scale-[1.03]"
                >
                  <div className="w-full h-20 sm:h-22 lg:h-24 flex items-center justify-center rounded-2xl bg-white border border-white/20 p-3 sm:p-4 shadow-md hover:shadow-xl hover:border-white/40 transition-all">
                    <Image
                      src={cert.src}
                      alt={cert.label}
                      width={200}
                      height={80}
                      unoptimized
                      className="h-11 sm:h-12 lg:h-13 w-auto max-w-[130px] sm:max-w-[155px] object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default GovCertSection;
