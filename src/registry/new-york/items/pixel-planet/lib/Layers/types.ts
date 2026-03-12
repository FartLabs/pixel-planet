import { Vector2, Vector4 } from "three"

export interface LayerOptions {
  lightPos?: Vector2
  rotationSpeed?: number
  rotation?: number
  time?: number
  seed?: number
}

export interface RingLayerOptions extends LayerOptions {
  ringWidth?: number
  perspective?: number
  scalePlanet?: number
}

export interface StarFlareLayerOptions extends LayerOptions {
  stormWidth?: number
  stormDitherWidth?: number
  color?: string | null
}

export interface BasePlanetLayerOptions extends LayerOptions {
  lightIntensity?: number
  colors?: Vector4[] | null
  manualOffset?: number
}

export interface DenseGasLayerOptions extends LayerOptions {
  // Add specific options if needed, currently uses defaults from LayerOptions
}

export interface CloudLayerOptions extends LayerOptions {
  colors?: Vector4[]
  cloudCover?: number
  stretch?: number
  manualOffset?: number
}

export interface LandMassLayerOptions extends LayerOptions {
  lightIntensity?: number
  colors?: Vector4[] | null
  land?: number
  manualOffset?: number
}

export interface RiverLayerOptions extends LayerOptions {
  rivers?: number
  colors?: Vector4[]
}

export interface LakeLayerOptions extends LayerOptions {
  waterLevel?: number
  colors?: Vector4[] | null
}

export interface CraterLayerOptions extends LayerOptions {
  colors?: Vector4[] | null
}

export interface GasLayerOptions extends LayerOptions {
  cloudCover?: number
  colors?: Vector4[] | null
  stretch?: number
  cloudCurve?: number
}

export interface BaseGasLayerOptions extends LayerOptions {
  cloudCover?: number
  colors?: Vector4[]
  stretch?: number
  cloudCurve?: number
}

export interface StarBlobLayerOptions extends LayerOptions {
  blobColor?: Vector4 | null
}

export interface StarLayerOptions extends LayerOptions {
  lightIntensity?: number
  color?: string | null
}
