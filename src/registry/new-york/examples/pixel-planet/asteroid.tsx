import { PixelPlanet } from "@/registry/new-york/items/pixel-planet/components/pixel-planet"

export default function PixelPlanetAsteroidDemo() {
  return (
    <div className="flex h-64 w-64 items-center justify-center">
      <PixelPlanet type="asteroid" seed={42} className="h-full w-full" />
    </div>
  )
}
