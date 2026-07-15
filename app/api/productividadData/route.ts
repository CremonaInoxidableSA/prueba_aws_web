import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "192.168.20.151:8500"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fecha_inicio = searchParams.get("fecha_inicio")
  const fecha_fin = searchParams.get("fecha_fin")

  if (!fecha_inicio || !fecha_fin) {
    return NextResponse.json(
      { error: "Debes enviar fecha_inicio y fecha_fin" },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://${API_URL}/productividad?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al consultar la API de productividad" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
