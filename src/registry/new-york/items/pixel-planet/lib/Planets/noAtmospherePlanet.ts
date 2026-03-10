import { Group } from "three"
import { createBasePlanet } from "../Layers/basePlanet"
import { createCraterLayer } from "../Layers/craterLayer"

import { type PlanetOptions } from "../utils"
import { Vector2, Vector4 } from "three"

export const createNoAtmospherePlanet = (options?: PlanetOptions): Group => {
  const noAtmospherePlanet = new Group()

  const basePlanet = createBasePlanet(
    options?.lightPosition
      ? new Vector2(options.lightPosition[0], options.lightPosition[1])
      : undefined,
    undefined,
    options?.colors?.base
      ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
      : undefined,
    options?.rotationSpeed,
    options?.rotation,
  )
  const craterLayer = createCraterLayer(
    options?.lightPosition
      ? new Vector2(options.lightPosition[0], options.lightPosition[1])
      : undefined,
    options?.colors?.craters
      ? options.colors.craters.map(c => new Vector4(c[0], c[1], c[2], c[3]))
      : undefined,
    options?.rotationSpeed,
    options?.rotation,
  )

  noAtmospherePlanet.add(basePlanet)
  noAtmospherePlanet.add(craterLayer)

  return noAtmospherePlanet
}
