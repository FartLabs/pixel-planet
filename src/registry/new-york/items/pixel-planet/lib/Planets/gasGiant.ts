import { Group, Vector2, Vector4 } from "three"
import { createBaseGasPlanet } from "../Layers/baseGasPlanet"
import { createGasPLayer } from "../Layers/gasLayer"
import { type PlanetOptions } from "../utils"

export const createGasGiant = (options?: PlanetOptions): Group => {
  const gasGiantGroup = new Group()

  const lightPos = options?.lightPosition
    ? new Vector2(options.lightPosition[0], options.lightPosition[1])
    : undefined

  const rotation = options?.rotation ?? 0.0
  const rotationSpeed = options?.rotationSpeed

  const baseColors = options?.colors?.base
    ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : undefined

  const cloudColors = options?.colors?.clouds
    ? options.colors.clouds.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : undefined

  const basePlanet = createBaseGasPlanet({
    lightPos,
    cloudCover: options?.cloudCover,
    colors: baseColors,
    rotationSpeed,
    rotation,
  })
  const gasLayer = createGasPLayer({
    lightPos,
    cloudCover: options?.cloudCover,
    colors: cloudColors,
    rotationSpeed,
    rotation,
  })
  gasLayer.position.z = 0.01
  gasGiantGroup.add(basePlanet)
  gasGiantGroup.add(gasLayer)

  return gasGiantGroup
}
