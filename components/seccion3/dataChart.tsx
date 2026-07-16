export interface GraficoEntry {
  id: number
  nombre: string
  fecha: string
  tiempo: string
  kilogramos: number
}

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
  "Mortadela corta": { bg: "rgba(255, 87, 51, 0.7)", border: "#FF5733" },
  "Mortadela mediana": { bg: "rgba(51, 255, 87, 0.7)", border: "#33FF57" },
  "Mortadela larga": { bg: "rgba(51, 87, 255, 0.7)", border: "#3357FF" },
}

const fallbackColor = (i: number) => {
  const hue = (i * 67) % 360
  return {
    bg: `hsla(${hue}, 80%, 55%, 0.55)`,
    border: `hsl(${hue}, 80%, 45%)`,
  }
}

export const getDataChart = (graficoData: GraficoEntry[]): ChartData => {
  const labels = Array.from(new Set(graficoData.map((e) => e.fecha))).sort()
  const productos = Array.from(new Set(graficoData.map((e) => e.nombre))).sort()

  const datasets: ChartDataset[] = productos.map((nombre, idx) => {
    const color = colors[nombre] ?? fallbackColor(idx)

    const totalesPorFecha: Record<string, number> = {}
    graficoData
      .filter((e) => e.nombre === nombre)
      .forEach((e) => {
        totalesPorFecha[e.fecha] =
          (totalesPorFecha[e.fecha] ?? 0) + e.kilogramos
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
