import { PerspectiveCamera } from "three"

export const createCamera = (
  fov: number,
  aspect: number,
  near: number,
  far: number,
): PerspectiveCamera => {
  return new PerspectiveCamera(fov, aspect, near, far)
}
