"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  Plus,
  X,
  MapPin,
  Navigation,
  Hotel,
  Utensils,
  Camera,
  Star,
  List,
} from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { VENUE_LOCATION } from "@/lib/utils";
import type { Place } from "@/types";

// Function to extract coordinates from Google Maps URL
function extractCoordsFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  try {
    // Pattern 1: /@lat,lng,zoom (most common in place URLs)
    const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const atMatch = url.match(atPattern);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Pattern 2: ?q=lat,lng or &q=lat,lng
    const qPattern = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const qMatch = url.match(qPattern);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Pattern 3: /place/lat,lng
    const placePattern = /\/place\/(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const placeMatch = url.match(placePattern);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }

    // Pattern 4: ll=lat,lng
    const llPattern = /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const llMatch = url.match(llPattern);
    if (llMatch) {
      return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
    }

    // Pattern 5: !3d{lat}!4d{lng} (embedded format)
    const embeddedPattern = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
    const embeddedMatch = url.match(embeddedPattern);
    if (embeddedMatch) {
      return { lat: parseFloat(embeddedMatch[1]), lng: parseFloat(embeddedMatch[2]) };
    }

    return null;
  } catch {
    return null;
  }
}

// Category icons and colors
const categoryConfig = {
  venue: { icon: Star, color: "#C4A35A", label: "Evento" },
  hotel: { icon: Hotel, color: "#3B82F6", label: "Hospedaje" },
  restaurant: { icon: Utensils, color: "#EF4444", label: "Restaurante" },
  attraction: { icon: Camera, color: "#8B5CF6", label: "Atraccion" },
  other: { icon: MapPin, color: "#6B7280", label: "Otro" },
};

// Placeholder places
const initialPlaces: Place[] = [
  {
    id: "venue",
    name: "Hacienda San Pedro Palomeque",
    address: "Anillo Periferico Sur KM 4.5, Merida",
    category: "venue",
    lat: VENUE_LOCATION.lat,
    lng: VENUE_LOCATION.lng,
    added_by: "Organizadores",
    notes: "Lugar del evento - Reunion Chamiza 2026",
    created_at: new Date().toISOString(),
  },
  {
    id: "1",
    name: "Centro Historico de Merida",
    address: "Plaza Grande, Centro, Merida",
    category: "attraction",
    lat: 20.9674,
    lng: -89.6237,
    added_by: "Maria Garcia",
    notes: "Plaza principal con catedral y edificios coloniales",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Paseo de Montejo",
    address: "Paseo de Montejo, Merida",
    category: "attraction",
    lat: 20.9833,
    lng: -89.6167,
    added_by: "Carlos Lopez",
    notes: "Avenida con mansiones historicas",
    created_at: new Date().toISOString(),
  },
];

