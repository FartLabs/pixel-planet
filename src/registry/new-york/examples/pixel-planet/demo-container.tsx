"use client"

import { useState } from "react"
import { PixelPlanet, type PixelPlanetProps } from "@/registry/new-york/items/pixel-planet/components/pixel-planet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface PlanetDemoContainerProps {
  type: PixelPlanetProps["type"]
  initialSeed?: number
}

export function PlanetDemoContainer({ type, initialSeed = 123 }: PlanetDemoContainerProps) {
  const [orbitControls, setOrbitControls] = useState(true)
  const [seed, setSeed] = useState(initialSeed)

  const randomizeSeed = () => setSeed(Math.floor(Math.random() * 1000))

  return (
    <div className="flex flex-col items-center gap-8 p-4 w-full">
      <div className="flex h-64 w-64 items-center justify-center">
        <PixelPlanet
          type={type}
          seed={seed}
          className="h-full w-full"
          orbitControls={orbitControls}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Switch
            id={`orbit-controls-${type}`}
            checked={orbitControls}
            onCheckedChange={setOrbitControls}
          />
          <Label htmlFor={`orbit-controls-${type}`} className="cursor-pointer">
            Orbit Controls
          </Label>
        </div>

        <div className="flex items-center gap-2 border-l pl-6">
          <Button
            variant="outline"
            size="sm"
            onClick={randomizeSeed}
            className="h-8 gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Randomize Seed
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums">
            Seed: {seed}
          </span>
        </div>
      </div>
    </div>
  )
}
