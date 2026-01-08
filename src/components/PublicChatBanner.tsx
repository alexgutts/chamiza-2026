"use client";

import { useState, useEffect, useRef } from "react";
import { getChatMessages, addChatMessage } from "@/lib/supabase";
import { PublicChatMessage } from "@/types";
import { Send, MessageCircle } from "lucide-react";

const STORAGE_KEY = "chamiza_chat_name";

export function PublicChatBanner() {
  const [messages, setMessages] = useState<PublicChatMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved name from localStorage
    const savedName = localStorage.getItem(STORAGE_KEY);
    if (savedName) {
      setName(savedName);
    }

    fetchMessages();

    // Poll for new messages every 20 seconds
    const interval = setInterval(fetchMessages, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-scroll to the end when new messages arrive
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [messages]);

  async function fetchMessages() {
    try {
      const data = await getChatMessages(50);
      // Reverse to show oldest first (left to right)
      setMessages((data || []).reverse());
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      return;
    }

    if (name.trim().length > 50) {
      alert("Nombre demasiado largo (máximo 50 caracteres)");
      return;
    }

    if (message.trim().length > 200) {
      alert("Mensaje demasiado largo (máximo 200 caracteres)");
      return;
    }

    try {
      setSubmitting(true);

      // Save name to localStorage
      localStorage.setItem(STORAGE_KEY, name.trim());

      await addChatMessage({
        author_name: name.trim(),
        message: message.trim(),
      });

      setMessage("");

      // Refresh messages
      await fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error al enviar mensaje. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-lg border-b border-cream-dark shadow-sm">
      <div
        ref={scrollContainerRef}
        className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Messages */}
        {messages.length === 0 ? (
          <div className="flex items-center gap-2 text-primary/60 text-sm whitespace-nowrap">
            <MessageCircle className="w-4 h-4" />
            <span>No hay mensajes aún. Sé el primero en escribir!</span>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex-shrink-0 bg-cream/80 rounded-full px-4 py-2 max-w-[250px] sm:max-w-[300px]"
            >
              <p className="text-xs font-medium text-primary/80">{msg.author_name}</p>
              <p className="text-sm text-primary break-words">{msg.message}</p>
            </div>
          ))
        )}

        {/* Inline Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-shrink-0 flex gap-2 items-center ml-auto"
        >
          {!name && (
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="w-28 sm:w-32 px-3 py-2 rounded-full border-2 border-cream-dark bg-white text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary"
            />
          )}
          <input
            type="text"
            placeholder="di lo que quieras aqui ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            className="w-48 sm:w-64 px-4 py-2 rounded-full border-2 border-cream-dark bg-white text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enviar mensaje"
          >
            {submitting ? (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
