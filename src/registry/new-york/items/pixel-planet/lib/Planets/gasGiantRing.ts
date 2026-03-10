import { Group, Vector2 } from "three"
import { createDenseGasPlanet } from "../Layers/denseGasLayer"
import { createRingLayer } from "../Layers/ringLayer"
import { type PlanetOptions } from "../utils"

export const createGasGiantRing = (options?: PlanetOptions): Group => {
  const gasGiantGroup = new Group()

  const lightPos = options?.lightPosition
    ? new Vector2(options.lightPosition[0], options.lightPosition[1])
    : undefined

  const rotationSpeed = options?.rotationSpeed

  const ring = createRingLayer(lightPos, rotationSpeed)
  const gasPlanet = createDenseGasPlanet(lightPos, rotationSpeed)
  ring.position.z = 0.01
  ring.scale.set(2.0, 2.0, 1.0)
  gasGiantGroup.add(gasPlanet)
  gasGiantGroup.add(ring)

  return gasGiantGroup
}
