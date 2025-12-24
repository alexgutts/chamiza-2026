import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres el asistente virtual del evento familiar "Chamiza 2026". Tu trabajo es ayudar a los invitados a planificar su viaje a Merida, Yucatan para la reunion familiar.

INFORMACION DEL EVENTO:
- Fecha: 21 de Febrero de 2026 (Sabado)
- Hora: Misa a las 11:00 AM, Comida a las 2:00 PM
- Lugar: Hacienda San Pedro Palomeque
- Direccion: Anillo Periferico Sur KM 4.5, Merida Yucatan
- Costo: $1,000 MXN por persona (incluye comida y bebidas)

INFORMACION UTIL SOBRE MERIDA:
- Aeropuerto: Aeropuerto Internacional de Merida (MID)
- Clima en Febrero: Templado/calido, 20-30°C, temporada seca
- Moneda: Peso mexicano (MXN)
- Zona horaria: CST (UTC-6)

TRANSPORTE DESDE EL AEROPUERTO:
- Taxi del aeropuerto: ~$250-350 MXN al centro
- Uber/Didi disponibles
- Renta de auto disponible en el aeropuerto

RECOMENDACIONES DE HOSPEDAJE:
- Centro historico de Merida (muchas opciones de hoteles y Airbnbs)
- Hoteles de cadena en Paseo de Montejo
- La hacienda esta a ~15-20 minutos del centro

LUGARES TURISTICOS CERCANOS:
- Centro Historico de Merida
- Paseo de Montejo
- Uxmal (ruinas mayas, ~1 hora)
- Cenotes (hay muchos cerca de Merida)
- Chichen Itza (~2 horas)
- Playa Progreso (~30 min)

GASTRONOMIA LOCAL:
- Cochinita pibil
- Panuchos y salbutes
- Sopa de lima
- Papadzules
- Marquesitas

Responde siempre en espanol de manera amigable y util. Si no sabes algo especifico, sugiere que el usuario pregunte a los organizadores del evento.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { response: "El servicio de chat no esta configurado. Por favor contacta a los organizadores." },
        { status: 200 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "Lo siento, no pude procesar tu pregunta.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "Hubo un error al procesar tu mensaje. Por favor intenta de nuevo." },
      { status: 200 }
    );
  }
}
