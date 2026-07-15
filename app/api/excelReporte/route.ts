import { NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "192.168.20.151:8500"

export async function GET() {
  try {
    const response = await fetch(`https://${API_URL}/reporte/racks`, {
      method: "GET",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al consultar la API" },
        { status: response.status }
      )
    }

    const fileBuffer = await response.arrayBuffer()
    const contentType =
      response.headers.get("content-type") ??
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    const contentDisposition =
      response.headers.get("content-disposition") ??
      `attachment; filename="reporte_racks.xlsx"`

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
