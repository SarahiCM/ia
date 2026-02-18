"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { api } from "../../convex/_generated/api";

type Vista = "clientes" | "ventas" | "quejas" | "resumen" | "chat";

const fieldClassName =
  "w-full rounded-xl border-2 border-purple-200 bg-purple-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200 placeholder-slate-400 hover:border-purple-300";

const cardClassName =
  "rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 p-6 shadow-[0_8px_24px_rgba(196,181,253,0.15)] backdrop-blur hover:shadow-[0_12px_32px_rgba(196,181,253,0.25)]";

export default function ChatDatos() {
  const [vistaActual, setVistaActual] = useState<Vista>("resumen");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100">
      <div className="pointer-events-none absolute -top-40 -left-24 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-purple-200/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-200/10 blur-3xl" />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border-2 border-purple-200 bg-gradient-to-r from-white to-purple-50/50 p-8 shadow-[0_12px_30px_rgba(196,181,253,0.2)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-purple-600">Sistema de datos</p>
          <h1 className="mt-2 text-3xl font-bold bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
            Chat de Análisis de Datos
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-700 leading-relaxed">
            Consulta y analiza información sobre clientes, ventas y quejas utilizando un chat inteligente con soporte de IA.
          </p>
        </section>

        <section className="mb-8">
          <div className="inline-flex flex-wrap rounded-2xl border-2 border-purple-200 bg-white/70 p-1.5 shadow-[0_4px_12px_rgba(196,181,253,0.15)] backdrop-blur">
            {(["resumen", "clientes", "ventas", "quejas", "chat"] as Vista[]).map((vista) => (
              <button
                key={vista}
                onClick={() => setVistaActual(vista)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  vistaActual === vista
                    ? "bg-gradient-to-r from-purple-400 to-purple-300 text-white shadow-lg shadow-purple-300/50"
                    : "text-purple-700 hover:bg-purple-100/50"
                }`}
              >
                {vista === "chat" ? "Chat IA" : vista.charAt(0).toUpperCase() + vista.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {vistaActual === "resumen"  && <ResumenDatos />}
        {vistaActual === "clientes" && <ListaClientes />}
        {vistaActual === "ventas"   && <ListaVentas />}
        {vistaActual === "quejas"   && <ListaQuejas />}
        {vistaActual === "chat"     && <ChatDatosIA />}
      </main>
    </div>
  );
}

function ResumenDatos() {
  const resumen = useQuery(api.datos.obtenerResumenDatos);
  return (
    <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[
        { label: "Clientes registrados",  value: resumen?.totalClientes ?? 0,                                  sub: "Clientes activos en el sistema" },
        { label: "Total de ventas",        value: resumen?.totalVentas ?? 0,                                    sub: "Transacciones registradas" },
        { label: "Monto total",            value: `$${resumen ? resumen.montoTotalVentas.toFixed(2) : "0.00"}`, sub: "En ventas" },
        { label: "Quejas registradas",     value: resumen?.totalQuejas ?? 0,                                    sub: "Que requieren atención" },
        { label: "Productos disponibles",  value: resumen?.productosDisponibles ?? 0,                           sub: "Con stock en almacén" },
        { label: "Venta promedio",         value: `$${resumen ? resumen.ventasPromedio.toFixed(2) : "0.00"}`,   sub: "Por transacción" },
      ].map(({ label, value, sub }) => (
        <article key={label} className={cardClassName}>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">{label}</p>
            <p className="mt-2 text-3xl font-bold text-purple-900">{value}</p>
          </div>
          <p className="text-sm text-purple-700">{sub}</p>
        </article>
      ))}
    </section>
  );
}

function ListaClientes() {
  const clientes = useQuery(api.datos.obtenerTodosLosClientes);
  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-purple-900">Clientes</h2>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {clientes?.length ?? 0} registros
          </span>
        </div>
        <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
          {clientes && clientes.length > 0 ? clientes.map((c) => (
            <div key={c._id} className="rounded-xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md">
              <p className="font-semibold text-purple-900">{c.nombreCliente}</p>
              <p className="text-sm text-purple-700">{c.email}</p>
              <p className="text-sm text-purple-700">{c.telefono}</p>
            </div>
          )) : (
            <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-8 text-center text-sm text-purple-600">
              No hay clientes registrados.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function ListaVentas() {
  const ventas = useQuery(api.datos.obtenerTodasLasVentas);
  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-purple-900">Ventas</h2>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {ventas?.length ?? 0} registros
          </span>
        </div>
        <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
          {ventas && ventas.length > 0 ? ventas.map((v) => (
            <div key={v._id} className="rounded-xl border-2 border-purple-200 bg-white p-4 hover:border-purple-300 hover:shadow-md">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-purple-900">{v.nombreCliente}</p>
                  <p className="text-sm text-purple-700">{v.producto}</p>
                </div>
                <span className="rounded-full bg-purple-200 px-3 py-1 text-xs font-bold text-purple-900">
                  ${v.monto.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <p className="rounded-lg bg-purple-100/60 p-2">
                  <span className="block text-xs font-bold uppercase text-purple-700 mb-1">Cantidad</span>
                  <span className="font-semibold">{v.cantidad}</span>
                </p>
                <p className="rounded-lg bg-purple-100/60 p-2">
                  <span className="block text-xs font-bold uppercase text-purple-700 mb-1">Unitario</span>
                  <span className="font-semibold">${(v.monto / v.cantidad).toFixed(2)}</span>
                </p>
                <p className="rounded-lg bg-purple-100/60 p-2">
                  <span className="block text-xs font-bold uppercase text-purple-700 mb-1">Fecha</span>
                  <span className="font-semibold text-xs">{new Date(v.fechaVenta).toLocaleDateString("es-MX")}</span>
                </p>
              </div>
            </div>
          )) : (
            <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-8 text-center text-sm text-purple-600">
              No hay ventas encontradas.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function ListaQuejas() {
  const [clienteBusqueda, setClienteBusqueda] = useState("");
  const quejas = useQuery(api.datos.obtenerTodasLasQuejas);
  const quejasFiltradas = quejas?.filter((q) =>
    q.nombreCliente.toLowerCase().includes(clienteBusqueda.toLowerCase())
  );
  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-purple-900">Quejas y reclamos</h2>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            {quejasFiltradas?.length ?? 0} registros
          </span>
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={clienteBusqueda}
            onChange={(e) => setClienteBusqueda(e.target.value)}
            className={fieldClassName}
          />
        </div>
        <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
          {quejasFiltradas && quejasFiltradas.length > 0 ? quejasFiltradas.map((q) => (
            <div key={q._id} className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 p-4 hover:border-red-300 hover:shadow-md">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-red-900">{q.nombreCliente}</p>
                  <p className="text-sm text-red-700">{q.email}</p>
                  <p className="text-sm text-red-700">{q.telefono}</p>
                </div>
                <span className="rounded-full bg-red-200 px-3 py-1 text-xs font-bold text-red-900">
                  {new Date(q.fechaQueja).toLocaleDateString("es-MX")}
                </span>
              </div>
              <p className="rounded-lg bg-red-100/60 p-3 text-sm text-red-900">{q.descripcion}</p>
            </div>
          )) : (
            <div className="rounded-xl border-2 border-dashed border-red-300 bg-red-50/50 p-8 text-center text-sm text-red-600">
              No hay quejas encontradas.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function ChatDatosIA() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat-ventas" }),
  });
  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  // Solo mostrar mensajes de usuario y asistente que tengan texto visible
  const mensajesVisibles = messages.filter((m) => {
    if (m.role === "user") return true;
    if (m.role === "assistant") {
      const texto = m.parts
        .filter((p) => p.type === "text")
        .map((p) => ("text" in p ? p.text : ""))
        .join("")
        .trim();
      return texto.length > 0;
    }
    return false;
  });

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

        <div className="mb-4 max-h-[520px] space-y-3 overflow-y-auto rounded-xl border-2 border-purple-200 bg-purple-50/50 p-4">
          {mensajesVisibles.length === 0 ? (
            <p className="text-sm text-purple-700">
              Hola, soy tu asistente de análisis de datos. Puedo ayudarte con consultas sobre clientes, ventas y quejas. Por ejemplo: ¿Cuál es el cliente con más compras? o ¿Cuál fue el monto total de ventas?
            </p>
          ) : (
            mensajesVisibles.map((message) => (
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
                <p className="whitespace-pre-wrap">
                  {message.parts
                    .filter((p) => p.type === "text")
                    .map((p) => ("text" in p ? p.text : ""))
                    .join("")}
                </p>
              </div>
            ))
          )}
          {isLoading && (
            <div className="mr-8 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-500">
              <p className="mb-1 text-xs font-semibold uppercase opacity-80">Asistente</p>
              <p className="animate-pulse">Consultando datos...</p>
            </div>
          )}
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