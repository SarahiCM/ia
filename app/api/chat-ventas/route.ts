import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { datosFunciones } from "../ai-tools/route";
export const maxDuration = 60;

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function obtenerTextoMensaje(message: UIMessage | undefined): string {
  if (!message) return "";
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p) => p?.type === "text")
      .map((p) => {
        if (p && typeof p === 'object' && 'text' in p) {
          const part = p as { text?: string };
          return typeof part.text === "string" ? part.text : "";
        }
        return "";
      })
      .join(" ")
      .trim();
  }
  return "";
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();  
  const ultimaConsulta = obtenerTextoMensaje(
    [...messages].reverse().find((m) => m.role === "user")
  );

  // Obtener todos los datos ANTES de llamar al modelo
  const [clientes, ventas, quejas, productos, resumen] = await Promise.all([
    datosFunciones.obtenerTodosLosClientes(),
    datosFunciones.obtenerTodasLasVentas(),
    datosFunciones.obtenerTodasLasQuejas(),
    datosFunciones.obtenerTodosLosProductos(),
    datosFunciones.obtenerResumenDatos(),
  ]);

  const datosContexto = `
 DATOS ACTUALES DE LA BASE DE DATOS - RESUMEN EJECUTIVO:

ESTADÍSTICAS GENERALES:
- Total de Clientes: ${resumen?.data?.totalClientes || 0}
- Total de Ventas Realizadas: ${resumen?.data?.totalVentas || 0}
- Monto Total en Ventas: $${resumen?.data?.montoTotalVentas?.toFixed(2) || "0.00"}
- Venta Promedio: $${resumen?.data?.ventasPromedio?.toFixed(2) || "0.00"}
- Productos en Stock: ${resumen?.data?.productosDisponibles || 0}
- Quejas Registradas: ${resumen?.data?.totalQuejas || 0}

👥 INFORMACIÓN DETALLADA:

CLIENTES REGISTRADOS (${clientes?.data?.length || 0} total):
${clientes?.data && Array.isArray(clientes.data) && clientes.data.length > 0 
  ? clientes.data.map((c: Record<string, string | number>) => `  • ${c.nombreCliente} | Email: ${c.email} | Tel: ${c.telefono}`).join('\n')
  : '  Sin clientes registrados'}

 VENTAS REALIZADAS (${ventas?.data?.length || 0} total):
${ventas?.data && Array.isArray(ventas.data) && ventas.data.length > 0
  ? ventas.data.map((v: Record<string, string | number>) => `  • ${v.nombreCliente} - ${v.producto}: ${v.cantidad} unidades x $${((v.monto as number)/(v.cantidad as number)).toFixed(2)} = $${(v.monto as number).toFixed(2)}`).join('\n')
  : '  Sin ventas registradas'}

 QUEJAS REPORTADAS (${quejas?.data?.length || 0} total):
${quejas?.data && Array.isArray(quejas.data) && quejas.data.length > 0
  ? quejas.data.map((q: Record<string, string | number>) => `  • ${q.nombreCliente}: "${q.descripcion}" (${new Date(q.fechaQueja as string).toLocaleDateString('es-MX')})`).join('\n')
  : '  Sin quejas registradas'}

 PRODUCTOS DISPONIBLES (${productos?.data?.length || 0} total):
${productos?.data && Array.isArray(productos.data) && productos.data.length > 0
  ? productos.data.map((p: Record<string, string | number>) => `  • ${p.nombreProducto}: $${p.precio} | Stock: ${p.stock} unidades`).join('\n')
  : '  Sin productos registrados'}

IMPORTANTE: Usa SOLO esta información para responder. No inventes datos.
`;

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    system: `ASISTENTE DE ANÁLISIS DE VENTAS

Eres un especialista en análisis de datos de ventas. Tu rol es ayudar a entender y analizar información sobre clientes, ventas, quejas y productos.

${datosContexto}

 INSTRUCCIONES CLAVE:
1. Analiza SOLO los datos proporcionados arriba
2. Responde en español, de forma clara y profesional
3. Estructura tus respuestas con viñetas o números cuando sea apropiado
4. Incluye SIEMPRE números específicos y comparativas
5. Identifica patrones, tendencias y oportunidades
6. Si hay quejas, sugiere acciones correctivas
7. Si faltan clientes o ventas, menciona por qué se observa esa tendencia
8. NUNCA generes datos ficticios o asunas información no proporcionada

💡 EJEMPLOS DE ANÁLISIS:
- "El cliente X tiene Y compras por $Z" 
- "El producto más vendido es X con Y unidades"
- "La siguiente queja requiere atención: ..."
- "Hay una tendencia de incremento/disminución en..."

 Si el usuario pregunta por datos que no existen en la BD, responde: "No hay registros de [elemento] en la base de datos actual"`,
    messages: await convertToModelMessages(messages),
  });

  (async () => {
    try {
      const textoCompleto = await result.text;
      
      // Validar antes de guardar
      if (ultimaConsulta && ultimaConsulta.length > 2 && textoCompleto && textoCompleto.length > 10) {
        await convex.mutation(api.datos.guardarConsulta, {
          consulta: ultimaConsulta,
          respuesta: textoCompleto,
        });
      }
    } catch (error) {
      // Log silencioso para no afectar la experiencia del usuario
      if (error instanceof Error) {
        console.error("Error al guardar consulta:", error.message);
      }
    }
  })();

  return result.toTextStreamResponse();
}