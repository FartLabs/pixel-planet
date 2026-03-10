import { Group, Vector2, Vector4 } from "three"
import { createBasePlanet } from "../Layers/basePlanet"
import { createCloudLayer } from "../Layers/cloudLayer"
import { createLakeLayer } from "../Layers/lakeLayer"
import { type PlanetOptions } from "../utils"

export const createIcePlanet = (options?: PlanetOptions): Group => {
  const icePlanet = new Group()

  const lightPos = options?.lightPosition
    ? new Vector2(options.lightPosition[0], options.lightPosition[1])
    : undefined

  const rotation = options?.rotation ?? 0.0
  const rotationSpeed = options?.rotationSpeed

  const baseColors = options?.colors?.base
    ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : [
        new Vector4(250 / 255, 255 / 255, 255 / 255, 1),
        new Vector4(199 / 255, 212 / 255, 255 / 255, 1),
        new Vector4(146 / 255, 143 / 255, 184 / 255, 1),
      ]

  const lakeColors = options?.colors?.rivers
    ? options.colors.rivers.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : undefined

  const cloudColors = options?.colors?.clouds
    ? options.colors.clouds.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : undefined

  const basePlanet = createBasePlanet(
    lightPos,
    undefined,
    baseColors,
    rotationSpeed,
    rotation,
  )
  const lakeLayer = createLakeLayer(
    lightPos,
    rotationSpeed,
    options?.waterLevel,
    lakeColors,
    rotation,
  )
  const cloudLayer = createCloudLayer(
    cloudColors,
    lightPos,
    rotationSpeed,
    rotation,
    options?.cloudCover,
  )
  icePlanet.add(basePlanet)
  icePlanet.add(lakeLayer)
  icePlanet.add(cloudLayer)

  return icePlanet
}
