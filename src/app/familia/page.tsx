"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, X, Trash2, Edit2 } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FamilyTree } from "@/components/FamilyTree";
import { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from "@/lib/supabase";
import { FamilyMember } from "@/types";

export default function FamiliaPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showAddMotherForm, setShowAddMotherForm] = useState(false);
  const [showAddFatherForm, setShowAddFatherForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    second_last_name: "",
    mother_id: "",
    father_id: "",
  });

  useEffect(() => {
    fetchMembers();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchMembers, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMembers() {
    try {
      const data = await getFamilyMembers();
      setMembers(data || []);
    } catch (err) {
      console.error("Error fetching family members:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError("Por favor ingresa tu nombre y apellido");
      return;
    }

    if (formData.first_name.trim().length > 50) {
      setError("El nombre es demasiado largo (máximo 50 caracteres)");
      return;
    }

    if (formData.last_name.trim().length > 50) {
      setError("El apellido es demasiado largo (máximo 50 caracteres)");
      return;
    }

    if (formData.second_last_name.trim().length > 50) {
      setError("El segundo apellido es demasiado largo (máximo 50 caracteres)");
      return;
    }

    try {
      setSubmitting(true);

      if (editingMember) {
        // Update existing member
        await updateFamilyMember(editingMember.id, {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          second_last_name: formData.second_last_name.trim() || undefined,
          mother_id: formData.mother_id || undefined,
          father_id: formData.father_id || undefined,
        });
      } else {
        // Add new member
        await addFamilyMember({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          second_last_name: formData.second_last_name.trim() || undefined,
          mother_id: formData.mother_id || undefined,
          father_id: formData.father_id || undefined,
        });
      }

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        second_last_name: "",
        mother_id: "",
        father_id: "",
      });

      setShowForm(false);
      setEditingMember(null);
      setShowAddMotherForm(false);
      setShowAddFatherForm(false);

      // Refresh members
      await fetchMembers();
    } catch (err: unknown) {
      console.error("Error saving family member:", err);

      // Show detailed error message
      if (err && typeof err === 'object' && 'message' in err) {
        const errorMessage = (err as { message: string }).message;
        setError(`Error: ${errorMessage}`);
      } else {
        setError("Error al guardar miembro. Por favor intenta de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(member: FamilyMember) {
    setEditingMember(member);
    setFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      second_last_name: member.second_last_name || "",
      mother_id: member.mother_id || "",
      father_id: member.father_id || "",
    });
    setShowForm(true);
  }

  async function handleDelete(member: FamilyMember) {
    if (!confirm(`¿Estás seguro de eliminar a ${member.first_name} ${member.last_name} del árbol familiar?`)) {
      return;
    }

    try {
      await deleteFamilyMember(member.id);
      await fetchMembers();
    } catch (err: unknown) {
      console.error("Error deleting family member:", err);
      alert("Error al eliminar miembro. Por favor intenta de nuevo.");
    }
  }

  function handleAddNewParent(type: 'mother' | 'father') {
    if (type === 'mother') {
      setShowAddMotherForm(true);
    } else {
      setShowAddFatherForm(true);
    }
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingMember(null);
    setShowAddMotherForm(false);
    setShowAddFatherForm(false);
    setFormData({
      first_name: "",
      last_name: "",
      second_last_name: "",
      mother_id: "",
      father_id: "",
    });
    setError("");
  }

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Header */}
      <FadeInUp>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-primary">
              Árbol Familiar
            </h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Agregarme
          </Button>
        </div>
      </FadeInUp>

      {/* Stats */}
      <FadeInUp delay={0.1}>
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <p className="text-sm text-primary/60">
            Miembros de la familia: <span className="font-semibold text-primary">{members.length}</span>
          </p>
        </div>
      </FadeInUp>

      {/* Family Tree */}
      <FadeInUp delay={0.2}>
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-cream/50 rounded-xl">
            <p className="text-primary/60">Cargando árbol familiar...</p>
          </div>
        ) : (
          <FamilyTree
            members={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </FadeInUp>

      {/* Members List with Edit/Delete */}
      <FadeInUp delay={0.3}>
        <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
          <h2 className="text-xl font-serif font-bold text-primary mb-4">
            Todos los Miembros
          </h2>
          {members.length === 0 ? (
            <p className="text-primary/60 text-center py-4">
              No hay miembros aún
            </p>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-cream/30 rounded-lg hover:bg-cream/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-primary">
                      {member.first_name} {member.last_name}
                      {member.second_last_name && ` ${member.second_last_name}`}
                    </p>
                    {(member.mother_id || member.father_id) && (
                      <p className="text-sm text-primary/60">
                        {member.mother_id && members.find(m => m.id === member.mother_id) && (
                          <span>
                            Madre: {members.find(m => m.id === member.mother_id)?.first_name}
                          </span>
                        )}
                        {member.mother_id && member.father_id && " • "}
                        {member.father_id && members.find(m => m.id === member.father_id) && (
                          <span>
                            Padre: {members.find(m => m.id === member.father_id)?.first_name}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      aria-label="Editar"
                    >
                      <Edit2 className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(member)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeInUp>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-cream-dark p-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-serif font-bold text-primary">
                  {editingMember ? "Editar Miembro" : "Agregar Miembro"}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-cream rounded-lg transition-colors"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  maxLength={50}
                  required
                />

                <Input
                  label="Apellido Paterno"
                  placeholder="Tu apellido paterno"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  maxLength={50}
                  required
                />

                <Input
                  label="Apellido Materno (opcional)"
                  placeholder="Tu apellido materno"
                  value={formData.second_last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, second_last_name: e.target.value })
                  }
                  maxLength={50}
                />

                {/* Mother Selection */}
                <div>
                  <Select
                    label="Madre (opcional)"
                    value={formData.mother_id}
                    onChange={(e) =>
                      setFormData({ ...formData, mother_id: e.target.value })
                    }
                  >
                    <option value="">Ninguna / No sé</option>
                    {members
                      .filter(m => editingMember ? m.id !== editingMember.id : true)
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                          {member.second_last_name && ` ${member.second_last_name}`}
                        </option>
                      ))}
                  </Select>
                  {!formData.mother_id && (
                    <button
                      type="button"
                      onClick={() => handleAddNewParent('mother')}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      + Agregar nueva madre
                    </button>
                  )}
                </div>

                {/* Father Selection */}
                <div>
                  <Select
                    label="Padre (opcional)"
                    value={formData.father_id}
                    onChange={(e) =>
                      setFormData({ ...formData, father_id: e.target.value })
                    }
                  >
                    <option value="">Ninguno / No sé</option>
                    {members
                      .filter(m => editingMember ? m.id !== editingMember.id : true)
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                          {member.second_last_name && ` ${member.second_last_name}`}
                        </option>
                      ))}
                  </Select>
                  {!formData.father_id && (
                    <button
                      type="button"
                      onClick={() => handleAddNewParent('father')}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      + Agregar nuevo padre
                    </button>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseForm}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={submitting}
                    className="flex-1"
                  >
                    {editingMember ? "Guardar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Parent Modal */}
      <AnimatePresence>
        {(showAddMotherForm || showAddFatherForm) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddMotherForm(false);
              setShowAddFatherForm(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            >
              {/* Modal Header */}
              <div className="bg-white border-b border-cream-dark p-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-serif font-bold text-primary">
                  {showAddMotherForm ? "Agregar Madre" : "Agregar Padre"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddMotherForm(false);
                    setShowAddFatherForm(false);
                  }}
                  className="p-2 hover:bg-cream rounded-lg transition-colors"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-sm text-primary/70 mb-4">
                  Primero agrega a tu {showAddMotherForm ? "madre" : "padre"} como miembro del árbol.
                  Después podrás seleccionarla/o cuando agregues tu información.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAddMotherForm(false);
                      setShowAddFatherForm(false);
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddMotherForm(false);
                      setShowAddFatherForm(false);
                      // Keep the current form open but clear parent selection
                      setFormData({ ...formData, mother_id: "", father_id: "" });
                      // Open the regular form to add parent first
                      alert(
                        `Primero agrega a tu ${showAddMotherForm ? "madre" : "padre"} usando el botón "Agregarme". ` +
                        `Después edita tu información para seleccionarla/o como tu ${showAddMotherForm ? "madre" : "padre"}.`
                      );
                    }}
                    className="flex-1"
                  >
                    Entendido
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
