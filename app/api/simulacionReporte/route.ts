import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "http://192.168.20.151:8500/reporte/racks/enviar",
      {
        method: "GET",
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al consultar la API" },
        { status: response.status }
      )
    }
    // Devuelve una respuesta JSON indicando éxito
    return NextResponse.json(
      { success: true, message: "Simulación enviada correctamente" },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
