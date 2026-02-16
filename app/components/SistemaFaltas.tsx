"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useChat } from "@ai-sdk/react";
import { api } from "../../convex/_generated/api";

type Vista = "registro" | "mensajes" | "chat";
type Tono = "formal" | "amigable" | "serio";

const fieldClassName =
  "w-full rounded-xl border-2 border-blue-200 bg-blue-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-slate-400 hover:border-blue-300";
const cardClassName =
  "rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-[0_8px_24px_rgba(168,216,255,0.15)] backdrop-blur hover:shadow-[0_12px_32px_rgba(168,216,255,0.25)]";

export default function SistemaFaltas() {
  const [vistaActual, setVistaActual] = useState<Vista>("registro");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100">
      <div className="pointer-events-none absolute -top-40 -left-24 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-blue-200/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/10 blur-3xl" />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-white to-blue-50/50 p-8 shadow-[0_12px_30px_rgba(168,216,255,0.2)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
            Control academico
          </p>
          <h1 className="mt-2 text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent sm:text-4xl">
            Sistema de Gestion de Faltas
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-700 leading-relaxed">
            Registra incidencias, centraliza el historial por alumno y genera
            mensajes para padres con apoyo de IA.
          </p>
        </section>

        <section className="mb-8">
          <div className="inline-flex flex-wrap rounded-2xl border-2 border-blue-200 bg-white/70 p-1.5 shadow-[0_4px_12px_rgba(168,216,255,0.15)] backdrop-blur">
            <button
              onClick={() => setVistaActual("registro")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "registro"
                  ? "bg-gradient-to-r from-blue-400 to-blue-300 text-white shadow-lg shadow-blue-300/50"
                  : "text-blue-700 hover:bg-blue-100/50"
              }`}
            >
              Registro de faltas
            </button>
            <button
              onClick={() => setVistaActual("mensajes")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "mensajes"
                  ? "bg-gradient-to-r from-blue-400 to-blue-300 text-white shadow-lg shadow-blue-300/50"
                  : "text-blue-700 hover:bg-blue-100/50"
              }`}
            >
              Mensajes para padres
            </button>
            <button
              onClick={() => setVistaActual("chat")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                vistaActual === "chat"
                  ? "bg-gradient-to-r from-blue-400 to-blue-300 text-white shadow-lg shadow-blue-300/50"
                  : "text-blue-700 hover:bg-blue-100/50"
              }`}
            >
              Chat amigable
            </button>
          </div>
        </section>

        {vistaActual === "registro" ? (
          <RegistroFaltas />
        ) : vistaActual === "mensajes" ? (
          <GeneradorMensajes />
        ) : (
          <ChatAmigable />
        )}
      </main>
    </div>
  );
}

function RegistroFaltas() {
  const [nombrePadre, setNombrePadre] = useState("");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [diasQueFalto, setDiasQueFalto] = useState(1);
  const [fechaQueFalto, setFechaQueFalto] = useState("");
  const [grado, setGrado] = useState("");

  const registrarFalta = useMutation(api.faltas.registrarFalta);
  const eliminarFalta = useMutation(api.faltas.eliminarFalta);
  const faltas = useQuery(api.faltas.obtenerTodasLasFaltas);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registrarFalta({
      nombrePadre,
      nombreAlumno,
      diasQueFalto,
      fechaQueFalto,
      grado,
    });

    setNombrePadre("");
    setNombreAlumno("");
    setDiasQueFalto(1);
    setFechaQueFalto("");
    setGrado("");
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Nueva falta</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Formulario
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-blue-900">
              Nombre del padre o madre
            </label>
            <input
              type="text"
              placeholder="Ej: Maria Gonzalez"
              value={nombrePadre}
              onChange={(e) => setNombrePadre(e.target.value)}
              className={fieldClassName}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-blue-900">
              Nombre del alumno
            </label>
            <input
              type="text"
              placeholder="Ej: Juan Gonzalez Lopez"
              value={nombreAlumno}
              onChange={(e) => setNombreAlumno(e.target.value)}
              className={fieldClassName}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-900">
                Dias que falto
              </label>
              <input
                type="number"
                value={diasQueFalto}
                onChange={(e) => setDiasQueFalto(Number(e.target.value))}
                className={fieldClassName}
                min="1"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-900">
                Fecha de la falta
              </label>
              <input
                type="date"
                value={fechaQueFalto}
                onChange={(e) => setFechaQueFalto(e.target.value)}
                className={fieldClassName}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-blue-900">
              Grado
            </label>
            <input
              type="text"
              placeholder="Ej: 3 Primaria"
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
              className={fieldClassName}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-400 to-blue-300 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-300/40 hover:shadow-blue-400/50"
          >
            Guardar falta
          </button>
        </form>
      </article>

      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-900">Faltas registradas</h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {faltas?.length ?? 0} registros
          </span>
        </div>

        <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
          {faltas && faltas.length > 0 ? (
            faltas.map((falta) => (
              <div
                key={falta._id}
                className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-blue-900">{falta.nombreAlumno}</p>
                    <p className="text-sm text-blue-700">{falta.nombrePadre}</p>
                  </div>
                  <button
                    onClick={() => eliminarFalta({ id: falta._id })}
                    className="rounded-lg border-2 border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-300"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm text-blue-900">
                  <p className="rounded-lg bg-blue-100/60 p-2">
                    <span className="block text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">
                      Grado
                    </span>
                    <span className="font-semibold">{falta.grado}</span>
                  </p>
                  <p className="rounded-lg bg-blue-100/60 p-2">
                    <span className="block text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">
                      Dias
                    </span>
                    <span className="font-semibold">{falta.diasQueFalto}</span>
                  </p>
                  <p className="rounded-lg bg-blue-100/60 p-2">
                    <span className="block text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">
                      Fecha
                    </span>
                    <span className="font-semibold">{falta.fechaQueFalto}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-8 text-center text-sm text-blue-600">
              Todavia no hay faltas registradas.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function GeneradorMensajes() {
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
  const [mensajeGenerado, setMensajeGenerado] = useState("");
  const [generando, setGenerando] = useState(false);
  const [tono, setTono] = useState<Tono>("formal");
  const [copiado, setCopiado] = useState(false);

  const alumnos = useQuery(api.faltas.obtenerAlumnosConFaltas);
  const resumenAlumno = useQuery(
    api.faltas.obtenerResumenPorAlumno,
    alumnoSeleccionado ? { nombreAlumno: alumnoSeleccionado } : "skip"
  );
  const guardarMensaje = useMutation(api.faltas.guardarMensaje);
  const mensajesGuardados = useQuery(api.faltas.obtenerMensajes);
  const marcarEnviado = useMutation(api.faltas.marcarMensajeEnviado);

  const generarMensajeConIA = async () => {
    if (!resumenAlumno) return;

    setGenerando(true);
    setMensajeGenerado("");
    setCopiado(false);

    try {
      const response = await fetch("/api/generar-mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreAlumno: resumenAlumno.nombreAlumno,
          nombrePadre: resumenAlumno.nombrePadre,
          grado: resumenAlumno.grado,
          totalDiasFaltados: resumenAlumno.totalDiasFaltados,
          totalRegistros: resumenAlumno.totalRegistros,
          faltas: resumenAlumno.faltas,
          tono,
        }),
      });

      const data = await response.json();
      setMensajeGenerado(
        data.success
          ? data.mensaje
          : "No fue posible generar el mensaje. Intenta nuevamente."
      );
    } catch (error) {
      console.error("Error:", error);
      setMensajeGenerado("No fue posible generar el mensaje. Intenta nuevamente.");
    } finally {
      setGenerando(false);
    }
  };

  const guardarYCopiar = async () => {
    if (!resumenAlumno || !mensajeGenerado) return;

    await guardarMensaje({
      nombrePadre: resumenAlumno.nombrePadre,
      nombreAlumno: resumenAlumno.nombreAlumno,
      mensaje: mensajeGenerado,
      totalFaltas: resumenAlumno.totalDiasFaltados,
    });

    await navigator.clipboard.writeText(mensajeGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const copiarMensaje = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-900">Generar mensaje</h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            IA asistida
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-blue-900">
              Selecciona un alumno
            </label>
            <select
              value={alumnoSeleccionado}
              onChange={(e) => setAlumnoSeleccionado(e.target.value)}
              className={fieldClassName}
            >
              <option value="">Selecciona un alumno...</option>
              {alumnos?.map((alumno) => (
                <option key={alumno.nombreAlumno} value={alumno.nombreAlumno}>
                  {alumno.nombreAlumno} ({alumno.totalDiasFaltados} dias)
                </option>
              ))}
            </select>
          </div>

          {resumenAlumno ? (
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50 p-4 text-sm text-blue-900">
              <p className="mb-3 font-bold text-blue-900">Resumen del alumno</p>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="font-semibold">Padre/Madre:</span>
                  <span>{resumenAlumno.nombrePadre}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Grado:</span>
                  <span>{resumenAlumno.grado}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Dias faltados:</span>
                  <span className="font-bold text-red-600">
                    {resumenAlumno.totalDiasFaltados}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Total registros:</span>
                  <span>{resumenAlumno.totalRegistros}</span>
                </p>
              </div>
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-semibold text-blue-900">
              Tono del mensaje
            </label>
            <select
              value={tono}
              onChange={(e) => setTono(e.target.value as Tono)}
              className={fieldClassName}
            >
              <option value="formal">Formal</option>
              <option value="amigable">Amigable</option>
              <option value="serio">Serio</option>
            </select>
          </div>

          <button
            onClick={generarMensajeConIA}
            disabled={!alumnoSeleccionado || generando}
            className="w-full rounded-xl bg-gradient-to-r from-blue-400 to-blue-300 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:from-blue-200 disabled:to-blue-200 disabled:opacity-60 shadow-lg shadow-blue-300/40 hover:shadow-blue-400/50"
          >
            {generando ? "Generando mensaje..." : "Generar mensaje con IA"}
          </button>

          {mensajeGenerado ? (
            <div className="space-y-3">
              <div className="max-h-96 overflow-y-auto rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-blue-900 leading-relaxed">
                  {mensajeGenerado}
                </pre>
              </div>
              <button
                onClick={guardarYCopiar}
                className="w-full rounded-xl bg-gradient-to-r from-green-400 to-green-300 px-4 py-3 text-sm font-semibold text-white transition hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-300/40 hover:shadow-green-400/50"
              >
                {copiado ? "Guardado y copiado" : "Guardar y copiar mensaje"}
              </button>
            </div>
          ) : null}
        </div>
      </article>

      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-900">Mensajes guardados</h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {mensajesGuardados?.length ?? 0} items
          </span>
        </div>

        <div className="max-h-[700px] space-y-3 overflow-y-auto pr-1">
          {mensajesGuardados && mensajesGuardados.length > 0 ? (
            mensajesGuardados.map((msg) => (
              <div
                key={msg._id}
                className={`rounded-xl border-2 p-4 transition ${
                  msg.enviado
                    ? "border-green-200 bg-gradient-to-br from-green-50 to-green-100/40 hover:border-green-300"
                    : "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/40 hover:border-blue-300"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-blue-900">{msg.nombreAlumno}</p>
                    <p className="text-sm text-blue-700">Para: {msg.nombrePadre}</p>
                    <p className="text-xs text-blue-600">
                      {new Date(msg.fechaGeneracion).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap ${
                      msg.enviado
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {msg.enviado ? "Enviado" : "Pendiente"}
                  </span>
                </div>

                <p className="mb-4 max-h-24 overflow-hidden text-sm text-blue-900 line-clamp-3">
                  {msg.mensaje}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copiarMensaje(msg.mensaje)}
                    className="rounded-lg border-2 border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 hover:border-blue-300"
                  >
                    Copiar
                  </button>
                  {!msg.enviado ? (
                    <button
                      onClick={() => marcarEnviado({ id: msg._id })}
                      className="rounded-lg border-2 border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 hover:border-green-300"
                    >
                      Marcar como enviado
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-8 text-center text-sm text-blue-600">
              No hay mensajes guardados por ahora.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function ChatAmigable() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  return (
    <section className="mx-auto w-full max-w-4xl">
      <article className={cardClassName}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Chat amigable</h2>
            <p className="text-sm text-blue-700">
              Este chat usa directamente el endpoint `app/api/chat/route.ts`.
            </p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {isLoading ? "Escribiendo..." : "En linea"}
          </span>
        </div>

        <div className="mb-4 max-h-[520px] space-y-3 overflow-y-auto rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-blue-700">
              Hola, estoy para ayudarte. Escribe cualquier duda y te respondo
              de forma clara y amigable.
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl px-4 py-3 text-sm ${
                  message.role === "assistant"
                    ? "mr-8 border border-blue-200 bg-white text-slate-800"
                    : "ml-8 bg-blue-500 text-white"
                }`}
              >
                <p className="mb-1 text-xs font-semibold uppercase opacity-80">
                  {message.role === "assistant" ? "Asistente" : "Tu"}
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
            placeholder="Escribe tu mensaje..."
            className={fieldClassName}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-gradient-to-r from-blue-400 to-blue-300 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-blue-400 disabled:opacity-60"
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
