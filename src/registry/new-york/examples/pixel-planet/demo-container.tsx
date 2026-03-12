"use client"

import { useRef, useState } from "react"
import {
  PixelPlanet,
  type PixelPlanetProps,
} from "@/registry/new-york/items/pixel-planet/components/pixel-planet"
import { type PlanetOptions } from "@/registry/new-york/items/pixel-planet/lib/utils"
import { PlanetGui } from "./planet-gui"

interface PlanetDemoContainerProps {
  type: PixelPlanetProps["type"]
  initialSeed?: number
}

export function PlanetDemoContainer({
  type,
  initialSeed = 123,
}: PlanetDemoContainerProps) {
  const [seed, setSeed] = useState(initialSeed)
  const [options, setOptions] = useState<PlanetOptions>({
    orbitControls: true,
  })
  const guiContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative flex min-h-[400px] w-full flex-col items-center gap-8 p-4">
      <div className="flex h-80 w-80 items-center justify-center">
        <PixelPlanet
          type={type}
          seed={seed}
          className="h-full w-full"
          orbitControls={options.orbitControls}
          orbitControlsSensitivity={options.orbitControlsSensitivity}
          advanced={options}
        />
      </div>

      {/* GUI Container */}
      <div ref={guiContainerRef} className="absolute top-4 right-4 z-10" />

      <PlanetGui
        type={type}
        seed={seed}
        onSeedChange={setSeed}
        options={options}
        onOptionsChange={setOptions}
        containerRef={guiContainerRef}
      />
    </div>
  )
}
