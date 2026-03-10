import { Group, Vector2 } from "three"
import { createStar } from "../Layers/star"
import { createStarBlobLayer } from "../Layers/starBlobLayer"
import { createStarFlareLayer } from "../Layers/starFlareLayer"
import { type PlanetOptions } from "../utils"

export const createStarPlanet = (options?: PlanetOptions): Group => {
  const StarPlanet = new Group()

  const lightPos = options?.lightPosition
    ? new Vector2(options.lightPosition[0], options.lightPosition[1])
    : undefined

  const rotation = options?.rotation ?? 0.0
  const rotationSpeed = options?.rotationSpeed

  const basePlanet = createStar(
    lightPos,
    undefined,
    rotationSpeed,
    rotation,
    undefined, // color string logic is complex, skipping for now
  )
  const starFlareLayer = createStarFlareLayer(rotationSpeed)
  const blobLayer = createStarBlobLayer(
    rotationSpeed,
    // No easy color mapping for blob unless we define one
    undefined,
  )

  starFlareLayer.position.z = 0.01
  starFlareLayer.scale.set(1.2, 1.2, 1.0)
  blobLayer.position.z = -0.01
  blobLayer.scale.set(1.9, 1.9, 1.0)

  StarPlanet.add(basePlanet)
  StarPlanet.add(starFlareLayer)
  StarPlanet.add(blobLayer)

  return StarPlanet
}
