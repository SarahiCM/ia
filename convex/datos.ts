// convex/datos.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Obtener todos los clientes
export const obtenerTodosLosClientes = query({
  handler: async (ctx) => {
    return await ctx.db.query("Clientes").collect();
  },
});

// Obtener cliente por nombre
export const obtenerClientePorNombre = query({
  args: { nombreCliente: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Clientes")
      .withIndex("by_nombre", (q) => q.eq("nombreCliente", args.nombreCliente))
      .collect();
  },
});

// Obtener cliente por email
export const obtenerClientePorEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Clientes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
  },
});

// Obtener todas las ventas
export const obtenerTodasLasVentas = query({
  handler: async (ctx) => {
    return await ctx.db.query("Ventas").collect();
  },
});

// Obtener ventas por cliente
export const obtenerVentasPorCliente = query({
  args: { nombreCliente: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Ventas")
      .withIndex("by_cliente", (q) => q.eq("nombreCliente", args.nombreCliente))
      .collect();
  },
});

// Obtener ventas por producto
export const obtenerVentasPorProducto = query({
  args: { producto: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Ventas")
      .withIndex("by_producto", (q) => q.eq("producto", args.producto))
      .collect();
  },
});

// Obtener todos los productos
export const obtenerTodosLosProductos = query({
  handler: async (ctx) => {
    return await ctx.db.query("Productos").collect();
  },
});

// Obtener producto por nombre
export const obtenerProductoPorNombre = query({
  args: { nombreProducto: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Productos")
      .withIndex("by_nombre", (q) => q.eq("nombreProducto", args.nombreProducto))
      .collect();
  },
});

// Obtener todas las quejas
export const obtenerTodasLasQuejas = query({
  handler: async (ctx) => {
    return await ctx.db.query("Quejas").collect();
  },
});

// Obtener quejas por cliente
export const obtenerQuejasPorCliente = query({
  args: { nombreCliente: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Quejas")
      .withIndex("by_cliente", (q) => q.eq("nombreCliente", args.nombreCliente))
      .collect();
  },
});

// Obtener quejas por email
export const obtenerQuejasPorEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Quejas")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
  },
});

// Registrar una venta
export const registrarVenta = mutation({
  args: {
    nombreCliente: v.string(),
    producto: v.string(),
    cantidad: v.number(),
    monto: v.number(),
    fechaVenta: v.string(),
  },
  handler: async (ctx, args) => {
    const ventaId = await ctx.db.insert("Ventas", {
      nombreCliente: args.nombreCliente,
      producto: args.producto,
      cantidad: args.cantidad,
      monto: args.monto,
      fechaVenta: args.fechaVenta,
    });
    return ventaId;
  },
});

// Registrar un cliente
export const registrarCliente = mutation({
  args: {
    nombreCliente: v.string(),
    email: v.string(),
    telefono: v.string(),
    direccion: v.string(),
    fechaRegistro: v.string(),
  },
  handler: async (ctx, args) => {
    const clienteId = await ctx.db.insert("Clientes", {
      nombreCliente: args.nombreCliente,
      email: args.email,
      telefono: args.telefono,
      direccion: args.direccion,
      fechaRegistro: args.fechaRegistro,
    });
    return clienteId;
  },
});

// Registrar una queja
export const registrarQueja = mutation({
  args: {
    nombreCliente: v.string(),
    email: v.string(),
    telefono: v.string(),
    descripcion: v.string(),
    fechaQueja: v.string(),
  },
  handler: async (ctx, args) => {
    const quejaId = await ctx.db.insert("Quejas", {
      nombreCliente: args.nombreCliente,
      email: args.email,
      telefono: args.telefono,
      descripcion: args.descripcion,
      fechaQueja: args.fechaQueja,
    });
    return quejaId;
  },
});

// Obtener resumen estadístico de datos
export const obtenerResumenDatos = query({
  handler: async (ctx) => {
    const clientes = await ctx.db.query("Clientes").collect();
    const ventas = await ctx.db.query("Ventas").collect();
    const quejas = await ctx.db.query("Quejas").collect();
    const productos = await ctx.db.query("Productos").collect();

    const totalVentas = ventas.reduce((sum, v) => sum + v.monto, 0);
    const ventasPromedio = ventas.length > 0 ? totalVentas / ventas.length : 0;
    const productosConStock = productos.filter((p) => p.stock > 0).length;

    return {
      totalClientes: clientes.length,
      totalVentas: ventas.length,
      totalQuejas: quejas.length,
      totalProductos: productos.length,
      montoTotalVentas: totalVentas,
      ventasPromedio: ventasPromedio,
      productosDisponibles: productosConStock,
    };
  },
});

// Guardar consulta y respuesta del chat de ventas
export const guardarConsulta = mutation({
  args: {
    consulta: v.string(),
    respuesta: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const respuestaId = await ctx.db.insert("RespuestasVentas", {
      consulta: args.consulta,
      respuesta: args.respuesta || "",
      fechaRespuesta: new Date().toISOString(),
    });
    return respuestaId;
  },
});

// Obtener todas las respuestas del chat de ventas
export const obtenerTodasLasRespuestasVentas = query({
  handler: async (ctx) => {
    return await ctx.db.query("RespuestasVentas").collect();
  },
});

// Obtener respuestas por rango de fechas
export const obtenerRespuestasPorFecha = query({
  args: { fechaInicio: v.string(), fechaFin: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("RespuestasVentas")
      .withIndex("by_fecha", (q) =>
        q.gte("fechaRespuesta", args.fechaInicio).lte("fechaRespuesta", args.fechaFin)
      )
      .collect();
  },
});

// Obtener respuestas recientes
export const obtenerRespuestasRecientes = query({
  args: { limite: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("RespuestasVentas")
      .order("desc")
      .take(args.limite);
  },
});
