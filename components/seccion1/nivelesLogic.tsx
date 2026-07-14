export type NivelData = {
  fecha_fin: string
  fecha_inicio: string
  nivel1: number[]
  nivel2: number[]
  nivel3: number[]
  nivel4: number[]
  nivel5: number[]
  nivel6: number[]
  nivel7: number[]
  nivel8: number[]
  nivel9: number[]
  nivel10: number[]
  nivel11: number[]
  nivel12: number[]
  nivel13: number[]
  equipoSeleccionado: string
  recetaBuffer1: string
  rackBuffer1: number
  timestamp: string
}

export type Nivel = {
  numero: number
  datos: number[]
}

export type BotonNivel = {
  numero: number
  color: string
  datos: number[]
  altura: string
  posicionY: string
}

const alturasNivel: Record<number, string> = {
  1: "2.2rem",
  2: "2.35rem",
  3: "2.4rem",
  4: "2.3rem",
  5: "2.3rem",
  6: "2.3rem",
  7: "2.3rem",
  8: "2.39rem",
  9: "2.3rem",
  10: "2.3rem",
  11: "2.3rem",
  12: "2.3rem",
  13: "2.2rem",
}

const posicionesNivel: Record<number, string> = {
  1: "3.2rem",
  2: "5.67rem",
  3: "8.3rem",
  4: "11rem",
  5: "13.65rem",
  6: "16.3rem",
  7: "18.85rem",
  8: "21.5rem",
  9: "24.2rem",
  10: "26.8rem",
  11: "29.45rem",
  12: "32.15rem",
  13: "34.75rem",
}

export async function getBuffer(): Promise<NivelData> {
  const response = await fetch("/api/bufferData")

  if (!response.ok) {
    throw new Error("Error al obtener datos del buffer")
  }

  return (await response.json()) as NivelData
}

export function getNiveles(buffer: NivelData): (Nivel | undefined)[] {
  return Array.from({ length: 13 }, (_, index) => {
    const key = `nivel${index + 1}` as keyof NivelData
    const datos = buffer[key]
    if (datos && Array.isArray(datos)) {
      return { numero: index + 1, datos }
    }
    return undefined
  })
}

export function getNivel(
  buffer: NivelData,
  numero: number
): number[] | undefined {
  return buffer[`nivel${numero}` as keyof NivelData] as number[] | undefined
}

export function getColorForNivel(nivel: number[] | undefined): string {
  if (!nivel) return "bg-gray-500/20 hover:bg-gray-600/70"
  const finalizado = nivel[1]
  const seleccionado = nivel[2]
  if (seleccionado === 0) return "bg-gray-500/30 hover:bg-gray-600/70"
  if (finalizado === 0) return "bg-red-500/30 hover:bg-red-600/70"
  return "bg-green-500/30 hover:bg-green-600/70"
}

export function getColorForEstadoNivel(estado: number | undefined): string {
  switch (estado) {
    case 2:
      return "bg-blue-500/30 hover:bg-blue-600/70"
    case 3:
      return "bg-amber-500/30 hover:bg-amber-600/70"
    case 4:
      return "bg-green-500/30 hover:bg-green-600/70"
    case 1:
    default:
      return "bg-gray-500/30 hover:bg-gray-600/70"
  }
}

export function getBotonesNivel(
  buffer: NivelData | null,
  nivelesRealtime?: number[]
): BotonNivel[] {
  return Array.from({ length: 13 }, (_, index) => {
    const numero = index + 1
    const estadoRealtime = nivelesRealtime?.[index]

    if (estadoRealtime !== undefined) {
      return {
        numero,
        color: getColorForEstadoNivel(estadoRealtime),
        datos: [estadoRealtime],
        altura: alturasNivel[numero] ?? "2.25rem",
        posicionY: posicionesNivel[numero] ?? "0rem",
      }
    }

    if (!buffer) return undefined

    const key = `nivel${numero}` as keyof NivelData
    const datos = buffer[key] as number[] | undefined

    if (!datos || !Array.isArray(datos)) return undefined

    return {
      numero,
      color: getColorForNivel(datos),
      datos,
      altura: alturasNivel[numero] ?? "2.25rem",
      posicionY: posicionesNivel[numero] ?? "0rem",
    }
  }).filter((nivel): nivel is BotonNivel => nivel !== undefined)
}

export function segundosAHora(segundos: number): string {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const segundosRestantes = segundos % 60

  return [
    horas.toString().padStart(2, "0"),
    minutos.toString().padStart(2, "0"),
    segundosRestantes.toString().padStart(2, "0"),
  ].join(":")
}
