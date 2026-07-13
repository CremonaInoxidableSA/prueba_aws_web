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
  nivel14: number[]
  nivel15: number[]
  nivel16: number[]
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
}

const urlBuffer = "http://192.168.20.151:8500/buffer"

export async function getBuffer(): Promise<NivelData> {
  const response = await fetch(urlBuffer)

  if (!response.ok) {
    throw new Error("Error al obtener datos")
  }

  return await response.json()
}

export function getNiveles(buffer: NivelData): (Nivel | undefined)[] {
  return Array.from({ length: 16 }, (_, index) => {
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
  if (!nivel) return "bg-gray-500/40 hover:bg-gray-600"
  const finalizado = nivel[1]
  const seleccionado = nivel[2]
  if (seleccionado === 0) return "bg-gray-500/40 hover:bg-gray-600"
  if (finalizado === 0) return "bg-red-500/40 hover:bg-red-600"
  return "bg-green-500/40 hover:bg-green-600"
}

export function getBotonesNivel(buffer: NivelData): BotonNivel[] {
  return getNiveles(buffer)
    .filter((nivel): nivel is Nivel => nivel !== undefined)
    .map((nivel) => ({
      numero: nivel.numero,
      color: getColorForNivel(nivel.datos),
      datos: nivel.datos,
    }))
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
