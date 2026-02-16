import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  faltas: defineTable({
    nombrePadre: v.string(),
    nombreAlumno: v.string(),
    diasQueFalto: v.number(),
    fechaQueFalto: v.string(),
    grado: v.string(),
  })
    .index("by_alumno", ["nombreAlumno"])
    .index("by_padre", ["nombrePadre"])
    .index("by_fecha", ["fechaQueFalto"])
    .index("by_grado", ["grado"]),
  
  mensajesPadres: defineTable({
    nombrePadre: v.string(),
    nombreAlumno: v.string(),
    mensaje: v.string(),
    totalFaltas: v.number(),
    fechaGeneracion: v.string(),
    enviado: v.boolean(),
  })
  
    .index("by_alumno", ["nombreAlumno"])
    .index("by_enviado", ["enviado"]),

    Clientes: defineTable({
    nombreCliente: v.string(),
    email: v.string(),
    telefono: v.string(),
    fechaRegistro: v.string(),
  })

    .index("by_email", ["email"])
    .index("by_nombre", ["nombreCliente"]),
    
    Ventas: defineTable({
    nombreCliente: v.string(),
    producto: v.string(),
    cantidad: v.number(), 
    monto: v.number(),
    fechaVenta: v.string(),
  })
    .index("by_cliente", ["nombreCliente"])
    .index("by_producto", ["producto"]),
});