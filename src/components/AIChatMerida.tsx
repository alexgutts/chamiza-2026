"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Loader2, X, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AIChatMerida() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (!isExpanded) {
      setIsExpanded(true);
    }

    try {
      const response = await fetch("/api/chat-merida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
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
          content: "No pude conectarme. Intenta de nuevo, por fa.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const suggestions = [
    "Mejores cenotes",
    "Donde comer cochinita",
    "Ruinas cerca de Merida",
    "Playas bonitas",
  ];

  return (
    <div className="sticky top-14 z-30 border-b border-coffee-cream/50 shadow-sm">
      {/* Main bar - always visible */}
      <div className="bg-gradient-to-r from-coffee-dark via-coffee to-coffee-dark">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-coffee-cream/20 flex items-center justify-center">
                <Compass size={18} className="text-coffee-milk" />
              </div>
            </div>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                onFocus={() => !isExpanded && messages.length > 0 && setIsExpanded(true)}
                placeholder="preguntame algo, por fa"
                className="w-full px-4 py-2.5 bg-coffee-milk/15 border border-coffee-cream/30 rounded-full text-sm text-coffee-milk placeholder:text-coffee-cream/60 focus:outline-none focus:bg-coffee-milk/20 focus:border-coffee-cream/50 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-coffee-cream/20 text-coffee-milk disabled:opacity-30 disabled:cursor-not-allowed hover:bg-coffee-cream/30 transition-colors"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>

            {isExpanded && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-2 rounded-full text-coffee-cream/60 hover:text-coffee-milk hover:bg-coffee-milk/10 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick suggestions - only when no messages */}
          {messages.length === 0 && !isExpanded && (
            <div className="flex gap-2 mt-2.5 max-w-2xl mx-auto overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    setTimeout(() => {
                      const msg: ChatMessage = { role: "user", content: s };
                      setMessages([msg]);
                      setIsExpanded(true);
                      setIsLoading(true);
                      setInput("");

                      fetch("/api/chat-merida", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ messages: [msg] }),
                      })
                        .then((r) => r.json())
                        .then((data) => {
                          setMessages((prev) => [
                            ...prev,
                            { role: "assistant", content: data.response },
                          ]);
                        })
                        .catch(() => {
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "assistant",
                              content: "No pude conectarme. Intenta de nuevo.",
                            },
                          ]);
                        })
                        .finally(() => setIsLoading(false));
                    }, 0);
                  }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-coffee-milk/10 border border-coffee-cream/20 text-xs text-coffee-cream hover:bg-coffee-milk/20 hover:text-coffee-milk transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded chat area */}
      <AnimatePresence>
        {isExpanded && messages.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-coffee-milk/95 backdrop-blur-sm max-h-[50vh] overflow-y-auto">
              <div className="p-4 space-y-3 max-w-2xl mx-auto">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] px-4 py-2.5 rounded-2xl",
                        message.role === "user"
                          ? "bg-coffee text-white rounded-br-md"
                          : "bg-white text-coffee-dark rounded-bl-md shadow-sm border border-coffee-cream/30"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-coffee-cream/30">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-coffee/40 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
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
