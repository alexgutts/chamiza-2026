"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  ExternalLink,
  MapPin,
  DollarSign,
  Hotel,
  Home,
  Utensils,
  Droplets,
  Bus,
  Camera,
  Landmark,
  Car,
  Sparkles,
  Phone,
} from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Recommendation, RecommendationType } from "@/types";

// Category configuration
const categoryConfig: Record<
  RecommendationType,
  { icon: typeof Hotel; label: string; color: string; bgColor: string }
> = {
  hotel: {
    icon: Hotel,
    label: "Hotel",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  airbnb: {
    icon: Home,
    label: "Airbnb",
    color: "text-pink-700",
    bgColor: "bg-pink-100",
  },
  restaurante: {
    icon: Utensils,
    label: "Restaurante",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  cenote: {
    icon: Droplets,
    label: "Cenote",
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
  },
  tour: {
    icon: Bus,
    label: "Tour",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  actividad: {
    icon: Camera,
    label: "Actividad",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  arqueologia: {
    icon: Landmark,
    label: "Zona Arqueologica",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  transporte: {
    icon: Car,
    label: "Transporte",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
  },
  otro: {
    icon: Sparkles,
    label: "Otro",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

const priceLabels = {
  $: "Economico",
  $$: "Moderado",
  $$$: "Premium",
};

// All recommendations extracted from WhatsApp group
const initialRecommendations: Recommendation[] = [
  // HOSPEDAJE - Hoteles
  {
    id: "hotel-1",
    author_name: "Androcino Primo Merida",
    title: "Hotel Virreyes",
    description:
      "Hotel con alberca, estacionamiento y restaurante. 15 habitaciones disponibles. Precios: 4 personas - $1,250/noche, 3 personas - $1,050/noche, 2 personas - $850/noche",
    link: "https://www.virreyeshotel.com.mx",
    type: "hotel",
    price_range: "$$",
    price_info: "$850-1,250 por noche",
    address: "Av. Cupules #60 x 6 y 6A, Col. Garcia Gineres, Merida",
    phone: "(999) 565.77.65",
    created_at: "2025-05-22T11:03:00Z",
  },
  {
    id: "hotel-2",
    author_name: "Janaab prima ale merida",
    title: "Casa Amate 62",
    description:
      "Hotelito con alberca super linda. Excelente ubicacion cerca del evento.",
    link: "https://maps.app.goo.gl/3escfdBQDrVV2UUW8",
    type: "hotel",
    price_range: "$$",
    address: "Merida, Yucatan",
    created_at: "2025-05-29T12:11:00Z",
  },
  {
    id: "hotel-3",
    author_name: "Janaab prima ale merida",
    title: "Casa Amate 61",
    description:
      "Hostal con alberca super linda. Buena opcion economica cerca del centro.",
    link: "https://maps.app.goo.gl/Fig7QYi2iiJELu7f6",
    type: "hotel",
    price_range: "$",
    address: "Merida, Yucatan",
    created_at: "2025-05-29T12:12:00Z",
  },
  {
    id: "hotel-4",
    author_name: "Daniel Chavez Tio Merida",
    title: "Privadas Haciendas San Eduardo",
    description: "Hacienda privada en Dzemul. Perfecta para grupos grandes.",
    link: "https://maps.app.goo.gl/s8H9cbgBrkGTwkz69",
    type: "hotel",
    price_range: "$$$",
    address: "Dzemul, Yucatan",
    created_at: "2025-05-24T12:16:00Z",
  },

  // HOSPEDAJE - Airbnbs
  {
    id: "airbnb-1",
    author_name: "Daniel Chavez Tio Merida",
    title: "Airbnb en Merida",
    description: "Increible alojamiento en Merida. Muy bien ubicado.",
    link: "https://www.airbnb.com/l/wbD9wOou",
    type: "airbnb",
    price_range: "$$",
    address: "Merida, Yucatan",
    created_at: "2025-06-05T15:26:00Z",
  },
  {
    id: "airbnb-2",
    author_name: "Daniel Chavez Tio Merida",
    title: "Airbnb Casa Completa",
    description: "Casa completa ideal para familias.",
    link: "https://www.airbnb.com/l/As5ExrkS",
    type: "airbnb",
    price_range: "$$",
    address: "Merida, Yucatan",
    created_at: "2025-06-05T15:29:00Z",
  },
  {
    id: "airbnb-3",
    author_name: "Janaab prima ale merida",
    title: "Airbnb de amigas locales",
    description:
      "Dos Airbnbs de amigas, ambos aqui cerca. Se pueden manejar por afuera. Mil por noche, minimo dos noches.",
    link: "https://www.airbnb.com/l/BNHJhubj",
    type: "airbnb",
    price_range: "$$",
    price_info: "$1,000 por noche (minimo 2 noches)",
    address: "Merida, Yucatan",
    created_at: "2025-05-27T18:56:00Z",
  },
  {
    id: "airbnb-4",
    author_name: "Janaab prima ale merida",
    title: "Loft Gineres",
    description: "Loft moderno bien ubicado en la zona de Garcia Gineres.",
    link: "https://www.airbnb.com/h/loftgineres",
    type: "airbnb",
    price_range: "$$",
    address: "Garcia Gineres, Merida",
    created_at: "2025-05-27T18:56:00Z",
  },
  {
    id: "airbnb-5",
    author_name: "Daniel Chavez Tio Merida",
    title: "Airbnb Recomendado",
    description: "Alojamiento increible en Merida, muy bien resenado.",
    link: "https://www.airbnb.com/l/txiy56FT",
    type: "airbnb",
    price_range: "$$",
    address: "Merida, Yucatan",
    created_at: "2025-05-24T17:32:00Z",
  },

  // RESTAURANTES
  {
    id: "rest-1",
    author_name: "Daniel Chavez Tio Merida",
    title: "Dona Evelia Huevos Motulenos",
    description:
      "Los mejores huevos motulenos de la region. Imperdible para desayunar.",
    link: "https://maps.app.goo.gl/ekHJDqsF4y6eCgU87",
    type: "restaurante",
    price_range: "$",
    address: "Motul de Carrillo Puerto, Yucatan",
    created_at: "2025-05-24T11:41:00Z",
  },
  {
    id: "rest-2",
    author_name: "Daniel Chavez Tio Merida",
    title: "Restaurante Kinich Izamal",
    description:
      "Restaurante tradicional yucateco en el pueblo magico de Izamal. Excelente comida regional.",
    link: "https://maps.app.goo.gl/RSvHVJApWrT6qG2YA",
    type: "restaurante",
    price_range: "$$",
    address: "Izamal, Yucatan",
    created_at: "2025-05-24T14:55:00Z",
  },
  {
    id: "rest-3",
    author_name: "Daniel Chavez Tio Merida",
    title: "Yucatan Desconocido - Restaurante & Zona Arqueologica",
    description: "Restaurante con zona arqueologica. Experiencia unica.",
    link: "https://www.facebook.com/share/p/187eM9RCk1/",
    type: "restaurante",
    price_range: "$$",
    address: "Yucatan",
    created_at: "2025-04-17T22:10:00Z",
  },

  // CENOTES
  {
    id: "cenote-1",
    author_name: "Daniel Chavez Tio Merida",
    title: "Cenote Santa Barbara",
    description:
      "Cenote hermoso en Homun. Costo: $350 sin alimentos, $480 con alimentos - vale la pena con comida incluida.",
    link: "https://maps.app.goo.gl/axUEVv32E5FEzg5y6",
    type: "cenote",
    price_range: "$",
    price_info: "$350-480 por persona",
    address: "Homun, Yucatan",
    created_at: "2025-04-17T13:10:00Z",
  },
  {
    id: "cenote-2",
    author_name: "Daniel Chavez Tio Merida",
    title: "Cenotes Hacienda Mucuyche",
    description:
      "Hacienda con cenotes espectaculares. Perfecto para pasar el dia.",
    link: "https://maps.app.goo.gl/mtXU6dqGvYqsy6Ye6",
    type: "cenote",
    price_range: "$$",
    address: "Mucuyche, Yucatan",
    created_at: "2025-05-24T16:12:00Z",
  },
  {
    id: "cenote-3",
    author_name: "Daniel Chavez Tio Merida",
    title: "Cenotes en Homun (Ruta del Brujo)",
    description:
      "Ruta de cenotes bonitos en Homun. Varios cenotes para visitar en un dia.",
    link: "https://www.tiktok.com/t/ZP8Mdt75t/",
    type: "cenote",
    price_range: "$",
    address: "Homun, Yucatan",
    created_at: "2025-05-24T15:56:00Z",
  },

  // TOURS Y TRANSPORTE
  {
    id: "tour-1",
    author_name: "Daniel Chavez Tio Merida",
    title: "Yucatan de Viaje - Tours y Vans",
    description:
      "Servicio de tours y vans para explorar los tesoros escondidos del Yucatan.",
    link: "https://www.facebook.com/share/1CowSfhLGR/",
    type: "tour",
    price_range: "$$",
    address: "Merida, Yucatan",
    created_at: "2025-05-31T22:44:00Z",
  },
  {
    id: "tour-2",
    author_name: "Daniel Chavez Tio Merida",
    title: "Yucatan Explora - Tours Privados",
    description:
      "Visitas a Merida con tours privados. Descubre Yucatan a tu ritmo.",
    link: "https://www.facebook.com/share/15eCm3hwBF/",
    type: "tour",
    price_range: "$$",
    address: "Merida, Yucatan",
    created_at: "2025-05-24T17:45:00Z",
  },
  {
    id: "tour-3",
    author_name: "Daniel Chavez Tio Merida",
    title: "Turisfy Merida",
    description:
      "Tours a Chichen Itza y otras zonas arqueologicas. Una de las 7 maravillas del mundo.",
    link: "https://www.facebook.com/share/1DpMMHi43Q/",
    type: "tour",
    price_range: "$$",
    address: "Merida, Yucatan",
    created_at: "2025-05-25T10:56:00Z",
  },
  {
    id: "transporte-1",
    author_name: "Daniel Chavez Tio Merida",
    title: "Gonzcar - Renta de Autos",
    description:
      "Lista de precios temporada baja para renta de autos. Buena opcion para moverse libremente.",
    link: "https://www.facebook.com/share/p/1F9LAGHnT8/",
    type: "transporte",
    price_range: "$",
    address: "Merida, Yucatan",
    created_at: "2025-05-24T23:02:00Z",
  },

  // ACTIVIDADES
  {
    id: "act-1",
    author_name: "Janaab prima ale merida",
    title: "Paddle Board en el Manglar",
    description:
      "Esta actividad hara que tu dia sea magico conectando con la naturaleza y contigo mismo. Experiencia unica en los manglares.",
    link: undefined,
    type: "actividad",
    price_range: "$$",
    address: "Progreso, Yucatan",
    created_at: "2025-06-05T00:00:00Z",
  },
  {
    id: "act-2",
    author_name: "Daniel Chavez Tio Merida",
    title: "Sendero Jurasico",
    description:
      "Parque tematico en Chicxulub. Perfecto para ir con ninos y familias.",
    link: "https://maps.app.goo.gl/zy59AMuH9icZ8imMA",
    type: "actividad",
    price_range: "$",
    address: "Chicxulub, Yucatan",
    created_at: "2025-05-24T13:53:00Z",
  },
  {
    id: "act-3",
    author_name: "Daniel Chavez Tio Merida",
    title: "Hacienda Kankabal",
    description:
      "Escapate a la hermosa Hacienda Kankabal. Lugar espectacular para fotos y paseo.",
    link: "https://www.facebook.com/share/v/16SwXaJpeJ/",
    type: "actividad",
    price_range: "$$",
    address: "Yucatan",
    created_at: "2025-05-24T14:43:00Z",
  },
  {
    id: "act-4",
    author_name: "Daniel Chavez Tio Merida",
    title: "Telchac Yucatan",
    description: "3 datos que no sabias de Telchac. Playa tranquila cerca de Merida.",
    link: "https://www.tiktok.com/t/ZP8Md849D/",
    type: "actividad",
    price_range: "$",
    address: "Telchac Puerto, Yucatan",
    created_at: "2025-05-24T12:07:00Z",
  },

  // ZONAS ARQUEOLOGICAS
  {
    id: "arq-1",
    author_name: "Daniel Chavez Tio Merida",
    title: "Zona Arqueologica Xcambo",
    description:
      "Zona arqueologica menos conocida pero muy interesante. Cerca de la costa.",
    link: "https://maps.app.goo.gl/Ergby9rzAeaF5hLH6",
    type: "arqueologia",
    price_range: "$",
    address: "Xcambo, Yucatan",
    created_at: "2025-05-24T12:18:00Z",
  },
  {
    id: "arq-2",
    author_name: "Daniel Chavez Tio Merida",
    title: "El Principe Tutul Xiu",
    description:
      "Sitio historico en Mani con historia de la conquista. Restaurante con comida tradicional.",
    link: "https://maps.app.goo.gl/Mftb8Hxu61G6kWGc7",
    type: "arqueologia",
    price_range: "$",
    address: "Mani, Yucatan",
    created_at: "2025-05-24T16:41:00Z",
  },
  {
    id: "arq-3",
    author_name: "Daniel Chavez Tio Merida",
    title: "Valladolid - Pueblo Magico",
    description:
      "Asi es conocer Valladolid, otro pueblo magico mas. Ciudad colonial hermosa con cenotes cerca.",
    link: "https://www.tiktok.com/t/ZP8MRRAuq/",
    type: "arqueologia",
    price_range: "$",
    address: "Valladolid, Yucatan",
    created_at: "2025-05-24T16:22:00Z",
  },
  {
    id: "arq-4",
    author_name: "Daniel Chavez Tio Merida",
    title: "Leyenda de las Virgenes Hermanas de Izamal",
    description: "Historia y cultura de Izamal, la ciudad amarilla.",
    link: "https://www.facebook.com/share/1C5Q9ZMhn7/",
    type: "arqueologia",
    price_range: "$",
    address: "Izamal, Yucatan",
    created_at: "2025-05-24T15:09:00Z",
  },
];

// Group by category for sections
const categories: { key: RecommendationType; title: string }[] = [
  { key: "hotel", title: "Hoteles" },
  { key: "airbnb", title: "Airbnbs" },
  { key: "restaurante", title: "Restaurantes" },
  { key: "cenote", title: "Cenotes" },
  { key: "tour", title: "Tours" },
  { key: "transporte", title: "Transporte" },
  { key: "actividad", title: "Actividades" },
  { key: "arqueologia", title: "Zonas Arqueologicas" },
  { key: "otro", title: "Otros" },
];

export default function RecomendacionesPage() {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<RecommendationType | "all">("all");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    author_name: "",
    title: "",
    description: "",
    link: "",
    type: "hotel" as RecommendationType,
    price_range: "$$" as "$" | "$$" | "$$$",
    price_info: "",
    address: "",
    phone: "",
  });

  const filteredRecommendations =
    activeCategory === "all"
      ? recommendations
      : recommendations.filter((r) => r.type === activeCategory);

  const handleSubmit = async () => {
    if (
      !form.author_name.trim() ||
      !form.title.trim() ||
      !form.description.trim()
    )
      return;

    setSubmitting(true);

    try {
      const newRec: Recommendation = {
        id: `user-${Date.now()}`,
        author_name: form.author_name,
        title: form.title,
        description: form.description,
        link: form.link || undefined,
        type: form.type,
        price_range: form.price_range,
        price_info: form.price_info || undefined,
        address: form.address || undefined,
        phone: form.phone || undefined,
        created_at: new Date().toISOString(),
      };

      setRecommendations((prev) => [newRec, ...prev]);
      setForm({
        author_name: "",
        title: "",
        description: "",
        link: "",
        type: "hotel",
        price_range: "$$",
        price_info: "",
        address: "",
        phone: "",
      });
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryCount = (type: RecommendationType) =>
    recommendations.filter((r) => r.type === type).length;

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <FadeInUp>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">
              Recomendaciones
            </h1>
            <p className="text-sm text-primary/60">
              {recommendations.length} lugares recomendados por la familia
            </p>
          </div>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-1" />
            Agregar
          </Button>
        </div>
      </FadeInUp>

      {/* Category Filters */}
      <FadeInUp delay={0.1}>
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-white"
                : "bg-white text-primary/70"
            }`}
          >
            Todos ({recommendations.length})
          </button>
          {categories
            .filter((cat) => getCategoryCount(cat.key) > 0)
            .map((cat) => {
              const config = categoryConfig[cat.key];
              const Icon = config.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.key
                      ? "bg-primary text-white"
                      : "bg-white text-primary/70"
                  }`}
                >
                  <Icon size={14} />
                  {cat.title} ({getCategoryCount(cat.key)})
                </button>
              );
            })}
        </div>
      </FadeInUp>

      {/* Recommendations List */}
      <StaggerContainer className="space-y-4">
        {filteredRecommendations.map((rec) => {
          const config = categoryConfig[rec.type];
          const Icon = config.icon;

          return (
            <StaggerItem key={rec.id}>
              <AnimatedCard className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
                      >
                        <Icon size={12} />
                        {config.label}
                      </span>
                      {rec.price_range && (
                        <span className="flex items-center text-xs text-primary/60">
                          <DollarSign size={12} />
                          {priceLabels[rec.price_range]}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-primary">{rec.title}</h3>
                    <p className="text-sm text-primary/60 mt-1">
                      {rec.description}
                    </p>
                  </div>
                </div>

                {rec.price_info && (
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <DollarSign size={12} />
                    {rec.price_info}
                  </div>
                )}

                {rec.address && (
                  <div className="flex items-center gap-1 text-xs text-primary/50">
                    <MapPin size={12} />
                    {rec.address}
                  </div>
                )}

                {rec.phone && (
                  <a
                    href={`tel:${rec.phone}`}
                    className="flex items-center gap-1 text-xs text-primary/50 hover:text-primary"
                  >
                    <Phone size={12} />
                    {rec.phone}
                  </a>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-cream">
                  <span className="text-xs text-primary/40">
                    Por {rec.author_name}
                  </span>
                  {rec.link && (
                    <a
                      href={rec.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-accent font-medium"
                    >
                      Ver mas
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </AnimatedCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {filteredRecommendations.length === 0 && (
        <FadeInUp>
          <div className="text-center py-12">
            <p className="text-primary/40">
              No hay recomendaciones en esta categoria
            </p>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setShowForm(true)}
            >
              Se el primero en agregar una
            </Button>
          </div>
        </FadeInUp>
      )}

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-cream">
                <h2 className="text-lg font-semibold text-primary">
                  Nueva Recomendacion
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-cream rounded-full"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
                <Input
                  label="Tu nombre"
                  placeholder="Ej: Juan Perez"
                  value={form.author_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, author_name: e.target.value }))
                  }
                />

                <Input
                  label="Nombre del lugar"
                  placeholder="Ej: Cenote Ik Kil"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Categoria
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          type: e.target.value as RecommendationType,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-white text-primary focus:outline-none focus:border-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Precio
                    </label>
                    <select
                      value={form.price_range}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          price_range: e.target.value as "$" | "$$" | "$$$",
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-white text-primary focus:outline-none focus:border-primary"
                    >
                      <option value="$">$ Economico</option>
                      <option value="$$">$$ Moderado</option>
                      <option value="$$$">$$$ Premium</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="Descripcion"
                  placeholder="Cuenta por que lo recomiendas..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />

                <Input
                  label="Precio especifico (opcional)"
                  placeholder="Ej: $350 por persona"
                  value={form.price_info}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price_info: e.target.value }))
                  }
                />

                <Input
                  label="Direccion (opcional)"
                  placeholder="Ej: Homun, Yucatan"
                  value={form.address}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                />

                <Input
                  label="Telefono (opcional)"
                  placeholder="Ej: (999) 123-4567"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />

                <Input
                  label="Link (opcional)"
                  placeholder="https://... o link de Google Maps"
                  value={form.link}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link: e.target.value }))
                  }
                />
              </div>

              {/* Fixed Footer with Button */}
              <div className="p-6 pt-4 border-t border-cream pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={
                    !form.author_name.trim() ||
                    !form.title.trim() ||
                    !form.description.trim()
                  }
                  loading={submitting}
                >
                  Publicar Recomendacion
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
