"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const fieldClassName =
  "w-full rounded-xl border-2 border-purple-200 bg-purple-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200 placeholder-slate-400 hover:border-purple-300";

const cardClassName =
  "rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 p-6 shadow-[0_8px_24px_rgba(196,181,253,0.15)] backdrop-blur hover:shadow-[0_12px_32px_rgba(196,181,253,0.25)]";

export default function ChatDatosIA() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat-ventas" }),
  });
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  const mensajesVisibles = messages.filter((m) => m.role === "user" || m.role === "assistant");

  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-purple-900">Chat con IA</h2>
            <p className="text-sm text-purple-700">Consulta y analiza datos de clientes, ventas y quejas usando IA.</p>
          </div>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {isLoading ? "Analizando..." : "Listo"}
          </span>
        </div>

        <div
          ref={scrollRef}
          className="mb-4 max-h-[520px] space-y-3 overflow-y-auto rounded-xl border-2 border-purple-200 bg-purple-50/50 p-4"
        >
          {mensajesVisibles.length === 0 ? (
            <p className="text-sm text-purple-700">
              Hola, soy tu asistente de análisis de datos. Puedo ayudarte con consultas sobre clientes, ventas y quejas. Por ejemplo: ¿Cuál es el cliente con más compras? o ¿Cuál fue el monto total de ventas?
            </p>
          ) : (
            mensajesVisibles.map((message, idx) => {
              const texto = message.parts
                .filter((p) => p.type === "text")
                .map((p) => ("text" in p ? p.text : ""))
                .join("");

              const esUltimoAsistente = message.role === "assistant" && idx === mensajesVisibles.length - 1;

              if (esUltimoAsistente && isLoading && texto.trim() === "") {
                return (
                  <div key={message.id} className="mr-8 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-500">
                    <p className="mb-1 text-xs font-semibold uppercase opacity-80">Asistente</p>
                    <p className="animate-pulse">Consultando base de datos...</p>
                  </div>
                );
              }

              if (message.role === "assistant" && texto.trim() === "") return null;

              return (
                <div
                  key={message.id}
                  className={`rounded-xl px-4 py-3 text-sm ${
                    message.role === "assistant"
                      ? "mr-8 border border-purple-200 bg-white text-slate-800"
                      : "ml-8 bg-purple-500 text-white"
                  }`}
                >
                  <p className="mb-1 text-xs font-semibold uppercase opacity-80">
                    {message.role === "assistant" ? "Asistente" : "Tú"}
                  </p>
                  <p className="whitespace-pre-wrap">{texto}</p>
                </div>
              );
            })
          )}
          {isLoading && (mensajesVisibles.length === 0 || mensajesVisibles[mensajesVisibles.length - 1]?.role === "user") && (
            <div className="mr-8 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-500">
              <p className="mb-1 text-xs font-semibold uppercase opacity-80">Asistente</p>
              <p className="animate-pulse">Consultando base de datos...</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre los datos..."
            className={fieldClassName}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-gradient-to-r from-purple-400 to-purple-300 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-purple-400 disabled:opacity-60"
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm font-medium text-red-600">Error: {error.message}</p>
        )}
      </article>
    </section>
  );
}