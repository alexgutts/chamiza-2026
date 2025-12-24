"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  images: { url: string; caption?: string }[];
  showCarousel?: boolean;
}

export function PhotoGallery({
  images,
  showCarousel = false,
}: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const closeLightbox = () => setSelectedIndex(null);

  if (showCarousel) {
    return (
      <div className="relative">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 aspect-[4/3] relative"
                onClick={() => setSelectedIndex(index)}
              >
                <Image
                  src={image.url}
                  alt={image.caption || `Foto ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
        >
          <ChevronRight size={24} className="text-primary" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === emblaApi?.selectedScrollSnap()
                  ? "bg-primary"
                  : "bg-primary/20"
              )}
            />
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onNavigate={setSelectedIndex}
        />
      </div>
    );
  }

  // Grid layout
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative rounded-xl overflow-hidden cursor-pointer",
              index === 0 && "col-span-2 row-span-2 aspect-square md:aspect-[4/3]",
              index !== 0 && "aspect-square"
            )}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={image.url}
              alt={image.caption || `Foto ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes={index === 0 ? "66vw" : "33vw"}
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={images}
        selectedIndex={selectedIndex}
        onClose={closeLightbox}
        onNavigate={setSelectedIndex}
      />
    </div>
  );
}

interface LightboxProps {
  images: { url: string; caption?: string }[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ images, selectedIndex, onClose, onNavigate }: LightboxProps) {
  if (selectedIndex === null) return null;

  const handlePrev = () => {
    const newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
    onNavigate(newIndex);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Navigation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/10 rounded-full"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/10 rounded-full"
        >
          <ChevronRight size={32} className="text-white" />
        </button>

        {/* Image */}
        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full h-full max-w-4xl max-h-[80vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[selectedIndex].url}
            alt={images[selectedIndex].caption || `Foto ${selectedIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
          {images[selectedIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-center">
                {images[selectedIndex].caption}
              </p>
            </div>
          )}
        </motion.div>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
