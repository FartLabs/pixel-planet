"use client"

import { useEffect, useRef } from "react"
import GUI from "lil-gui"
import { type PlanetOptions } from "@/registry/new-york/items/pixel-planet/lib/utils"

interface PlanetGuiProps {
  type: string
  seed: number
  onSeedChange: (seed: number) => void
  options: PlanetOptions
  onOptionsChange: (options: PlanetOptions) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function PlanetGui({
  type,
  seed,
  onSeedChange,
  options,
  onOptionsChange,
  containerRef,
}: PlanetGuiProps) {
  const guiRef = useRef<GUI | null>(null)

  // Use refs to keep state current for callbacks without re-triggering the main effect
  const optionsRef = useRef(options)
  const seedRef = useRef(seed)
  const onSeedChangeRef = useRef(onSeedChange)
  const onOptionsChangeRef = useRef(onOptionsChange)

  useEffect(() => {
    optionsRef.current = options
    seedRef.current = seed
    onSeedChangeRef.current = onSeedChange
    onOptionsChangeRef.current = onOptionsChange
  }, [options, seed, onSeedChange, onOptionsChange])

  useEffect(() => {
    if (!containerRef.current) return

    const gui = new GUI({
      container: containerRef.current,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Controls`,
      closeFolders: true,
    })
    guiRef.current = gui

    const params = {
      seed: seedRef.current,
      randomize: () =>
        onSeedChangeRef.current(Math.floor(Math.random() * 1000)),
      lightX: optionsRef.current.lightPosition?.[0] ?? 0.39,
      lightY: optionsRef.current.lightPosition?.[1] ?? 0.39,
      rotation: optionsRef.current.rotation ?? 0.0,
      orbitControls: optionsRef.current.orbitControls ?? true,
      sensitivity: optionsRef.current.orbitControlsSensitivity ?? -0.005,
      rotationSpeed: optionsRef.current.rotationSpeed ?? 1.0,
      pixelSize: optionsRef.current.pixelSize ?? 1.0,
      cloudCover: optionsRef.current.cloudCover ?? 0.5,
      waterLevel: optionsRef.current.waterLevel ?? 0.5,
      // Color proxies (RGB only for lil-gui simpler interface)
      baseColor: optionsRef.current.colors?.base?.[0]
        ? optionsRef.current.colors.base[0].slice(0, 3)
        : [0.4, 0.7, 0.8],
      cloudColor: optionsRef.current.colors?.clouds?.[0]
        ? optionsRef.current.colors.clouds[0].slice(0, 3)
        : [1.0, 1.0, 1.0],
    }

    gui
      .add(params, "seed")
      .name("Seed")
      .listen()
      .onChange((val: number) => {
        onSeedChangeRef.current(val)
      })
    gui.add(params, "randomize").name("Randomize Seed")

    const lightingFolder = gui.addFolder("Lighting")
    lightingFolder
      .add(params, "lightX", 0, 1)
      .name("Light X")
      .onChange((val: number) => {
        onOptionsChangeRef.current({
          ...optionsRef.current,
          lightPosition: [val, params.lightY],
        })
      })
    lightingFolder
      .add(params, "lightY", 0, 1)
      .name("Light Y")
      .onChange((val: number) => {
        onOptionsChangeRef.current({
          ...optionsRef.current,
          lightPosition: [params.lightX, val],
        })
      })

    const motionFolder = gui.addFolder("Motion")
    motionFolder
      .add(params, "rotation", 0, Math.PI * 2)
      .name("Initial Rotation")
      .onChange((val: number) => {
        onOptionsChangeRef.current({ ...optionsRef.current, rotation: val })
      })
    motionFolder
      .add(params, "orbitControls")
      .name("Orbit Controls")
      .onChange((val: boolean) =>
        onOptionsChangeRef.current({
          ...optionsRef.current,
          orbitControls: val,
        }),
      )
    motionFolder
      .add(params, "sensitivity", -0.1, -0.001)
      .name("Sensitivity")
      .onChange((val: number) =>
        onOptionsChangeRef.current({
          ...optionsRef.current,
          orbitControlsSensitivity: val,
        }),
      )
    motionFolder
      .add(params, "rotationSpeed", 0, 5)
      .name("Animation Speed")
      .onChange((val: number) =>
        onOptionsChangeRef.current({
          ...optionsRef.current,
          rotationSpeed: val,
        }),
      )

    const cameraFolder = gui.addFolder("Camera")
    cameraFolder
      .add(
        {
          distance:
            optionsRef.current.cameraDistance ??
            (type === "gas_giant_2" ? 1.5 : 1.0),
        },
        "distance",
        0.5,
        5,
      )
      .name("Distance")
      .onChange((val: number) =>
        onOptionsChangeRef.current({
          ...optionsRef.current,
          cameraDistance: val,
        }),
      )

    const appearanceFolder = gui.addFolder("Appearance")
    appearanceFolder
      .add(params, "pixelSize", 0.1, 4, 0.1)
      .name("Pixel Size")
      .onChange((val: number) =>
        onOptionsChangeRef.current({ ...optionsRef.current, pixelSize: val }),
      )

    if (
      type === "earth" ||
      type === "ice" ||
      type === "gas_giant_1" ||
      type === "gas_giant_2"
    ) {
      appearanceFolder
        .add(params, "cloudCover", 0, 1)
        .name("Cloud / Gas Cover")
        .onChange((val: number) =>
          onOptionsChangeRef.current({
            ...optionsRef.current,
            cloudCover: val,
          }),
        )
    }

    if (type === "earth" || type === "lava") {
      appearanceFolder
        .add(params, "waterLevel", 0, 1)
        .name(type === "earth" ? "Water Level" : "Lava Level")
        .onChange((val: number) =>
          onOptionsChangeRef.current({
            ...optionsRef.current,
            waterLevel: val,
          }),
        )
    }

    const colorsFolder = gui.addFolder("Colors")
    colorsFolder
      .addColor(params, "baseColor")
      .name("Base Layer")
      .onChange((val: number[]) => {
        onOptionsChangeRef.current({
          ...optionsRef.current,
          colors: {
            ...optionsRef.current.colors,
            base: [[val[0], val[1], val[2], 1.0]],
          },
        })
      })

    if (
      type === "earth" ||
      type === "ice" ||
      type === "gas_giant_1" ||
      type === "gas_giant_2"
    ) {
      colorsFolder
        .addColor(params, "cloudColor")
        .name("Atmosphere")
        .onChange((val: number[]) => {
          onOptionsChangeRef.current({
            ...optionsRef.current,
            colors: {
              ...optionsRef.current.colors,
              clouds: [[val[0], val[1], val[2], 1.0]],
            },
          })
        })
    }

    gui.close()

    return () => {
      gui.destroy()
    }
  }, [type, containerRef])

  // Sync external changes *back* into lil-gui params if needed (e.g. from Randomize button)
  useEffect(() => {
    if (guiRef.current) {
      // Find the seed controller and update it
      const seedController = guiRef.current.controllers.find(
        c => c._name === "Seed",
      )
      if (seedController && seedController.getValue() !== seed) {
        seedController.setValue(seed)
      }
    }
  }, [seed])

  return null
}
