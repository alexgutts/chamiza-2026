"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { isAdmin, login, logout } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (login(password)) {
      setPassword("");
      onClose();
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Lock size={20} />
            {isAdmin ? "Modo Administrador" : "Acceso Administrador"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream rounded-full"
          >
            <X size={20} className="text-primary" />
          </button>
        </div>

        {isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-primary/70">
              Estas conectado como administrador. Puedes eliminar fotos y gestionar contenido.
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Cerrar sesion de admin
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingresa la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />

            <Button type="submit" className="w-full" disabled={!password}>
              Ingresar
            </Button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
