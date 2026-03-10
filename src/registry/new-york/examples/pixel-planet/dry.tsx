import { PixelPlanet } from "@/registry/new-york/items/pixel-planet/components/pixel-planet"

export default function PixelPlanetDryDemo() {
  return (
    <div className="flex h-64 w-64 items-center justify-center">
      <PixelPlanet type="dry" seed={42} className="h-full w-full" />
    </div>
  )
}
