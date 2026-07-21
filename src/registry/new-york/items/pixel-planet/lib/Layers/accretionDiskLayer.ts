import { Mesh, PlaneGeometry, ShaderMaterial, Vector4 } from "three"
import { flip } from "../utils"
import type { AccretionDiskLayerOptions } from "./types"

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
        uniform float horizon_size;
        uniform float disk_intensity;
        uniform float clip_mode; // 0.0 = full, 1.0 = back (top half), 2.0 = front (bottom half)
        uniform vec4 col1;
        uniform vec4 col2;
        uniform vec4 col3;
        uniform vec4 col4;
        bool should_dither = true;
        float size = 10.0;
        int OCTAVES = 4;

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

            // clip so the disk passes behind the top of the horizon
            // and in front of the bottom
            if (clip_mode == 1.0 && uv.y < 0.5) discard;
            if (clip_mode == 2.0 && uv.y > 0.5) discard;

            // tilt into a thin disk
            vec2 centered = uv - vec2(0.5);
            float screen_d = length(centered);
            centered *= vec2(1.0, 1.8);
            float dist = length(centered);
            float angle = atan(centered.y, centered.x);

            // disk band between the horizon and the outer rim
            float inner = horizon_size;
            float outer = 0.5;
            float disk = smoothstep(inner, inner + 0.06, screen_d)
                * (1.0 - smoothstep(outer - 0.15, outer, dist));

            // differential rotation: inner material orbits faster
            float orbit = angle - (time * time_speed * 2.0) / (dist * 4.0 + 0.2) - rotation;
            float bands = fbm(vec2(orbit * 3.0, dist * 30.0));

            float v = disk * (0.35 + 0.65 * bands);
            // hotter toward the inner edge
            v += disk * (1.0 - smoothstep(inner, inner + 0.18, screen_d)) * 1.2;
            v *= disk_intensity;

            if (dith || !should_dither) { // here we dither
                v *= 1.2;
            }

            // posterize into 4 bands and pick colors
            float band = clamp(floor(v * 4.0) / 4.0, 0.0, 1.0);
            vec4 col = col4;
            if (band >= 0.5) col = col3;
            if (band >= 0.75) col = col2;
            if (band >= 1.0) col = col1;

            float a = step(0.15, v);

            gl_FragColor = vec4(col.rgb, a * col.a);
            if (gl_FragColor.a < 0.01) discard;
        }
    `
}

export function createAccretionDiskLayer(
  options: AccretionDiskLayerOptions = {},
): Mesh {
  const {
    rotationSpeed = 0.1,
    rotation = 0.0,
    colors = null,
    intensity = 1.0,
    horizonSize = 0.2,
    half,
    seed,
  } = options

  const colorPalette = colors
    ? colors
    : [
        new Vector4(1.0, 0.98, 0.9, 1),
        new Vector4(1.0, 0.75, 0.4, 1),
        new Vector4(0.85, 0.4, 0.2, 1),
        new Vector4(0.4, 0.15, 0.1, 1),
      ]

  const clipModeMap: Record<string, number> = {
    back: 1.0,
    front: 2.0,
  }

  const diskGeometry = new PlaneGeometry(1, 1)
  const diskMaterial = new ShaderMaterial({
    uniforms: {
      pixels: { value: 100.0 },
      col1: { value: colorPalette[0] },
      col2: { value: colorPalette[1] },
      col3: { value: colorPalette[2] },
      col4: { value: colorPalette[3] },
      horizon_size: { value: horizonSize },
      disk_intensity: { value: intensity },
      clip_mode: { value: half ? (clipModeMap[half] ?? 0.0) : 0.0 },
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

  const diskLayer = new Mesh(diskGeometry, diskMaterial)

  return diskLayer
}
