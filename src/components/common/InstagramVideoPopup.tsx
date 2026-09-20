"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, Play } from "lucide-react";

export default function InstagramVideoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const DURATION = 36.8; // 36.5 seconds duration

  // Detect scroll, mobile viewport, and custom open event
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        setIsInHero(rect.bottom > 100);
      } else {
        setIsInHero(window.scrollY < 650);
      }
    };

    const handleOpenVideo = () => {
      setIsOpen(true);
    };

    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("open-treqo-video", handleOpenVideo);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-treqo-video", handleOpenVideo);
    };
  }, []);

  // Auto-pop from right edge 1.0s after landing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 36.5-second auto-close timer when opened
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setIsOpen(false);
    }, DURATION * 1000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  // On mobile (< 1024px), NEVER render the floating side button so it NEVER overlays on anything.
  // The popup is only visible on mobile when actively opened as a modal.
  // On desktop, the floating tab docks cleanly on the right edge.
  const isVisible = isOpen || (!isMobile && isInHero);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleClose}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
              />
            )}
          </AnimatePresence>

          {/* Floating vertical container on desktop / Centered modal when open */}
          <motion.div
            initial={{
              opacity: 0,
              right: 0,
              top: "44%",
              y: "-50%",
              width: "44px",
              height: "176px",
            }}
            animate={
              isOpen
                ? {
                    opacity: 1,
                    left: "50%",
                    right: "auto",
                    x: "-50%",
                    top: "50%",
                    y: "-50%",
                    width: "min(380px, calc(100vw - 32px))",
                    height: "min(530px, 82vh)",
                    backgroundColor: "#000000",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
                  }
                : {
                    opacity: 1,
                    left: "auto",
                    right: 0,
                    x: "0%",
                    top: "44%",
                    y: "-50%",
                    width: "44px",
                    height: "176px",
                    backgroundColor: "#3B0D3B",
                    borderColor: "rgba(140, 106, 140, 0.4)",
                    borderRadius: "12px 0px 0px 12px",
                    boxShadow: "-4px 0 24px -2px rgba(59, 13, 59, 0.5)",
                  }
            }
            exit={{
              opacity: 0,
              right: "-50px",
              transition: { duration: 0.2 },
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
              mass: 0.75,
            }}
            className="fixed z-50 flex flex-col overflow-hidden border cursor-pointer select-none"
            onClick={!isOpen ? handleOpen : undefined}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="modal-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: 0.08 }}
                  className="relative w-full h-full flex flex-col bg-black text-white cursor-default rounded-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Floating Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    aria-label="Close video"
                    className="absolute top-3 right-3 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 hover:bg-black text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer shadow-md"
                    title="Close"
                  >
                    <X size={15} />
                  </button>

                  {/* Pure Video Container */}
                  <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
                    <iframe
                      src="https://www.instagram.com/reel/DZcndZohT3l/embed/?autoplay=1"
                      className="w-full h-full border-0"
                      scrolling="no"
                      allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write;"
                      title="TREQO Instagram Reel"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="button-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="w-full h-full flex flex-col items-center justify-between py-3 px-1 bg-gradient-to-b from-[#5A2A5A] via-[#3B0D3B] to-[#0B0B0F] text-white hover:from-[#8C6A8C] hover:to-[#3B0D3B] transition-all group"
                >
                  {/* Top: Video icon with pulse dot */}
                  <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 border border-white/25 shadow-xs group-hover:scale-110 group-hover:bg-white/25 transition-all">
                    <Video size={13} className="text-white" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0CA30C] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0CA30C]" />
                    </span>
                  </div>

                  {/* Center: Vertical Typography with clean generous spacing */}
                  <div
                    className="my-auto py-2 flex items-center justify-center text-center select-none"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white whitespace-nowrap leading-none">
                      WATCH VIDEO
                    </span>
                  </div>

                  {/* Bottom: Play Icon with proper separation */}
                  <div className="flex items-center justify-center text-[#FDFAF6] group-hover:text-white group-hover:scale-110 transition-transform shrink-0 pb-0.5">
                    <Play size={10} className="fill-[#FDFAF6]/50" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
