import { Group, Vector4 } from "three"
import { createAccretionDiskLayer } from "../Layers/accretionDiskLayer"
import { createBlackholeLayer } from "../Layers/blackholeLayer"
import { type PlanetOptions } from "../utils"

export const createBlackhole = (options?: PlanetOptions): Group => {
  const blackhole = new Group()

  const horizonSize = options?.horizonSize ?? 0.2
  const diskIntensity = options?.diskIntensity ?? 1.0
  const rotation = options?.rotation ?? 0.0
  const rotationSpeed = options?.rotationSpeed

  const diskColors = options?.colors?.base
    ? options.colors.base.map(c => new Vector4(c[0], c[1], c[2], c[3]))
    : undefined

  // Share one seed across both disk halves so their patterns align seamlessly.
  const diskSeed = Math.random() * 100

  const diskBack = createAccretionDiskLayer({
    rotationSpeed,
    rotation,
    colors: diskColors,
    intensity: diskIntensity,
    horizonSize,
    half: "back",
    seed: diskSeed,
  })
  const horizon = createBlackholeLayer({ horizonSize })
  const diskFront = createAccretionDiskLayer({
    rotationSpeed,
    rotation,
    colors: diskColors,
    intensity: diskIntensity,
    horizonSize,
    half: "front",
    seed: diskSeed,
  })

  diskBack.position.z = -0.01
  diskFront.position.z = 0.01

  blackhole.add(diskBack)
  blackhole.add(horizon)
  blackhole.add(diskFront)

  return blackhole
}
