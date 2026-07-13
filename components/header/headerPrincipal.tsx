"use client"
import { ThemeSwitcher } from "@/components/theme/themeSwitcher"
import { LogoCreminox as Logo } from "@/components/Logos"

export default function HeaderPrincipal() {
  return (
    <>
      <header className="-header sticky top-0 left-0 z-50 flex w-full items-center bg-headerbg p-5">
        {/* Desktop: iconos izquierda */}
        <div className="h-full w-[30%] flex-row items-center justify-start flex">
          <ThemeSwitcher />
        </div>

        {/* Título centrado */}
        <p className="header flex flex-1 justify-center font-bold w-[40%]">
          <span className="hidden md:inline">DEMO AWS - PF MORTADELA</span>
          <span className="md:hidden">DEMO AWS - PF MORTADELA</span>
        </p>

        {/* Desktop: links + logo */}
        <div className="w-[30%] items-center justify-end flex">
          <Logo extraClass="h-6" />
        </div>
      </header>
    </>
  )
}
