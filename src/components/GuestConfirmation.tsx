"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerChildren";
import { getGuestConfirmations, addGuestConfirmation } from "@/lib/supabase";
import { GuestConfirmation as GuestConfirmationType } from "@/types";
import { UserCheck, Heart } from "lucide-react";

export function GuestConfirmation() {
  const [confirmations, setConfirmations] = useState<GuestConfirmationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "",
    message: "",
  });

  useEffect(() => {
    fetchConfirmations();

    // Poll for new confirmations every 30 seconds
    const interval = setInterval(fetchConfirmations, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchConfirmations() {
    try {
      setLoading(true);
      const data = await getGuestConfirmations();
      setConfirmations(data || []);
    } catch (err) {
      console.error("Error fetching confirmations:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.guest_name.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    if (formData.guest_name.trim().length > 50) {
      setError("El nombre es demasiado largo (máximo 50 caracteres)");
      return;
    }

    if (formData.message.trim().length > 200) {
      setError("El mensaje es demasiado largo (máximo 200 caracteres)");
      return;
    }

    try {
      setSubmitting(true);
      await addGuestConfirmation({
        guest_name: formData.guest_name.trim(),
        message: formData.message.trim() || undefined,
      });

      setSuccess(true);
      setFormData({ guest_name: "", message: "" });

      // Refresh the list
      await fetchConfirmations();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      console.error("Error adding confirmation:", err);

      // Check if it's a duplicate name error
      if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
        setError("Este nombre ya confirmó asistencia");
      } else {
        setError("Error al confirmar asistencia. Por favor intenta de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-serif text-primary">Confirma tu Asistencia</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <Input
          label="Tu Nombre"
          placeholder="Nombre completo"
          value={formData.guest_name}
          onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
          maxLength={50}
          required
        />

        <Textarea
          label="Mensaje (opcional)"
          placeholder="Deja un mensaje para los novios..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          maxLength={200}
          className="min-h-[80px]"
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-600">¡Gracias por confirmar tu asistencia!</p>
        )}

        <Button
          type="submit"
          loading={submitting}
          className="w-full"
        >
          Confirmar Asistencia
        </Button>
      </form>

      {/* Guest List */}
      <div>
        <h3 className="text-lg font-medium text-primary mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-accent" />
          Invitados Confirmados ({confirmations.length})
        </h3>

        {loading && confirmations.length === 0 ? (
          <p className="text-sm text-primary/60 text-center py-4">Cargando...</p>
        ) : confirmations.length === 0 ? (
          <p className="text-sm text-primary/60 text-center py-4">
            Sé el primero en confirmar tu asistencia
          </p>
        ) : (
          <StaggerContainer className="space-y-3">
            {confirmations.map((confirmation) => (
              <StaggerItem key={confirmation.id}>
                <div className="bg-cream/50 rounded-xl p-3 border border-cream-dark">
                  <p className="font-medium text-primary">{confirmation.guest_name}</p>
                  {confirmation.message && (
                    <p className="text-sm text-primary/70 mt-1 italic">
                      &quot;{confirmation.message}&quot;
                    </p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
