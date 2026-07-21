import { Group, Vector4 } from "three"
import { createGalaxyLayer } from "../Layers/galaxyLayer"
import { type PlanetOptions } from "../utils"

export const createGalaxy = (options?: PlanetOptions): Group => {
  const galaxy = new Group()

  const baseColors = options?.colors?.base
    ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : undefined

  const galaxyLayer = createGalaxyLayer({
    rotationSpeed: options?.rotationSpeed,
    rotation: options?.rotation,
    galaxyType: options?.galaxyType,
    colors: baseColors,
  })
  galaxyLayer.scale.set(1.25, 1.25, 1.0)

  galaxy.add(galaxyLayer)

  return galaxy
}