export default function MapaPage() {
  const [places, setPlaces] = useState(initialPlaces);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showList, setShowList] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    category: "other" as keyof typeof categoryConfig,
    added_by: "",
    notes: "",
    googleMapsUrl: "",
  });
  const [extractedCoords, setExtractedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [coordsError, setCoordsError] = useState(false);

  const handleGoogleMapsUrlChange = (url: string) => {
    setForm((prev) => ({ ...prev, googleMapsUrl: url }));

    if (!url.trim()) {
      setExtractedCoords(null);
      setCoordsError(false);
      return;
    }

    const coords = extractCoordsFromGoogleMapsUrl(url);
    if (coords) {
      setExtractedCoords(coords);
      setCoordsError(false);
    } else {
      setExtractedCoords(null);
      setCoordsError(true);
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleAddPlace = async () => {
    if (!form.name.trim() || !form.added_by.trim() || !extractedCoords) return;

    setSubmitting(true);

    try {
      // TODO: Save to Supabase
      const newPlace: Place = {
        id: Date.now().toString(),
        name: form.name,
        address: form.address,
        category: form.category,
        lat: extractedCoords.lat,
        lng: extractedCoords.lng,
        added_by: form.added_by,
        notes: form.notes,
        created_at: new Date().toISOString(),
      };

      setPlaces((prev) => [...prev, newPlace]);
      setForm({
        name: "",
        address: "",
        category: "other",
        added_by: "",
        notes: "",
        googleMapsUrl: "",
      });
      setExtractedCoords(null);
      setCoordsError(false);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const openInMaps = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <MapPin size={48} className="mx-auto text-primary/40 mb-4" />
          <p className="text-primary/60">
            El mapa no esta disponible. Por favor configura la API de Google Maps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Map */}
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: VENUE_LOCATION.lat, lng: VENUE_LOCATION.lng }}
          defaultZoom={12}
          mapId="chamiza2026-map"
          className="w-full h-[calc(100vh-8rem)]"
          gestureHandling="greedy"
          disableDefaultUI
        >
          {places.map((place) => {
            const config =
              categoryConfig[place.category as keyof typeof categoryConfig] ||
              categoryConfig.other;
            const Icon = config.icon;

            return (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                onClick={() => setSelectedPlace(place)}
              >
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: config.color }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  {place.category === "venue" && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.div>
              </AdvancedMarker>
            );
          })}

          {/* Info Window */}
          {selectedPlace && (
            <InfoWindow
              position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
              onCloseClick={() => setSelectedPlace(null)}
              pixelOffset={[0, -45]}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-primary">
                  {selectedPlace.name}
                </h3>
                {selectedPlace.address && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedPlace.address}
                  </p>
                )}
                {selectedPlace.notes && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedPlace.notes}
                  </p>
                )}
                <button
                  onClick={() => openInMaps(selectedPlace)}
                  className="flex items-center gap-1 mt-2 text-sm text-blue-600 font-medium"
                >
                  <Navigation size={14} />
                  Como llegar
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowList(true)}
          className="p-3 bg-white rounded-full shadow-lg"
        >
          <List size={20} className="text-primary" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="p-3 bg-primary text-white rounded-full shadow-lg"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div
                key={key}
                className="flex items-center gap-1 text-xs text-primary/70"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  <Icon size={12} className="text-white" />
                </div>
                {config.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Places List Modal */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowList(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-cream">
                <h2 className="text-lg font-semibold text-primary">Lugares</h2>
                <button
                  onClick={() => setShowList(false)}
                  className="p-2 hover:bg-cream rounded-full"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              <div className="overflow-y-auto h-[calc(100%-60px)] p-4 space-y-3">
                {places.map((place) => {
                  const config =
                    categoryConfig[
                      place.category as keyof typeof categoryConfig
                    ] || categoryConfig.other;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={place.id}
                      whileTap={{ scale: 0.98 }}
                      className="bg-cream-light rounded-xl p-4 cursor-pointer"
                      onClick={() => {
                        setSelectedPlace(place);
                        setShowList(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: config.color }}
                        >
                          <Icon size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-primary truncate">
                            {place.name}
                          </h3>
                          {place.address && (
                            <p className="text-sm text-primary/60 truncate">
                              {place.address}
                            </p>
                          )}
                          <p className="text-xs text-primary/40 mt-1">
                            Por {place.added_by}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Place Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
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
                  Agregar Lugar
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
                  value={form.added_by}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, added_by: e.target.value }))
                  }
                />

                <Input
                  label="Nombre del lugar"
                  placeholder="Ej: Cenote Ik Kil"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Categoria
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value as keyof typeof categoryConfig,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-white text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="hotel">Hospedaje</option>
                    <option value="restaurant">Restaurante</option>
                    <option value="attraction">Atraccion</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <Input
                  label="Direccion (opcional)"
                  placeholder="Ej: Carretera a Valladolid KM 22"
                  value={form.address}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                />

                <div>
                  <Input
                    label="Link de Google Maps"
                    placeholder="Pega el link de Google Maps aqui"
                    value={form.googleMapsUrl}
                    onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                  />
                  {extractedCoords && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700 flex items-center gap-1">
                        <MapPin size={12} />
                        Ubicacion detectada: {extractedCoords.lat.toFixed(6)}, {extractedCoords.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                  {coordsError && form.googleMapsUrl && (
                    <p className="mt-2 text-xs text-red-500">
                      No se pudo extraer la ubicacion. Asegurate de copiar el link completo de Google Maps.
                    </p>
                  )}
                </div>

                <p className="text-xs text-primary/50">
                  Tip: Busca el lugar en Google Maps, toca "Compartir" y copia el link
                </p>

                <Input
                  label="Notas (opcional)"
                  placeholder="Por que recomiendas este lugar?"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>

              {/* Fixed Footer with Button */}
              <div className="p-6 pt-4 border-t border-cream pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <Button
                  className="w-full"
                  onClick={handleAddPlace}
                  disabled={
                    !form.name.trim() ||
                    !form.added_by.trim() ||
                    !extractedCoords
                  }
                  loading={submitting}
                >
                  Agregar Lugar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
