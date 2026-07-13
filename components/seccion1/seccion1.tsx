"use client"

import { useEffect, useState } from "react"

import {
  getBotonesNivel,
  getBuffer,
  getNivel,
  NivelData,
} from "./nivelesLogic"

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
  return (
    <div className="flex w-full flex-row gap-5 rounded bg-background2 p-5">
      <div className="flex flex-col justify-center gap-5">
        <Button className="flex aspect-square h-auto flex-col items-center justify-center gap-3 p-3">
          <FaRegFileExcel className="size-15" />
          <p className="text-lg">DESCARGAR REPORTE</p>
        </Button>

        <Button className="flex aspect-square h-auto flex-col items-center justify-center gap-3 p-3">
          <PiMicrosoftOutlookLogoBold className="size-15" />
          <p className="text-lg">
            SIMULAR ENVIO DE
            <br />
            REENVIO AUTOMATICO
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

        <div className="flex w-1/2 items-center justify-center">
          <Image
            alt="RACK"
            src="/RACK.png"
            width={343}
            height={662}
            className="w-auto"
            priority
          />
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

        <div className="relative w-1/2 items-center justify-center">
          <Image
            alt="RACK"
            src="/RACK.png"
            fill
            className="w-full items-center justify-center object-contain"
            priority
          />

          <div className="absolute items-center justify-center inset-0 z-10 mt-12.5 grid w-full grid-rows-16">
            {botonesNivel.map((boton) => (
              <Button
                key={boton.numero}
                onClick={() => setNivelSeleccionado(boton.numero)}
                style={{ gridRow: boton.numero }}
                className={`${boton.color} text-white ${
                  nivelSeleccionado === boton.numero
                    ? "ring-4 ring-primary"
                    : ""
                } ml-4 h-9`}
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