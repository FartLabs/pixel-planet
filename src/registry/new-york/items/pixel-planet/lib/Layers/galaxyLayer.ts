import { Mesh, PlaneGeometry, ShaderMaterial, Vector4 } from "three"
import { flip } from "../utils"
import type { GalaxyLayerOptions } from "./types"

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
        uniform float time_speed;
        uniform float time;
        uniform float rotation;
        uniform float seed;
        uniform float galaxy_type; // 0.0 = spiral, 1.0 = elliptical, 2.0 = irregular
        uniform vec4 col1;
        uniform vec4 col2;
        uniform vec4 col3;
        uniform vec4 col4;
        bool should_dither = true;
        float size = 8.0;
        int OCTAVES = 5;

        float rand(vec2 co) {
            co = mod(co, vec2(1.0,1.0)*floor(size+0.5));
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);
        }

        float noise(vec2 coord){
            vec2 i = floor(coord);
            vec2 f = fract(coord);

            float a = rand(i);
            float b = rand(i + vec2(1.0, 0.0));
            float c = rand(i + vec2(0.0, 1.0));
            float d = rand(i + vec2(1.0, 1.0));

            vec2 cubic = f * f * (3.0 - 2.0 * f);

            return mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;
        }

        float fbm(vec2 coord){
            float value = 0.0;
            float scale = 0.5;

            for(int i = 0; i < OCTAVES ; i++){
                value += noise(coord) * scale;
                coord *= 2.0;
                scale *= 0.5;
            }
            return value;
        }

        bool dither(vec2 uv1, vec2 uv2) {
            return mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;
        }

        void main() {
            // pixelize uv
            vec2 uv = (floor(vUv.xy*pixels)/pixels) + 0.5;

            bool dith = dither(vUv.xy, uv);

            // center, and squash elliptical galaxies
            vec2 centered = uv - vec2(0.5);
            if (galaxy_type == 1.0) {
                centered *= vec2(1.0, 1.6);
            }
            float dist = length(centered) * 1.6;
            float angle = atan(centered.y, centered.x);

            // slow rotation over time
            angle -= rotation + time * time_speed * 0.2;

            // logarithmic spiral arms, 2 or 3 depending on seed
            float arms = 2.0 + mod(floor(seed), 2.0);
            float spiral = 0.5 + 0.5 * cos(arms * angle - 5.0 * log(max(dist, 0.01)));
            spiral = pow(spiral, 2.0);

            // clumpy star-forming regions
            float n = fbm(uv * size + vec2(seed));

            float disk = exp(-dist * 3.0);
            float core = exp(-dist * 10.0) * 1.5;

            float v = disk;
            if (galaxy_type == 0.0) {
                v *= 0.25 + 0.75 * spiral;
            } else if (galaxy_type == 2.0) {
                v *= 0.15 + 0.85 * n;
            } else {
                v *= 0.5 + 0.5 * n;
            }
            v += core;
            v *= 0.5 + n;

            if (dith || !should_dither) { // here we dither
                v *= 1.2;
            }

            // posterize into 4 bands and pick colors
            float band = clamp(floor(v * 4.0) / 4.0, 0.0, 1.0);
            vec4 col = col4;
            if (band >= 0.5) col = col3;
            if (band >= 0.75) col = col2;
            if (band >= 1.0) col = col1;

            // sprinkle individual stars
            float star = rand(uv * pixels);
            if (star > 0.997 && v > 0.05) {
                col = mix(col, vec4(1.0), 0.85);
            }

            float a = step(0.1, v);

            gl_FragColor = vec4(col.rgb, a * col.a);
            if (gl_FragColor.a < 0.01) discard;
        }
    `
}

export function createGalaxyLayer(options: GalaxyLayerOptions = {}): Mesh {
  const {
    rotationSpeed = 0.1,
    rotation = 0.0,
    galaxyType = "spiral",
    colors = null,
    seed,
  } = options

  const colorPalette = colors
    ? colors
    : [
        new Vector4(1.0, 0.95, 0.85, 1),
        new Vector4(0.62, 0.55, 0.95, 1),
        new Vector4(0.35, 0.3, 0.7, 1),
        new Vector4(0.15, 0.12, 0.35, 1),
      ]

  const galaxyTypeMap: Record<string, number> = {
    spiral: 0.0,
    elliptical: 1.0,
    irregular: 2.0,
  }

  const galaxyGeometry = new PlaneGeometry(1, 1)
  const galaxyMaterial = new ShaderMaterial({
    uniforms: {
      pixels: { value: 100.0 },
      col1: { value: colorPalette[0] },
      col2: { value: colorPalette[1] },
      col3: { value: colorPalette[2] },
      col4: { value: colorPalette[3] },
      galaxy_type: { value: galaxyTypeMap[galaxyType] ?? 0.0 },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      seed: {
        value: seed ?? (flip() ? Math.random() * 10 : Math.random() * 100),
      },
      time: { value: 0.0 },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
    transparent: true,
  })

  const galaxyLayer = new Mesh(galaxyGeometry, galaxyMaterial)

  return galaxyLayer
}
