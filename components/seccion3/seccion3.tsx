"use client"

import { useEffect, useRef } from "react"
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js"

import { getDataChart, type GraficoEntry } from "./dataChart"

Chart.register([
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
])

interface Seccion3Props {
  dateRange?: { from: Date; to: Date }
  graficoData?: GraficoEntry[]
  loading: boolean
  error: string | null
}

export default function Seccion3({
  dateRange,
  graficoData,
  loading,
  error,
}: Seccion3Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const { labels, datasets } = getDataChart(graficoData ?? [])

    if (chartRef.current) {
      chartRef.current.data.labels = labels
      chartRef.current.data.datasets = datasets
      chartRef.current.update()
      return
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            stacked: false,
            title: { display: true, text: "Fecha" },
          },
          y: {
            stacked: false,
            beginAtZero: true,
            title: { display: true, text: "Kilogramos" },
          },
        },
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue} Kg`,
            },
          },
        },
      },
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [graficoData])

  return (
    <div className="flex w-full flex-col rounded bg-background2 p-5">
      <p className="mb-3 text-left text-xl font-bold">
        PRODUCCIÓN DIARIA POR PRODUCTO
      </p>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p>Cargando datos...</p>
      ) : graficoData && graficoData.length === 0 ? (
        <p>No hay datos para el rango seleccionado.</p>
      ) : (
        <div className="relative h-100 w-full">
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  )
}
