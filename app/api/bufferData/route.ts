import { NextResponse } from "next/server"
import { NivelData } from "@/components/seccion1/nivelesLogic"

export async function GET() {
  try {
    const response = await fetch("http://192.168.20.151:8500/buffer")

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al obtener datos del buffer" },
        { status: response.status }
      )
    }

    const data = (await response.json()) as NivelData
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
