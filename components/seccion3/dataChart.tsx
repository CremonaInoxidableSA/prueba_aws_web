import Data from "@/data/mock/productividad.json"

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor: string
  borderColor: string
  categoryPercentage: number
  barPercentage: number
  order: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

const colors: Record<string, { bg: string; border: string }> = {
  "Mortadela Corta": { bg: "rgba(255, 87, 51, 1)", border: "#FF5733" },
  "Mortadela Mediana": { bg: "rgba(51, 255, 87, 1)", border: "#33FF57" },
  "Mortadela Larga": { bg: "rgba(51, 87, 255, 1)", border: "#3357FF" },
}

const fallbackColor = (i: number) => {
  const hue = (i * 67) % 360
  return {
    bg: `hsla(${hue}, 80%, 55%, 0.55)`,
    border: `hsl(${hue}, 80%, 45%)`,
  }
}

const formatDate = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export const getDataChart = (dateRange: {
  from: Date
  to: Date
}): ChartData => {
  const fromStr = formatDate(dateRange.from)
  const toStr = formatDate(dateRange.to)

  const filtered = Data.filter((e) => e.fecha >= fromStr && e.fecha <= toStr)

  const labels = Array.from(new Set(filtered.map((e) => e.fecha))).sort()
  const productos = Array.from(new Set(filtered.map((e) => e.nombre))).sort()

  const datasets: ChartDataset[] = productos.map((nombre, idx) => {
    const color = colors[nombre] ?? fallbackColor(idx)

    const totalesPorFecha: Record<string, number> = {}
    filtered
      .filter((e) => e.nombre === nombre)
      .forEach((e) => {
        totalesPorFecha[e.fecha] = (totalesPorFecha[e.fecha] ?? 0) + e.toneladas
      })

    return {
      label: nombre,
      data: labels.map((fecha) => totalesPorFecha[fecha] ?? 0),
      backgroundColor: color.bg,
      borderColor: color.border,
      categoryPercentage: 0.6,
      barPercentage: 1,
      order: idx,
    }
  })

  return { labels, datasets }
}
