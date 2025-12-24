"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar, Clock, ChevronRight, Camera, Lock, Shield } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { PhotoGallery } from "@/components/PhotoGallery";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { Button } from "@/components/ui/Button";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/lib/supabase";

const quickLinks = [
  {
    href: "/hospedaje",
    title: "Recomendaciones",
    description: "Hoteles, cenotes, restaurantes y mas",
    icon: "⭐",
  },
  {
    href: "/planes",
    title: "Planes",
    description: "Actividades organizadas",
    icon: "📅",
  },
  {
    href: "/mapa",
    title: "Mapa",
    description: "Lugares de interes",
    icon: "🗺️",
  },
  {
    href: "/galeria",
    title: "Galeria",
    description: "Fotos del lugar",
    icon: "📷",
  },
];

interface GalleryImage {
  url: string;
  caption?: string;
}

export default function HomePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;

      setImages(
        (data || []).map((img: { image_url: string; caption?: string }) => ({
          url: img.image_url,
          caption: img.caption || undefined,
        }))
      );
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pt-8 pb-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-2">
            Chamiza
          </h1>
          <p className="text-lg text-accent font-medium italic">
            Reunion Familiar
          </p>
        </motion.div>

        {/* Countdown */}
        <FadeInUp delay={0.1}>
          <div className="mb-8">
            <Countdown />
          </div>
        </FadeInUp>

        {/* Event Details Card */}
        <FadeInUp delay={0.2}>
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cream rounded-lg">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary">21 de Febrero, 2026</p>
                  <p className="text-sm text-primary/60">Sabado</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-cream rounded-lg">
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary">Misa 11:00 AM</p>
                  <p className="text-sm text-primary/60">Comida 2:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-cream rounded-lg">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Hacienda San Pedro Palomeque
                  </p>
                  <p className="text-sm text-primary/60">
                    Anillo Periferico Sur KM 4.5, Merida
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=20.9226,-89.6524"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-6"
            >
              <Button className="w-full">
                <MapPin size={18} className="mr-2" />
                Ver ubicacion en mapa
              </Button>
            </a>
          </div>
        </FadeInUp>
      </section>

      {/* Quick Links */}
      <section className="px-4 py-8">
        <FadeInUp>
          <h2 className="text-xl font-serif font-bold text-primary mb-4">
            Explora
          </h2>
        </FadeInUp>

        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link, index) => (
            <FadeInUp key={link.href} delay={0.05 * index}>
              <Link href={link.href}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-4 shadow-sm h-full"
                >
                  <span className="text-2xl mb-2 block">{link.icon}</span>
                  <h3 className="font-semibold text-primary">{link.title}</h3>
                  <p className="text-xs text-primary/60 mt-1">
                    {link.description}
                  </p>
                </motion.div>
              </Link>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section className="px-4 py-8">
        <FadeInUp>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-primary">
              El Lugar
            </h2>
            <Link
              href="/galeria"
              className="flex items-center text-sm text-accent font-medium"
            >
              Ver todo
              <ChevronRight size={16} />
            </Link>
          </div>
        </FadeInUp>

        {loadingImages && (
          <div className="aspect-[4/3] rounded-2xl skeleton" />
        )}

        {!loadingImages && images.length > 0 && (
          <FadeInUp delay={0.1}>
            <PhotoGallery images={images} showCarousel />
          </FadeInUp>
        )}

        {!loadingImages && images.length === 0 && (
          <FadeInUp delay={0.1}>
            <Link href="/galeria">
              <div className="aspect-[4/3] rounded-2xl bg-cream-dark/30 flex flex-col items-center justify-center border-2 border-dashed border-cream-dark">
                <Camera size={32} className="text-primary/30 mb-2" />
                <p className="text-sm text-primary/50">
                  Se el primero en subir fotos
                </p>
              </div>
            </Link>
          </FadeInUp>
        )}
      </section>

      {/* Family crest / logo area */}
      <section className="px-4 py-12 text-center">
        <FadeInUp>
          <div className="inline-block p-6 bg-white rounded-full shadow-lg">
            <span className="text-5xl font-serif text-primary">鄭</span>
          </div>
          <p className="mt-4 text-sm text-primary/60">
            Familia Chamiza
          </p>
        </FadeInUp>
      </section>

      {/* Admin Section */}
      <section className="px-4 pb-8">
        <FadeInUp>
          <button
            onClick={() => setShowAdminModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-primary/40 hover:text-primary/60 transition-colors"
          >
            {isAdmin ? (
              <>
                <Shield size={16} />
                <span>Modo administrador activo</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Ingresar como administrador</span>
              </>
            )}
          </button>
        </FadeInUp>
      </section>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
