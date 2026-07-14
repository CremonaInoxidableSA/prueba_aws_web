import { NivelData, segundosAHora } from "./nivelesLogic"

export const dataTiempoReal = [
  {
    id: 1,
    title: "ESTADO EQUIPO",
    description: "ACTIVO",
  },
  {
    id: 2,
    title: "ESTADO MESA ESPERA",
    description: "ACTIVA",
  },
  {
    id: 3,
    title: "NIVEL ACTUAL",
    description: "1/16",
  },
  {
    id: 4,
    title: "RECETA ACTUAL",
    description: "CORTE MEDIANO",
  },
  {
    id: 5,
    title: "RACK ACTUAL",
    description: "51235",
  },
  {
    id: 6,
    title: "NUMERO DE NIVELES SELECCIONADOS",
    description: "10/16",
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
