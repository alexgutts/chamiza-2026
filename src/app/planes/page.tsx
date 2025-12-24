"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerChildren";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatDate, formatTime } from "@/lib/utils";
import type { Plan, PlanParticipant } from "@/types";

// Placeholder data
const initialPlans: Plan[] = [
  {
    id: "1",
    author_name: "Roberto Chamiza",
    title: "Tour por Cenotes",
    description:
      "Visita a cenotes cercanos a Merida. Llevar traje de bano y toalla.",
    date: "2026-02-20",
    time: "09:00",
    location: "Cenote Ik Kil",
    max_participants: 15,
    created_at: new Date().toISOString(),
    plan_participants: [
      {
        id: "p1",
        plan_id: "1",
        participant_name: "Ana Garcia",
        created_at: new Date().toISOString(),
      },
      {
        id: "p2",
        plan_id: "1",
        participant_name: "Carlos Lopez",
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    author_name: "Laura Martinez",
    title: "Cena en el Centro",
    description:
      "Cena grupal en restaurante del centro historico. Comida yucateca tipica.",
    date: "2026-02-20",
    time: "20:00",
    location: "La Chaya Maya, Centro Historico",
    created_at: new Date().toISOString(),
    plan_participants: [
      {
        id: "p3",
        plan_id: "2",
        participant_name: "Maria Rodriguez",
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "3",
    author_name: "Pedro Sanchez",
    title: "Visita a Uxmal",
    description: "Tour a las ruinas de Uxmal. Salimos temprano para evitar el calor.",
    date: "2026-02-22",
    time: "07:00",
    location: "Zona Arqueologica de Uxmal",
    max_participants: 20,
    created_at: new Date().toISOString(),
    plan_participants: [],
  },
];

export default function PlanesPage() {
  const [plans, setPlans] = useState(initialPlans);
  const [showForm, setShowForm] = useState(false);
  const [joinModal, setJoinModal] = useState<{
    planId: string;
    action: "join" | "leave";
  } | null>(null);
  const [joinName, setJoinName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    author_name: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    max_participants: "",
  });

  const handleSubmit = async () => {
    if (
      !form.author_name.trim() ||
      !form.title.trim() ||
      !form.description.trim() ||
      !form.date
    )
      return;

    setSubmitting(true);

    try {
      // TODO: Save to Supabase
      const newPlan: Plan = {
        id: Date.now().toString(),
        author_name: form.author_name,
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time || undefined,
        location: form.location || undefined,
        max_participants: form.max_participants
          ? parseInt(form.max_participants)
          : undefined,
        created_at: new Date().toISOString(),
        plan_participants: [],
      };

      setPlans((prev) =>
        [...prev, newPlan].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      setForm({
        author_name: "",
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        max_participants: "",
      });
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (planId: string) => {
    if (!joinName.trim()) return;

    setSubmitting(true);

    try {
      // TODO: Save to Supabase
      const newParticipant: PlanParticipant = {
        id: Date.now().toString(),
        plan_id: planId,
        participant_name: joinName,
        created_at: new Date().toISOString(),
      };

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                plan_participants: [
                  ...(plan.plan_participants || []),
                  newParticipant,
                ],
              }
            : plan
        )
      );

      setJoinName("");
      setJoinModal(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeave = async (planId: string) => {
    if (!joinName.trim()) return;

    setSubmitting(true);

    try {
      // TODO: Delete from Supabase
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                plan_participants: (plan.plan_participants || []).filter(
                  (p) =>
                    p.participant_name.toLowerCase() !== joinName.toLowerCase()
                ),
              }
            : plan
        )
      );

      setJoinName("");
      setJoinModal(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Group plans by date
  const plansByDate = plans.reduce((acc, plan) => {
    const date = plan.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <FadeInUp>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">
              Planes
            </h1>
            <p className="text-sm text-primary/60">
              Actividades organizadas por la familia
            </p>
          </div>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-1" />
            Crear
          </Button>
        </div>
      </FadeInUp>

      {/* Plans by Date */}
      {Object.entries(plansByDate)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, datePlans], dateIndex) => (
          <div key={date} className="mb-8">
            <FadeInUp delay={dateIndex * 0.1}>
              <h2 className="text-sm font-semibold text-primary/60 mb-3 capitalize">
                {formatDate(date)}
              </h2>
            </FadeInUp>

            <StaggerContainer className="space-y-3">
              {datePlans.map((plan) => {
                const participantCount = plan.plan_participants?.length || 0;
                const isFull =
                  plan.max_participants &&
                  participantCount >= plan.max_participants;

                return (
                  <StaggerItem key={plan.id}>
                    <AnimatedCard className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-primary text-lg">
                          {plan.title}
                        </h3>
                        <p className="text-sm text-primary/60 mt-1">
                          {plan.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm">
                        {plan.time && (
                          <div className="flex items-center gap-1 text-primary/60">
                            <Clock size={14} />
                            {formatTime(plan.time)}
                          </div>
                        )}
                        {plan.location && (
                          <div className="flex items-center gap-1 text-primary/60">
                            <MapPin size={14} />
                            {plan.location}
                          </div>
                        )}
                      </div>

                      {/* Participants */}
                      <div className="pt-3 border-t border-cream">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-sm text-primary/60">
                            <Users size={14} />
                            {participantCount} participante
                            {participantCount !== 1 && "s"}
                            {plan.max_participants &&
                              ` / ${plan.max_participants}`}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setJoinModal({ planId: plan.id, action: "join" })
                              }
                              disabled={!!isFull}
                              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm rounded-lg disabled:opacity-50"
                            >
                              <UserPlus size={14} />
                              Unirme
                            </button>
                            {participantCount > 0 && (
                              <button
                                onClick={() =>
                                  setJoinModal({
                                    planId: plan.id,
                                    action: "leave",
                                  })
                                }
                                className="flex items-center gap-1 px-3 py-1.5 bg-cream text-primary text-sm rounded-lg"
                              >
                                <UserMinus size={14} />
                                Salir
                              </button>
                            )}
                          </div>
                        </div>

                        {plan.plan_participants &&
                          plan.plan_participants.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {plan.plan_participants.map((p) => (
                                <span
                                  key={p.id}
                                  className="px-2 py-0.5 bg-cream rounded-full text-xs text-primary/70"
                                >
                                  {p.participant_name}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>

                      <div className="text-xs text-primary/40">
                        Organizado por {plan.author_name}
                      </div>
                    </AnimatedCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        ))}

      {plans.length === 0 && (
        <FadeInUp>
          <div className="text-center py-12">
            <p className="text-primary/40">No hay planes aun</p>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setShowForm(true)}
            >
              Crea el primer plan
            </Button>
          </div>
        </FadeInUp>
      )}

      {/* Create Plan Modal */}
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
              className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">
                  Nuevo Plan
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-cream rounded-full"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Tu nombre"
                  placeholder="Ej: Juan Perez"
                  value={form.author_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, author_name: e.target.value }))
                  }
                />

                <Input
                  label="Nombre del plan"
                  placeholder="Ej: Tour por Cenotes"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />

                <Textarea
                  label="Descripcion"
                  placeholder="Describe la actividad..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Fecha"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                  <Input
                    label="Hora (opcional)"
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>

                <Input
                  label="Lugar (opcional)"
                  placeholder="Ej: Cenote Ik Kil"
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                />

                <Input
                  label="Maximo de participantes (opcional)"
                  type="number"
                  placeholder="Sin limite"
                  value={form.max_participants}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      max_participants: e.target.value,
                    }))
                  }
                />

                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={
                    !form.author_name.trim() ||
                    !form.title.trim() ||
                    !form.description.trim() ||
                    !form.date
                  }
                  loading={submitting}
                >
                  Crear Plan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join/Leave Modal */}
      <AnimatePresence>
        {joinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
            onClick={() => setJoinModal(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">
                  {joinModal.action === "join"
                    ? "Unirme al plan"
                    : "Salir del plan"}
                </h2>
                <button
                  onClick={() => setJoinModal(null)}
                  className="p-2 hover:bg-cream rounded-full"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Tu nombre"
                  placeholder="Ej: Juan Perez"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                />

                <Button
                  className="w-full"
                  variant={joinModal.action === "leave" ? "secondary" : "primary"}
                  onClick={() =>
                    joinModal.action === "join"
                      ? handleJoin(joinModal.planId)
                      : handleLeave(joinModal.planId)
                  }
                  disabled={!joinName.trim()}
                  loading={submitting}
                >
                  {joinModal.action === "join" ? "Confirmar" : "Salir del plan"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
