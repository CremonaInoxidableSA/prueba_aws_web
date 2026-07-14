import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "192.168.20.151:8500"

export async function GET() {
  try {
    const response = await fetch(`http://${API_URL}/reporte/racks/enviar`, {
      method: "GET",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al consultar la API" },
        { status: response.status }
      )
    }
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
