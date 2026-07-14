import { NivelData, segundosAHora } from "./nivelesLogic"

export type TiempoRealCardItem = {
  id: number
  title: string
  description: string
}

export const dataTiempoReal: TiempoRealCardItem[] = [
  {
    id: 1,
    title: "ESTADO EQUIPO",
    description: "-",
  },
  {
    id: 2,
    title: "ESTADO MESA ESPERA",
    description: "-",
  },
  {
    id: 3,
    title: "NIVEL ACTUAL",
    description: "-",
  },
  {
    id: 4,
    title: "RECETA ACTUAL",
    description: "-",
  },
  {
    id: 5,
    title: "RACK ACTUAL",
    description: "-",
  },
  {
    id: 6,
    title: "NUMERO DE NIVELES SELECCIONADOS",
    description: "-",
  },
]

export function getDataUltimoCiclo(buffer: NivelData | null) {
  return [
    {
      id: 1,
      title: "FECHA Y HORA INICIO",
      description: buffer?.fecha_inicio ?? "-",
    },
    {
      id: 2,
      title: "FECHA Y HORA FIN",
      description: buffer?.fecha_fin ?? "-",
    },
    {
      id: 3,
      title: "RECETA",
      description: buffer?.recetaBuffer1 ?? "-",
    },
    {
      id: 4,
      title: "RACK",
      description: buffer?.rackBuffer1?.toString() ?? "-",
    },
    {
      id: 5,
      title: "EQUIPO",
      description: buffer?.equipoSeleccionado ?? "-",
    },
  ]
}

export function getDataNivelSeleccionado(
  numeroNivel: number,
  nivel: number[] | undefined
) {
  return [
    {
      id: 1,
      title: "NUMERO DE NIVEL",
      description: `Nivel ${numeroNivel?.toString() ?? "-"}`,
    },
    {
      id: 2,
      title: "RESULTADO",
      description: nivel
        ? nivel[1] === 1
          ? "PROCESADO CORRECTAMENTE"
          : "NO FINALIZADO"
        : "-",
    },
    {
      id: 3,
      title: "TIEMPO DE PROCESO",
      description: nivel ? segundosAHora(nivel[3]) : "-",
    },
    {
      id: 4,
      title: "NUMERO DE CANCELACIONES",
      description: nivel ? nivel[0].toString() : "-",
    },
  ]
}

export function getDataTiempoReal(data: {
  estadoEquipo: number
  mesaEspera: number
  nivelActual: number
  nivelesSeleccionados: number
  rackActual: number
  recetaActual: string
}) {
  const estadoEquipo =
    data.estadoEquipo === 1
      ? "ACTIVO"
      : data.estadoEquipo === 2
        ? "PAUSA"
        : "INACTIVO"
  const mesaEspera = data.mesaEspera === 1 ? "ACTIVA" : "INACTIVA"

  return [
    {
      id: 1,
      title: "ESTADO EQUIPO",
      description: estadoEquipo,
    },
    {
      id: 2,
      title: "ESTADO MESA ESPERA",
      description: mesaEspera,
    },
    {
      id: 3,
      title: "NIVEL ACTUAL",
      description: `${data.nivelActual}/13`,
    },
    {
      id: 4,
      title: "RECETA ACTUAL",
      description: data.recetaActual || "-",
    },
    {
      id: 5,
      title: "RACK ACTUAL",
      description: data.rackActual?.toString() ?? "-",
    },
    {
      id: 6,
      title: "NUMERO DE NIVELES SELECCIONADOS",
      description: `${data.nivelesSeleccionados}/13`,
    },
  ]
}
