// convex/faltas.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Registrar una falta
export const registrarFalta = mutation({
  args: {
    nombrePadre: v.string(),
    nombreAlumno: v.string(),
    diasQueFalto: v.number(),
    fechaQueFalto: v.string(),
    grado: v.string(),
  },
  handler: async (ctx, args) => {
    const faltaId = await ctx.db.insert("faltas", {
      nombrePadre: args.nombrePadre,
      nombreAlumno: args.nombreAlumno,
      diasQueFalto: args.diasQueFalto,
      fechaQueFalto: args.fechaQueFalto,
      grado: args.grado,
    });
    return faltaId;
  },
});

// Obtener todas las faltas
export const obtenerTodasLasFaltas = query({
  handler: async (ctx) => {
    return await ctx.db.query("faltas").collect();
  },
});

// Obtener faltas por alumno
export const obtenerFaltasPorAlumno = query({
  args: { nombreAlumno: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("faltas")
      .withIndex("by_alumno", (q) => q.eq("nombreAlumno", args.nombreAlumno))
      .collect();
  },
});

// Obtener faltas por grado
export const obtenerFaltasPorGrado = query({
  args: { grado: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("faltas")
      .withIndex("by_grado", (q) => q.eq("grado", args.grado))
      .collect();
  },
});

// Actualizar una falta
export const actualizarFalta = mutation({
  args: {
    id: v.id("faltas"),
    nombrePadre: v.optional(v.string()),
    nombreAlumno: v.optional(v.string()),
    diasQueFalto: v.optional(v.number()),
    fechaQueFalto: v.optional(v.string()),
    grado: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Eliminar una falta
export const eliminarFalta = mutation({
  args: { id: v.id("faltas") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Obtener alumnos con el total de dias faltados
export const obtenerAlumnosConFaltas = query({
  handler: async (ctx) => {
    const faltas = await ctx.db.query("faltas").collect();
    const acumulado = new Map<string, number>();

    for (const falta of faltas) {
      const totalActual = acumulado.get(falta.nombreAlumno) ?? 0;
      acumulado.set(falta.nombreAlumno, totalActual + falta.diasQueFalto);
    }

    return Array.from(acumulado.entries())
      .map(([nombreAlumno, totalDiasFaltados]) => ({
        nombreAlumno,
        totalDiasFaltados,
      }))
      .sort((a, b) => b.totalDiasFaltados - a.totalDiasFaltados);
  },
});

// Resumen completo de faltas por alumno
export const obtenerResumenPorAlumno = query({
  args: { nombreAlumno: v.string() },
  handler: async (ctx, args) => {
    const faltas = await ctx.db
      .query("faltas")
      .withIndex("by_alumno", (q) => q.eq("nombreAlumno", args.nombreAlumno))
      .collect();

    if (faltas.length === 0) return null;

    const totalDiasFaltados = faltas.reduce(
      (acum, falta) => acum + falta.diasQueFalto,
      0
    );
    const faltaMasReciente = [...faltas].sort((a, b) =>
      b.fechaQueFalto.localeCompare(a.fechaQueFalto)
    )[0];

    return {
      nombreAlumno: args.nombreAlumno,
      nombrePadre: faltaMasReciente.nombrePadre,
      grado: faltaMasReciente.grado,
      totalDiasFaltados,
      totalRegistros: faltas.length,
      faltas,
    };
  },
});

// Guardar mensaje generado para padres
export const guardarMensaje = mutation({
  args: {
    nombrePadre: v.string(),
    nombreAlumno: v.string(),
    mensaje: v.string(),
    totalFaltas: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mensajesPadres", {
      nombrePadre: args.nombrePadre,
      nombreAlumno: args.nombreAlumno,
      mensaje: args.mensaje,
      totalFaltas: args.totalFaltas,
      fechaGeneracion: new Date().toISOString(),
      enviado: false,
    });
  },
});

// Obtener mensajes guardados
export const obtenerMensajes = query({
  handler: async (ctx) => {
    const mensajes = await ctx.db.query("mensajesPadres").collect();
    return mensajes.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Marcar mensaje como enviado
export const marcarMensajeEnviado = mutation({
  args: { id: v.id("mensajesPadres") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { enviado: true });
  },
});
