import { Group, Vector2, Vector4 } from "three"
import { createBasePlanet } from "../Layers/basePlanet"
import { createCraterLayer } from "../Layers/craterLayer"
import { createRiverLayer } from "../Layers/riversLayer"
import { createGroup } from "../Three"
import { type PlanetOptions } from "../utils"

export const createLavaPlanet = (options?: PlanetOptions): Group => {
  const lightPos = options?.lightPosition
    ? new Vector2(options.lightPosition[0], options.lightPosition[1])
    : undefined

  const rotation = options?.rotation ?? 0.0
  const rotationSpeed = options?.rotationSpeed

  const baseColors = options?.colors?.base
    ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : [
        new Vector4(0.560784, 0.301961, 0.341176, 1),
        new Vector4(0.321569, 0.2, 0.247059, 1),
        new Vector4(0.239216, 0.160784, 0.211765, 1),
      ]

  const craterColors = options?.colors?.craters
    ? options.colors.craters.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : [
        new Vector4(0.321569, 0.2, 0.247059, 1),
        new Vector4(0.239216, 0.160784, 0.211765, 1),
      ]

  const riverColors = options?.colors?.rivers
    ? options.colors.rivers.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : [
        new Vector4(1, 0.537255, 0.2, 1),
        new Vector4(0.901961, 0.270588, 0.223529, 1),
        new Vector4(0.678431, 0.184314, 0.270588, 1),
      ]

  const planetGroup = createGroup()

  const basePlanet = createBasePlanet({
    lightPos,
    colors: baseColors,
    rotationSpeed,
    rotation,
  })
  const craterLayer = createCraterLayer({
    lightPos,
    rotationSpeed,
    colors: craterColors,
    rotation,
  })
  const riverLayer = createRiverLayer({
    lightPos,
    rotationSpeed,
    rivers: options?.waterLevel,
    colors: riverColors,
    rotation,
  })
  planetGroup.add(basePlanet)
  planetGroup.add(craterLayer)
  planetGroup.add(riverLayer)
  return planetGroup
}
