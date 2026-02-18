import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { z } from "zod";
import { datosFunciones } from "../ai-tools/route";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    system: `Eres un asistente inteligente de análisis de ventas. Tu rol es ayudar a entender y analizar información sobre clientes, ventas y quejas.

Cuando el usuario pregunta SIEMPRE debes:
1. Primero usar las herramientas disponibles para obtener datos reales de la BD
2. Analizar los datos obtenidos y proporcionar insights útiles
3. Responder siempre en español de forma clara y concisa
4. Incluir números específicos y recomendaciones basadas en los datos reales
5. Identificar patrones y tendencias en los datos

NUNCA respondas sin antes consultar la BD con las herramientas disponibles.
NUNCA inventes o asumas datos, siempre obtenlos de las herramientas.`,
    messages: await convertToModelMessages(messages),
    tools: {
      obtenerClientes: {
        description: "Obtiene todos los clientes de la BD",
        parameters: z.object({}),
        execute: async () => await datosFunciones.obtenerTodosLosClientes(),
      },
      obtenerVentas: {
        description: "Obtiene todas las ventas con estadísticas",
        parameters: z.object({}),
        execute: async () => await datosFunciones.obtenerTodasLasVentas(),
      },
      obtenerQuejas: {
        description: "Obtiene todas las quejas registradas",
        parameters: z.object({}),
        execute: async () => await datosFunciones.obtenerTodasLasQuejas(),
      },
      obtenerProductos: {
        description: "Obtiene todos los productos con su stock",
        parameters: z.object({}),
        execute: async () => await datosFunciones.obtenerTodosLosProductos(),
      },
      obtenerResumen: {
        description: "Obtiene un resumen general de todos los datos",
        parameters: z.object({}),
        execute: async () => await datosFunciones.obtenerResumenDatos(),
      },
      buscarVentasCliente: {
        description: "Obtiene todas las ventas de un cliente específico",
        parameters: z.object({
          nombreCliente: z.string().describe("Nombre del cliente"),
        }),
        execute: async ({ nombreCliente }: { nombreCliente: string }) =>
          await datosFunciones.obtenerVentasPorCliente(nombreCliente),
      },
      buscarQuejasPorCliente: {
        description: "Obtiene todas las quejas de un cliente específico",
        parameters: z.object({
          nombreCliente: z.string().describe("Nombre del cliente"),
        }),
        execute: async ({ nombreCliente }: { nombreCliente: string }) =>
          await datosFunciones.obtenerQuejasPorCliente(nombreCliente),
      },
      buscarProducto: {
        description: "Obtiene información de un producto específico",
        parameters: z.object({
          nombreProducto: z.string().describe("Nombre del producto"),
        }),
        execute: async ({ nombreProducto }: { nombreProducto: string }) =>
          await datosFunciones.obtenerProductoPorNombre(nombreProducto),
      },
    },
  } as any);

  return result.toUIMessageStreamResponse();
}