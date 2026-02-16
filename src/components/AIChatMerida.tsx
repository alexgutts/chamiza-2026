"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export function AIChatMerida() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    if (!isExpanded) {
      setIsExpanded(true);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) throw new Error("Error en la respuesta");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ay, algo salio mal. Intenta de nuevo en un momento.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="sticky top-14 z-30">
      {/* Main search bar */}
      <div className="bg-gradient-to-r from-cafe-deep via-cafe to-cafe-dark border-b border-cafe-warm/30">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-cafe-cream/80">
              <Sparkles size={18} className="text-cafe-warm" />
              <MapPin size={16} />
            </div>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => messages.length > 0 && setIsExpanded(true)}
                placeholder="preguntame algo, por fa"
                className="w-full px-4 py-2.5 bg-cafe-cream/15 backdrop-blur-sm border border-cafe-warm/30 rounded-full text-sm text-cafe-cream placeholder:text-cafe-cream/50 focus:outline-none focus:ring-2 focus:ring-cafe-warm/40 focus:bg-cafe-cream/20 transition-all"
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-cafe-warm text-cafe-deep flex items-center justify-center hover:bg-cafe-warm/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Enviar pregunta"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>

            {messages.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-cafe-cream/10 text-cafe-cream/70 flex items-center justify-center hover:bg-cafe-cream/20 transition-colors"
                aria-label={isExpanded ? "Cerrar chat" : "Abrir chat"}
              >
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable chat area */}
      <AnimatePresence>
        {isExpanded && messages.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-cafe-cream border-b-2 border-cafe-warm/30"
          >
            <div className="max-w-3xl mx-auto">
              <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "flex",
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl",
                        message.role === "user"
                          ? "bg-cafe text-cafe-cream rounded-br-md"
                          : "bg-white text-cafe-dark rounded-bl-md shadow-sm border border-cafe-warm/20"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <MapPin size={12} className="text-cafe-warm" />
                          <span className="text-[10px] font-medium text-cafe-warm uppercase tracking-wider">
                            Guia de Merida
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-cafe-warm/20">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-cafe-warm/60 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.5,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-cafe/60">
                          buscando...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
