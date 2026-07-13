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

import { getDataChart } from "./dataChart"

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
}

export default function Seccion3({ dateRange }: Seccion3Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !dateRange) return

    const { labels, datasets } = getDataChart(dateRange)

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
        // "index" + intersect:false = el tooltip muestra
        // TODOS los productos de ese día, sin necesidad de
        // apuntar justo a una barra específica
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
            title: { display: true, text: "Toneladas" },
          },
        },
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue} Tn`,
            },
          },
        },
      },
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [dateRange])

  return (
    <div className="flex w-full flex-col rounded bg-background2 p-5">
      <p className="mb-3 text-left text-xl font-bold">
        PRODUCCIÓN DIARIA POR PRODUCTO
      </p>
      <div className="relative h-100 w-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
