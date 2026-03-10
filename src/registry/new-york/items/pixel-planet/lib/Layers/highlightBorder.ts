import {
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PlaneGeometry,
  TextureLoader,
} from "three"

export const Border = (): Mesh => {
  const texture = new TextureLoader().load("/pixel-planet/Images/highlight.png")
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  const planetGeometry = new PlaneGeometry(1, 1)
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
  })
  const mesh = new Mesh(planetGeometry, material)
  return mesh
}
