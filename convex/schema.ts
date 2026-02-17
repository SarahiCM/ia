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


//  TABLA DE LA ETAPA 3
// TABLA DE PRUEBA PARA EL CHAT CON GEMINI, NO ES PARTE DEL SISTEMA DE FALTAS
    Clientes: defineTable({
    nombreCliente: v.string(),
    email: v.string(),
    telefono: v.string(),
    direccion: v.string(),
    fechaRegistro: v.string(),
  })
 
    .index("by_email", ["email"])
    .index("by_nombre", ["nombreCliente"]),

   // TABLA DE VENTAS  
    Ventas: defineTable({
    nombreCliente: v.string(),
    producto: v.string(),
    cantidad: v.number(), 
    monto: v.number(),
    fechaVenta: v.string(),
  })
    .index("by_cliente", ["nombreCliente"])
    .index("by_producto", ["producto"]),
   
    // TABLA DE PRODUCTOS
    Productos: defineTable({
    nombreProducto: v.string(),
    descripcion: v.string(),
    precio: v.number(),
    stock: v.number(),
  })
    .index("by_nombre", ["nombreProducto"]),
    
    // TABLA DE QUEJAS 
    Quejas: defineTable({
    nombreCliente: v.string(),
    email: v.string(),
    telefono: v.string(),
    descripcion: v.string(),
    fechaQueja: v.string(),
    })
    .index("by_email", ["email"])
    .index("by_cliente", ["nombreCliente"]),
    
});   