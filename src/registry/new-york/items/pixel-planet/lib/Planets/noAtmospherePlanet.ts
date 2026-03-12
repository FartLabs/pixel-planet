import { Group } from "three"
import { createBasePlanet } from "../Layers/basePlanet"
import { createCraterLayer } from "../Layers/craterLayer"

import { type PlanetOptions } from "../utils"
import { Vector2, Vector4 } from "three"

export const createNoAtmospherePlanet = (options?: PlanetOptions): Group => {
  const noAtmospherePlanet = new Group()

  const lightPos = options?.lightPosition
    ? new Vector2(options.lightPosition[0], options.lightPosition[1])
    : undefined
  const rotationSpeed = options?.rotationSpeed
  const rotation = options?.rotation

  const basePlanet = createBasePlanet({
    lightPos,
    colors: options?.colors?.base
      ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
      : undefined,
    rotationSpeed,
    rotation,
  })
  const craterLayer = createCraterLayer({
    lightPos,
    rotationSpeed,
    colors: options?.colors?.craters
      ? options.colors.craters.map(c => new Vector4(c[0], c[1], c[2], c[3]))
      : undefined,
    rotation,
  })

  noAtmospherePlanet.add(basePlanet)
  noAtmospherePlanet.add(craterLayer)

  return noAtmospherePlanet
}
