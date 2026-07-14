import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "No hay datos de último ciclo disponibles" },
    { status: 404 }
  )
}
