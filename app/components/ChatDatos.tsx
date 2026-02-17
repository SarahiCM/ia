"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useChat } from "@ai-sdk/react";
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
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-purple-600">
            Sistema de datos
          </p>
          <h1 className="mt-2 text-3xl font-bold bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
            Chat de Análisis de Datos
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-700 leading-relaxed">
            Consulta y analiza información sobre clientes, ventas y quejas utilizando un chat inteligente con soporte de IA.
          </p>
        </section>

        <section className="mb-8">
          <div className="inline-flex flex-wrap rounded-2xl border-2 border-purple-200 bg-white/70 p-1.5 shadow-[0_4px_12px_rgba(196,181,253,0.15)] backdrop-blur">
            <button
              onClick={() => setVistaActual("resumen")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "resumen"
                  ? "bg-gradient-to-r from-purple-400 to-purple-300 text-white shadow-lg shadow-purple-300/50"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setVistaActual("clientes")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "clientes"
                  ? "bg-gradient-to-r from-purple-400 to-purple-300 text-white shadow-lg shadow-purple-300/50"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setVistaActual("ventas")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "ventas"
                  ? "bg-gradient-to-r from-purple-400 to-purple-300 text-white shadow-lg shadow-purple-300/50"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Ventas
            </button>
            <button
              onClick={() => setVistaActual("quejas")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "quejas"
                  ? "bg-gradient-to-r from-purple-400 to-purple-300 text-white shadow-lg shadow-purple-300/50"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Quejas
            </button>
            <button
              onClick={() => setVistaActual("chat")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "chat"
                  ? "bg-gradient-to-r from-purple-400 to-purple-300 text-white shadow-lg shadow-purple-300/50"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Chat IA
            </button>
          </div>
        </section>

        {vistaActual === "resumen" && <ResumenDatos />}
        {vistaActual === "clientes" && <ListaClientes />}
        {vistaActual === "ventas" && <ListaVentas />}
        {vistaActual === "quejas" && <ListaQuejas />}
        {vistaActual === "chat" && <ChatDatosIA />}
      </main>
    </div>
  );
}

function ResumenDatos() {
  const resumen = useQuery(api.datos.obtenerResumenDatos);

  return (
    <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <article className={cardClassName}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Clientes registrados
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {resumen?.totalClientes ?? 0}
          </p>
        </div>
        <p className="text-sm text-purple-700">
          Clientes activos en el sistema
        </p>
      </article>

      <article className={cardClassName}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Total de ventas
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {resumen?.totalVentas ?? 0}
          </p>
        </div>
        <p className="text-sm text-purple-700">
          Transacciones registradas
        </p>
      </article>

      <article className={cardClassName}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Monto total
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            ${resumen ? resumen.montoTotalVentas.toFixed(2) : "0.00"}
          </p>
        </div>
        <p className="text-sm text-purple-700">
          En ventas
        </p>
      </article>

      <article className={cardClassName}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Quejas registradas
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {resumen?.totalQuejas ?? 0}
          </p>
        </div>
        <p className="text-sm text-purple-700">
          Que requieren atención
        </p>
      </article>

      <article className={cardClassName}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Productos disponibles
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {resumen?.productosDisponibles ?? 0}
          </p>
        </div>
        <p className="text-sm text-purple-700">
          Con stock en almacén
        </p>
      </article>

      <article className={cardClassName}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Venta promedio
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            ${resumen ? resumen.ventasPromedio.toFixed(2) : "0.00"}
          </p>
        </div>
        <p className="text-sm text-purple-700">
          Por transacción
        </p>
      </article>
    </section>
  );
}

function ListaClientes() {
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const clientes = useQuery(api.datos.obtenerTodosLosClientes);

  const clientesFiltrados = clientes?.filter((c) =>
    c.nombreCliente.toLowerCase().includes(nombreBusqueda.toLowerCase())
  );

  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-purple-900">Clientes</h2>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {clientesFiltrados?.length ?? 0} registros
          </span>
        </div>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={nombreBusqueda}
            onChange={(e) => setNombreBusqueda(e.target.value)}
            className={fieldClassName}
          />
        </div>

        <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
          {clientesFiltrados && clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <div
                key={cliente._id}
                className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 hover:border-purple-300 hover:shadow-md"
              >
                <p className="font-semibold text-purple-900">
                  {cliente.nombreCliente}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-purple-900">
                  <p>
                    <span className="font-semibold">Email:</span> {cliente.email}
                  </p>
                  <p>
                    <span className="font-semibold">Teléfono:</span>{" "}
                    {cliente.telefono}
                  </p>
                  <p className="col-span-2">
                    <span className="font-semibold">Dirección:</span>{" "}
                    {cliente.direccion}
                  </p>
                  <p>
                    <span className="font-semibold">Registrado:</span>{" "}
                    {new Date(cliente.fechaRegistro).toLocaleDateString(
                      "es-MX"
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-8 text-center text-sm text-purple-600">
              No hay clientes encontrados.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function ListaVentas() {
  const [clienteBusqueda, setClienteBusqueda] = useState("");
  const ventas = useQuery(api.datos.obtenerTodasLasVentas);

  const ventasFiltradas = ventas?.filter((v) =>
    v.nombreCliente.toLowerCase().includes(clienteBusqueda.toLowerCase())
  );

  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-purple-900">Ventas</h2>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {ventasFiltradas?.length ?? 0} registros
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
          {ventasFiltradas && ventasFiltradas.length > 0 ? (
            ventasFiltradas.map((venta) => (
              <div
                key={venta._id}
                className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 hover:border-purple-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-purple-900">
                      {venta.nombreCliente}
                    </p>
                    <p className="text-sm text-purple-700">
                      Producto: {venta.producto}
                    </p>
                  </div>
                  <span className="rounded-full bg-purple-200 px-3 py-1 text-xs font-bold text-purple-900">
                    ${venta.monto.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm text-purple-900">
                  <p className="rounded-lg bg-purple-100/60 p-2">
                    <span className="block text-xs font-bold uppercase tracking-wide text-purple-700 mb-1">
                      Cantidad
                    </span>
                    <span className="font-semibold">{venta.cantidad}</span>
                  </p>
                  <p className="rounded-lg bg-purple-100/60 p-2">
                    <span className="block text-xs font-bold uppercase tracking-wide text-purple-700 mb-1">
                      Unitario
                    </span>
                    <span className="font-semibold">
                      ${(venta.monto / venta.cantidad).toFixed(2)}
                    </span>
                  </p>
                  <p className="rounded-lg bg-purple-100/60 p-2">
                    <span className="block text-xs font-bold uppercase tracking-wide text-purple-700 mb-1">
                      Fecha
                    </span>
                    <span className="font-semibold text-xs">
                      {new Date(venta.fechaVenta).toLocaleDateString("es-MX")}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
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
          {quejasFiltradas && quejasFiltradas.length > 0 ? (
            quejasFiltradas.map((queja) => (
              <div
                key={queja._id}
                className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 p-4 hover:border-red-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-red-900">
                      {queja.nombreCliente}
                    </p>
                    <p className="text-sm text-red-700">{queja.email}</p>
                    <p className="text-sm text-red-700">{queja.telefono}</p>
                  </div>
                  <span className="rounded-full bg-red-200 px-3 py-1 text-xs font-bold text-red-900">
                    {new Date(queja.fechaQueja).toLocaleDateString("es-MX")}
                  </span>
                </div>

                <p className="rounded-lg bg-red-100/60 p-3 text-sm text-red-900">
                  {queja.descripcion}
                </p>
              </div>
            ))
          ) : (
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
  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-purple-900">Chat con IA</h2>
            <p className="text-sm text-purple-700">
              Consulta y analiza datos de clientes, ventas y quejas usando IA.
            </p>
          </div>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {isLoading ? "Analizando..." : "Listo"}
          </span>
        </div>

        <div className="mb-4 max-h-[520px] space-y-3 overflow-y-auto rounded-xl border-2 border-purple-200 bg-purple-50/50 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-purple-700">
              Hola, soy tu asistente de análisis de datos. Puedo ayudarte con consultas sobre clientes, ventas y quejas. Por ejemplo:s ¿Cuál es el cliente con más compras? o ¿Cuál fue el monto total de ventas este mes?
            </p>
          ) : (
            messages.map((message) => (
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
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part, index) => (
                    <p key={`${message.id}-${index}`} className="whitespace-pre-wrap">
                      {part.text}
                    </p>
                  ))}
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const text = input.trim();
            if (!text || isLoading) return;
            sendMessage({ text });
            setInput("");
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
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

        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            Error: {error.message}
          </p>
        ) : null}
      </article>
    </section>
  );
}
