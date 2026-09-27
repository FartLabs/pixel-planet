import { Mesh, PlaneGeometry, ShaderMaterial } from "three"
import type { BlackholeLayerOptions } from "./types"

const vertexShader = (): string => {
  return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

const fragmentShader = (): string => {
  return `
        varying vec3 vUv;
        uniform float pixels;
        uniform float horizon_size;

        void main() {
            // pixelize uv
            vec2 uv = (floor(vUv.xy*pixels)/pixels) + 0.5;

            // cut out the event horizon disc
            float dist = distance(uv, vec2(0.5));
            float a = step(dist, horizon_size);

            gl_FragColor = vec4(0.0, 0.0, 0.0, a);
            if (gl_FragColor.a < 0.01) discard;
        }
    `
}

export function createBlackholeLayer(
  options: BlackholeLayerOptions = {},
): Mesh {
  const { horizonSize = 0.2 } = options

  const blackholeGeometry = new PlaneGeometry(1, 1)
  const blackholeMaterial = new ShaderMaterial({
    uniforms: {
      pixels: { value: 100.0 },
      horizon_size: { value: horizonSize },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
    transparent: true,
  })

  const blackholeLayer = new Mesh(blackholeGeometry, blackholeMaterial)

  return blackholeLayer
}
