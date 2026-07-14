"use client"

import { useEffect, useState } from "react"

import { getBotonesNivel, getBuffer, getNivel, NivelData } from "./nivelesLogic"

import {
  dataTiempoReal,
  getDataNivelSeleccionado,
  getDataUltimoCiclo,
} from "./data"

import { Button } from "@/components/ui/button"
import { ItemCard } from "@/components/componentsClient"

import { FaRegFileExcel } from "react-icons/fa"
import { PiMicrosoftOutlookLogoBold } from "react-icons/pi"

import Image from "next/image"
import { toast } from "sonner"

export default function Seccion1() {
  const [buffer, setBuffer] = useState<NivelData | null>(null)
  const [nivelSeleccionado, setNivelSeleccionado] = useState(1)

  useEffect(() => {
    async function cargarBuffer() {
      try {
        const data = await getBuffer()
        setBuffer(data)
        const firstLevel = Object.keys(data).find(
          (k) => k.startsWith("nivel") && data[k as keyof NivelData]
        )
        if (firstLevel) {
          const num = parseInt(firstLevel.replace("nivel", ""))
          setNivelSeleccionado(num)
        }
      } catch (error) {
        console.error(error)
      }
    }
    cargarBuffer()
  }, [])
  const botonesNivel = buffer ? getBotonesNivel(buffer) : []

  const nivelActual = buffer ? getNivel(buffer, nivelSeleccionado) : undefined

  const dataUltimoCiclo = getDataUltimoCiclo(buffer)

  const dataNivelSeleccionado = getDataNivelSeleccionado(
    nivelSeleccionado,
    nivelActual
  )

  async function handleSimular() {
    try {
      const res = await fetch("/api/simulacionReporte")
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        toast.error(data?.error ?? "Error al enviar simulación")
        return
      }
      const data = await res.json().catch(() => null)
      toast.success(data?.message ?? "Simulación enviada correctamente")
    } catch (error) {
      toast.error("No se pudo conectar con el servidor")
    }
  }

  async function handleExcel() {
    try {
      const res = await fetch("/api/excelReporte")
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        toast.error(data?.error ?? "Error al descargar reporte")
        return
      }

      const disposition = res.headers.get("content-disposition") || ""
      let filename = "reporte.xlsx"
      const match =
        /filename\*=UTF-8''([^;\n]*)/.exec(disposition) ||
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
      if (match && match[1]) {
        filename = decodeURIComponent(match[1].replace(/['"]+/g, ""))
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      toast.success("Reporte descargado correctamente")
    } catch (error) {
      toast.error("No se pudo conectar con el servidor")
    }
  }

  return (
    <div className="flex w-full flex-row gap-5 rounded bg-background2 p-5">
      <div className="flex flex-col justify-center gap-5">
        <Button
          className="flex aspect-square h-auto flex-col items-center justify-center gap-3 p-3"
          onClick={handleExcel}
        >
          <FaRegFileExcel className="size-15" />
          <p className="text-lg">DESCARGAR REPORTE</p>
        </Button>

        <Button
          className="flex aspect-square h-auto flex-col items-center justify-center gap-3 p-3"
          onClick={handleSimular}
        >
          <PiMicrosoftOutlookLogoBold className="size-15" />
          <p className="text-lg">
            SIMULAR ENVIO DE
            <br />
            REPORTE AUTOMATICO
          </p>
        </Button>
      </div>

      <div className="flex w-1/2 flex-row gap-5 rounded bg-background3 p-5">
        <div className="flex w-1/2 flex-col justify-between gap-5">
          <h1>DATOS EN TIEMPO REAL</h1>

          <div className="flex flex-col gap-5">
            {dataTiempoReal.map((item) => (
              <ItemCard
                key={item.id}
                variant="outline"
                size="sm"
                className="bg-background4 p-3"
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

          <div className="flex flex-row justify-between gap-5">
            <Button className="aspect-square h-20 rounded-full">Boton 1</Button>

            <Button className="aspect-square h-20 rounded-full">Boton 2</Button>

            <Button className="aspect-square h-20 rounded-full">Boton 3</Button>
          </div>
        </div>

        <div className="relative flex w-1/2 items-center justify-center">
          <Image alt="RACK" src="/RACK.png" fill className="z-10" priority />
          <div className="flex h-full w-full flex-col items-center">
            {botonesNivel.map((boton) => (
              <Button
                key={boton.numero}
                onClick={() => setNivelSeleccionado(boton.numero)}
                style={{
                  position: "absolute",
                  top: boton.posicionY,
                  height: boton.altura,
                }}
                className={`${boton.color} z-20 w-7/8 text-white ${
                  nivelSeleccionado === boton.numero
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                {boton.numero}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-1/2 flex-row gap-5 rounded bg-background3 p-5">
        <div className="flex w-1/2 flex-col justify-between gap-2">
          <div className="flex flex-col gap-2">
            <h1>DATOS ULTIMO CICLO</h1>

            <div className="flex flex-col gap-2">
              {dataUltimoCiclo.map((item) => (
                <ItemCard
                  key={item.id}
                  variant="outline"
                  size="sm"
                  className="bg-background4 p-2"
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1>DATOS NIVEL SELECCIONADO</h1>

            <div className="flex flex-col gap-2">
              {dataNivelSeleccionado.map((item) => (
                <ItemCard
                  key={item.id}
                  variant="outline"
                  size="sm"
                  className="bg-background4 p-2"
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-1/2">
          <Image
            alt="RACK"
            src="/RACK.png"
            fill
            className="z-10 w-full"
            priority
          />

          <div className="flex h-full w-full flex-col items-center">
            {botonesNivel.map((boton) => (
              <Button
                key={boton.numero}
                onClick={() => setNivelSeleccionado(boton.numero)}
                style={{
                  position: "absolute",
                  top: boton.posicionY,
                  height: boton.altura,
                }}
                className={`${boton.color} z-20 w-7/8 text-white ${
                  nivelSeleccionado === boton.numero
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                {boton.numero}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
