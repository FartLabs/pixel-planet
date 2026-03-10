import { PixelPlanet } from "@/registry/new-york/items/pixel-planet/components/pixel-planet"

export default function PixelPlanetStarDemo() {
  return (
    <div className="flex h-64 w-64 items-center justify-center bg-zinc-950">
      <PixelPlanet type="star" seed={42} className="h-full w-full" />
    </div>
  )
}
