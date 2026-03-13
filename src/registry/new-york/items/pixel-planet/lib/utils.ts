import { createAsteroid } from "./Planets/asteroid";
import { createDryPlanet } from "./Planets/dryPlanet";
import { createEarthPlanet } from "./Planets/earthPlanet";
import { createGasGiant } from "./Planets/gasGiant";
import { createGasGiantRing } from "./Planets/gasGiantRing";
import { createIcePlanet } from "./Planets/icePlanet";
import { createLavaPlanet } from "./Planets/lavaPlanet";
import { createNoAtmospherePlanet } from "./Planets/noAtmospherePlanet";
import { createStarPlanet } from "./Planets/starPlanet";
import { Group } from "three";

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function flip(): boolean {
  return Math.random() > 0.5;
}

export function randomPointOnSphere(): { x: number; y: number; z: number } {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = 0 + 1 * Math.sin(phi) * Math.cos(theta);
  const y = 0 + 1 * Math.sin(phi) * Math.sin(theta);
  const z = 0 + 1 * Math.cos(phi);
  return { x: x, y: y, z: z };
}

export interface PlanetOptions {
  lightPosition?: [number, number];
  rotation?: number;
  rotationSpeed?: number;
  pixelSize?: number;
  waterLevel?: number; // for lakes/rivers
  cloudCover?: number;
  cameraDistance?: number; // for manual zoom control
  orbitControls?: boolean; // Enable drag-to-rotate interaction
  orbitControlsSensitivity?: number; // Custom sensitivity for drag-to-rotate
  colors?: {
    base?: [number, number, number, number][];
    craters?: [number, number, number, number][];
    rivers?: [number, number, number, number][];
    clouds?: [number, number, number, number][];
  };
}

export function generatePlanetByType(
  type: string,
  options?: PlanetOptions,
): Group | undefined {
  switch (type) {
    case "No atmosphere":
      return createNoAtmospherePlanet(options);
    case "Ice Planet":
      return createIcePlanet(options);
    case "Gas giant 1":
      return createGasGiant(options);
    case "Gas giant 2":
      return createGasGiantRing(options);
    case "Asteroid":
      return createAsteroid(options);
    case "Star":
      return createStarPlanet(options);
    case "Lava Planet":
      return createLavaPlanet(options);
    case "Dry Planet":
      return createDryPlanet(options);
    case "Earth Planet":
      return createEarthPlanet(options);
  }
}
