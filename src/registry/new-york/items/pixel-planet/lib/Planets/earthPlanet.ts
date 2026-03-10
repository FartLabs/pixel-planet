import { Group, Vector2, Vector4 } from "three"
import { createAtmosphereLayer } from "../Layers/atmosphereLayer"
import { createBasePlanet } from "../Layers/basePlanet"
import { createCloudLayer } from "../Layers/cloudLayer"
import { createlandMassLayer } from "../Layers/landMass"
import { type PlanetOptions } from "../utils"

export const createEarthPlanet = (options?: PlanetOptions): Group => {
  const earth = new Group()

  const lightPos = options?.lightPosition
    ? new Vector2(options.lightPosition[0], options.lightPosition[1])
    : undefined

  const rotation = options?.rotation ?? 0.0
  const rotationSpeed = options?.rotationSpeed

  const baseColors = options?.colors?.base
    ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : [
        new Vector4(102 / 255, 176 / 255, 199 / 255, 1),
        new Vector4(102 / 255, 176 / 255, 199 / 255, 1),
        new Vector4(52 / 255, 65 / 255, 157 / 255, 1),
      ]

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
  const landmass = createlandMassLayer(
    lightPos,
    undefined,
    undefined, // land colors?? we could map them, but for now undefined
    rotationSpeed,
    rotation,
    0.5,
  )
  const clouds = createCloudLayer(
    cloudColors,
    lightPos,
    rotationSpeed,
    rotation,
    options?.cloudCover,
  )
  const atmosphere = createAtmosphereLayer()

  earth.add(basePlanet, landmass, clouds, atmosphere)
  return earth
}
