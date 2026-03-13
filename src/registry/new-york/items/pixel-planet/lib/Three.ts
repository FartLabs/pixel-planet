import { Clock, Group, Scene, WebGLRenderer } from "three";

export function createScene(): Scene {
  return new Scene();
}

export function createClock(): Clock {
  return new Clock();
}

export function createWebGlRenderer(): WebGLRenderer {
  return new WebGLRenderer();
}

export function createGroup(): Group {
  return new Group();
}
