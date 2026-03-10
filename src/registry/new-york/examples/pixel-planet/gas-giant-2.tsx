import { PixelPlanet } from "@/registry/new-york/items/pixel-planet/components/pixel-planet"

export default function PixelPlanetGasGiant2Demo() {
  return (
    <div className="flex h-64 w-64 items-center justify-center">
      <PixelPlanet type="gas_giant_2" seed={42} className="h-full w-full" />
    </div>
  )
}
