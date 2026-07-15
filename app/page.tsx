"use client"

import { useEffect, useState } from "react"
import { type DateRange } from "react-day-picker"
import { format, startOfWeek, endOfWeek } from "date-fns"

import Seccion1 from "@/components/seccion1/seccion1"
import SectorProductividad from "@/components/seccion2/sectorProductividad"
import Seccion3 from "@/components/seccion3/seccion3"

interface RequiredDateRange {
  from: Date
  to: Date
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

interface GraficoEntry {
  id: number
  nombre: string
  fecha: string
  tiempo: string
  kilogramos: number
}

const getInitialProductividadRange = (): RequiredDateRange => {
  const today = new Date()
  return {
    from: startOfWeek(today, { weekStartsOn: 1 }),
    to: endOfWeek(today, { weekStartsOn: 1 }),
  }
}

export default function Home() {
  const [appliedRange, setAppliedRange] = useState<RequiredDateRange>(
    getInitialProductividadRange
  )
  const [graficoData, setGraficoData] = useState<GraficoEntry[]>([])
  const [productividadData, setProductividadData] =
    useState<ProductividadData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApply = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setAppliedRange(range as RequiredDateRange)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!appliedRange.from || !appliedRange.to) return

      const fecha_inicio = format(appliedRange.from, "dd-MM-yyyy")
      const fecha_fin = format(appliedRange.to, "dd-MM-yyyy")
      const query = `?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`

      setLoading(true)
      setError(null)

      try {
        const [graficoRes, productividadRes] = await Promise.all([
          fetch(`/api/graficoData${query}`),
          fetch(`/api/productividadData${query}`),
        ])

        if (!graficoRes.ok || !productividadRes.ok) {
          const [graficoError, productividadError] = await Promise.all([
            graficoRes.json().catch(() => null),
            productividadRes.json().catch(() => null),
          ])
          throw new Error(
            graficoError?.error ||
              productividadError?.error ||
              "Error al cargar datos"
          )
        }

        const [graficoJson, productividadJson] = await Promise.all([
          graficoRes.json(),
          productividadRes.json(),
        ])

        setGraficoData(graficoJson)
        setProductividadData(productividadJson)
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "No se pudieron cargar los datos"
        )
        setGraficoData([])
        setProductividadData(null)
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [appliedRange])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-5">
      <Seccion1 />
      <SectorProductividad
        dateRange={appliedRange}
        onApply={handleApply}
        productividadData={productividadData}
        loading={loading}
        error={error}
      />
      <Seccion3
        dateRange={appliedRange}
        graficoData={graficoData}
        loading={loading}
        error={error}
      />
    </div>
  )
}
