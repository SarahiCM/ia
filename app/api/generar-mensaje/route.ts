import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { 
      nombreAlumno, 
      nombrePadre, 
      grado, 
      totalDiasFaltados, 
      totalRegistros, 
      faltas,
      tono = "formal" 
    } = await req.json();

    interface Falta {
      fechaQueFalto: string;
      diasQueFalto: number;
    }
    const faltasDetalladas = (faltas as Falta[])
      .map((f) => `${f.fechaQueFalto} (${f.diasQueFalto} día${f.diasQueFalto > 1 ? 's' : ''})`)
      .join(", ");

    const prompt = `Eres un asistente de una escuela que genera mensajes para los padres sobre las faltas de sus hijos.
 
Información del alumno:
- Nombre del alumno: ${nombreAlumno}
- Nombre del padre/madre: ${nombrePadre}
- Grado: ${grado}
- Total de días faltados: ${totalDiasFaltados}
- Número de veces que faltó: ${totalRegistros}
- Fechas de las faltas: ${faltasDetalladas}

Genera un mensaje ${tono} para el padre o madre. El mensaje debe:
1. Comenzar con "Estimado/a ${nombrePadre}" o "Apreciable ${nombrePadre}" según el tono
2. Informar sobre las faltas de manera ${tono}
3. Incluir información sobre las fechas y días totales
4. ${tono === "serio" ? "Expresar preocupación y solicitar una reunión o conversación" : 
     tono === "amigable" ? "Ser comprensivo pero claro, ofrecer apoyo" : 
     "Ser profesional y respetuoso"}
5. Terminar con una despedida apropiada
6. NO usar formato markdown, solo texto plano
7. El mensaje debe ser en español mexicano y listo para copiar y pegar

Genera SOLO el mensaje, sin explicaciones adicionales.`;

    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
    });

    return NextResponse.json({ 
      mensaje: result.text,
      success: true 
    });

  } catch (error) {
    console.error("Error generando mensaje:", error);
    return NextResponse.json(
      { error: "Error al generar el mensaje", success: false },
      { status: 500 }
    );
  }
}