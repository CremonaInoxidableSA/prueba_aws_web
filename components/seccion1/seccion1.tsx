"use client"

import { useEffect, useState } from "react"

import { getBotonesNivel, getBuffer, getNivel, NivelData } from "./nivelesLogic"

import {
  dataTiempoReal as defaultDataTiempoReal,
  getDataNivelSeleccionado,
  getDataTiempoReal,
  getDataUltimoCiclo,
  type TiempoRealCardItem,
} from "./data"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "192.168.20.151:8500"

type TiempoRealData = {
  estadoEquipo: number
  mesaEspera: number
  nivelActual: number
  niveles: number[]
  nivelesSeleccionados: number
  rackActual: number
  recetaActual: string
  timestamp: string
}

type BotonRealtime = {
  estado: number
  numeroBoton: number
  timestamp: string
}

import { Button } from "@/components/ui/button"
import { ItemCard } from "@/components/componentsClient"

import { FaRegFileExcel } from "react-icons/fa"
import { PiMicrosoftOutlookLogoBold } from "react-icons/pi"

import Image from "next/image"
import { toast } from "sonner"

export default function Seccion1() {
  const [buffer, setBuffer] = useState<NivelData | null>(null)
  const [nivelSeleccionado, setNivelSeleccionado] = useState(1)
  const [tiempoRealData, setTiempoRealData] = useState<TiempoRealData | null>(
    null
  )
  const [botonRealtime, setBotonRealtime] = useState<BotonRealtime | null>(null)
  const [wsError, setWsError] = useState<string | null>(null)

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

  useEffect(() => {
    if (typeof window === "undefined") return

    let isMounted = true
    const tiempoSocket = new WebSocket(`ws://${API_URL}/tiemporeal`)
    const botonesSocket = new WebSocket(`ws://${API_URL}/botones`)

    tiempoSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as TiempoRealData
        if (isMounted) setTiempoRealData(message)
      } catch (error) {
        console.error("WS tiemporeal parse error", error)
      }
    }

    tiempoSocket.onerror = () => {
      if (isMounted) setWsError("Error de conexión con tiemporeal")
    }

    botonesSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as BotonRealtime
        if (isMounted) setBotonRealtime(message)
      } catch (error) {
        console.error("WS botones parse error", error)
      }
    }

    botonesSocket.onerror = () => {
      if (isMounted) setWsError("Error de conexión con botones")
    }

    return () => {
      isMounted = false
      tiempoSocket.close()
      botonesSocket.close()
    }
  }, [])

  const botonesNivelTiempoReal = getBotonesNivel(
    buffer,
    tiempoRealData?.niveles,
    false
  )
  const botonesNivelUltimoCiclo = getBotonesNivel(buffer)

  const nivelActual = buffer ? getNivel(buffer, nivelSeleccionado) : undefined

  const dataTiempoReal: TiempoRealCardItem[] = tiempoRealData
    ? getDataTiempoReal(tiempoRealData)
    : defaultDataTiempoReal

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
    } catch {
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
    } catch {
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
            {wsError ? (
              <div className="rounded border border-red-500 bg-red-100 p-3 text-sm text-red-700">
                {wsError}
              </div>
            ) : null}
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
            {([1, 2, 3] as const).map((numero) => {
              const estado =
                botonRealtime?.numeroBoton === numero ? botonRealtime.estado : 0
              const isOn = estado === 1

              return (
                <div
                  key={numero}
                  className={`flex aspect-square h-20 flex-col items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                    isOn
                      ? "border-green-500 bg-green-500/30 text-white"
                      : "border-red-500 bg-red-500/30 text-white"
                  }`}
                >
                  <span>Botón {numero}</span>
                  <span className="text-xs uppercase">
                    {isOn ? "ON" : "OFF"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative flex w-1/2 items-center justify-center">
          <Image alt="RACK" src="/RACK.png" fill className="z-10" priority />
          <div className="flex h-full w-full flex-col items-center">
            {botonesNivelTiempoReal.map((boton) => (
              <div
                key={boton.numero}
                style={{
                  position: "absolute",
                  top: boton.posicionY,
                  height: boton.altura,
                }}
                className={`${boton.color} z-20 flex w-7/8 items-center justify-center rounded-md text-sm font-semibold text-white`}
              >
                {boton.numero}
              </div>
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
            {botonesNivelUltimoCiclo.map((boton) => (
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
