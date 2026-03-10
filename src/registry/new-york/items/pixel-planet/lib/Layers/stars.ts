import {
  Group,
  NearestFilter,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "three"
import { flip, rand, randomPointOnSphere } from "../utils"

export function createStars(count: number): Group {
  const starGroup = new Group()

  for (let i = 0; i < count; i++) {
    const isSpecial = flip()
    let texture
    if (isSpecial) {
      texture = new TextureLoader().load(
        "/pixel-planet/stars/stars-special.png",
      )

      texture.magFilter = NearestFilter
      texture.minFilter = NearestFilter

      texture.repeat.x = 1 / 6
      texture.offset.x = (Math.floor(rand(1, 6) % 6) * 25) / 150

      const mat = new SpriteMaterial({
        map: texture,
        color: flip() ? "#ffef9e" : "#ffffff",
        transparent: true,
        opacity: rand(0.1, 1),
      })

      const starObj = new Sprite(mat)
      starObj.scale.set(0.05, 0.05, 1.0)
      const position = randomPointOnSphere()
      starObj.position.z = position.z
      starObj.position.y = position.y
      starObj.position.x = position.x
      starGroup.add(starObj)
    } else {
      texture = new TextureLoader().load("/pixel-planet/stars/stars.png")

      texture.magFilter = NearestFilter
      texture.minFilter = NearestFilter

      texture.repeat.x = 1 / 17
      texture.offset.x = (Math.floor(rand(1, 17) % 9) * 9) / 144

      const mat = new SpriteMaterial({
        map: texture,
        color: flip() ? "#ffef9e" : "#ffffff",
        transparent: true,
        opacity: rand(0.1, 1),
      })

      const starObj = new Sprite(mat)
      starObj.scale.set(0.03, 0.03, 1.0)
      const position = randomPointOnSphere()
      starObj.position.z = position.z
      starObj.position.y = position.y
      starObj.position.x = position.x
      starGroup.add(starObj)
    }
  }
  return starGroup
}
