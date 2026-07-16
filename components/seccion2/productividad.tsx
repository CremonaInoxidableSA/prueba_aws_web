"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const colorMap: Record<string, string> = {
  "Mortadela corta": "#FF5733",
  "Mortadela mediana": "#33FF57",
  "Mortadela larga": "#3357FF",
}

const fallbackColors: string[] = [
  "#F333FF",
  "#FF33A6",
  "#33FFF5",
  "#FF9A33",
  "#33FFBD",
  "#FF3333",
  "#A633FF",
  "#FFD933",
  "#33FFD4",
  "#A6FF33",
  "#337BFF",
  "#33FF76",
  "#FF3357",
  "#33FF8D",
  "#FF8633",
  "#FF33C5",
  "#33FFC5",
]

const getColorForProducto = (recetaNombre: string, index: number): string => {
  return colorMap[recetaNombre] ?? fallbackColors[index % fallbackColors.length]
}

interface ProductividadData {
  racks: number
  productos_realizados: number
  promedio_uso: string
  porcentaje_producto_realizado: {
    receta_nombre: string
    cantidad_producida: number
    porcentaje: number
  }[]
}

interface ProductividadProps {
  dateRange?: { from: Date; to: Date }
  productividadData?: ProductividadData | null
  loading: boolean
  error: string | null
}

const Productividad = ({
  dateRange,
  productividadData,
  loading,
  error,
}: ProductividadProps) => {
  const {
    productos,
    racks,
    productosRealizados,
    promedioUso,
    fechaInicio,
    fechaFin,
  } = useMemo(() => {
    const productos =
      productividadData?.porcentaje_producto_realizado.map((item, idx) => ({
        nombre: item.receta_nombre,
        toneladas: item.cantidad_producida,
        porcentaje: item.porcentaje,
        color: getColorForProducto(item.receta_nombre, idx),
      })) ?? []

    return {
      productos,
      racks: productividadData?.racks ?? 0,
      productosRealizados: productividadData?.productos_realizados ?? 0,
      promedioUso: productividadData?.promedio_uso ?? "-",
      fechaInicio: dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : "-",
      fechaFin: dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : "-",
    }
  }, [dateRange, productividadData])

  return (
    <div className="flex w-full flex-col rounded bg-background2 p-5">
      <p className="text-left text-xl font-bold">PRODUCTIVIDAD</p>
      <div className="mb-3 flex items-center">
        <p className="text-orange text-md inline">
          {fechaInicio}
          <span className="inline px-1.25 font-semibold"> - </span>
          {fechaFin}
        </p>
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <div className="flex w-full justify-between px-12.5">
            <div className="flex flex-col items-center text-center">
              <p className="text-[2.5vw] font-semibold">{racks}</p>
              <p className="text-texto2 text-[1vw]">RACKS</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-[2.5vw] font-semibold">
                {productosRealizados} <span className="text-lg">Un.</span>
              </p>
              <p className="text-texto2 text-[1vw]">PRODUCTOS REALIZADOS</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-[2.5vw] font-semibold">
                {promedioUso} <span className="text-lg">hh:mm</span>
              </p>
              <p className="text-texto2 text-[1vw]">PROMEDIO DE USO DIARIO</p>
            </div>
          </div>

          <hr className="border-texto mx-auto my-5 w-4/5 rounded-md border-t-4" />
          <div className="relative">
            <p className="mb-2">% PRODUCTOS REALIZADOS</p>
            <div className="mb-3.75 flex h-5 overflow-hidden rounded-md bg-background5">
              <TooltipProvider>
                {productos.map((producto) => (
                  <Tooltip key={producto.nombre}>
                    <TooltipTrigger
                      render={
                        <div
                          className="h-full cursor-pointer"
                          style={{
                            width: `${producto.porcentaje}%`,
                            backgroundColor: producto.color,
                          }}
                        />
                      }
                    />
                    <TooltipContent>
                      <p>
                        {producto.nombre}: {producto.porcentaje.toFixed(1)}% (
                        {producto.toneladas.toFixed(2)} Kg)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="flex flex-wrap justify-around">
              {productos.map((producto, index) => (
                <div key={index} className="m-[5px_10px] flex items-center">
                  <div
                    className="mr-1.25 h-3.75 w-3.75 shrink-0 rounded-sm"
                    style={{ backgroundColor: producto.color }}
                  />
                  <p>
                    {producto.nombre} — {producto.porcentaje.toFixed(1)}% (
                    {producto.toneladas.toFixed(2)} Kg)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Productividad
