"use client";

import { useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import mockData from "@/data/mock/productividad.json";

const colors: string[] = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
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
];

const parseTimeToSeconds = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const formatSecondsToHHMM = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

interface ProductoVisual {
  nombre: string;
  toneladas: number;
  porcentaje: number;
  color: string;
}

interface ProductividadProps {
  dateRange?: { from: Date; to: Date };
}

const Productividad = ({ dateRange }: ProductividadProps) => {
  const {
    productos,
    totalToneladas,
    cantidadProductos,
    promedioUsoDiario,
    fechaInicio,
    fechaFin,
  } = useMemo(() => {
    if (!dateRange) {
      return {
        productos: [] as ProductoVisual[],
        totalToneladas: 0,
        cantidadProductos: 0,
        promedioUsoDiario: 0,
        fechaInicio: "-",
        fechaFin: "-",
      };
    }

    const fromStr = format(dateRange.from, "yyyy-MM-dd");
    const toStr = format(dateRange.to, "yyyy-MM-dd");
    const cantDias = Math.max(
      differenceInDays(dateRange.to, dateRange.from) + 1,
      1,
    );

    const filtered = mockData.filter(
      (e) => e.fecha >= fromStr && e.fecha <= toStr,
    );

    const grouped: Record<string, { toneladas: number; segundos: number }> = {};
    for (const entry of filtered) {
      if (!grouped[entry.nombre])
        grouped[entry.nombre] = { toneladas: 0, segundos: 0 };
      grouped[entry.nombre].toneladas += entry.toneladas;
      grouped[entry.nombre].segundos += parseTimeToSeconds(entry.tiempo);
    }

    const sortedNames = Object.keys(grouped).sort();
    const totalTn = sortedNames.reduce(
      (acc, n) => acc + grouped[n].toneladas,
      0,
    );
    const totalSecs = sortedNames.reduce(
      (acc, n) => acc + grouped[n].segundos,
      0,
    );

    const productos: ProductoVisual[] = sortedNames.map((nombre, idx) => ({
      nombre,
      toneladas: grouped[nombre].toneladas,
      porcentaje: totalTn > 0 ? (grouped[nombre].toneladas * 100) / totalTn : 0,
      color: colors[idx % colors.length],
    }));

    return {
      productos,
      totalToneladas: totalTn,
      cantidadProductos: filtered.length,
      promedioUsoDiario: totalSecs / cantDias,
      fechaInicio: format(dateRange.from, "dd/MM/yyyy"),
      fechaFin: format(dateRange.to, "dd/MM/yyyy"),
    };
  }, [dateRange]);

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
      <div className="flex w-full justify-between px-12.5">
        <div className="flex flex-col items-center text-center">
          <p className="text-[2.5vw] font-semibold">{cantidadProductos}</p>
          <p className="text-texto2 text-[1vw]">RACKS</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="text-[2.5vw] font-semibold">
            {totalToneladas.toFixed(2)} <span className="text-lg">Tn</span>
          </p>
          <p className="text-texto2 text-[1vw]">PRODUCTOS REALIZADOS</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="text-[2.5vw] font-semibold">
            {formatSecondsToHHMM(promedioUsoDiario)}{" "}
            <span className="text-lg">hh:mm</span>
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
                    {producto.toneladas.toFixed(2)} Tn)
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
                {producto.toneladas.toFixed(2)} Tn)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default Productividad;
