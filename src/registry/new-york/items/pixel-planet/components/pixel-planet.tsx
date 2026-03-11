"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import { generatePlanetByType, type PlanetOptions } from "../lib/utils"
import { Timer } from "three"

export interface PixelPlanetProps {
  type:
    | "ice"
    | "gas_giant_1"
    | "gas_giant_2"
    | "asteroid"
    | "star"
    | "lava"
    | "dry"
    | "earth"
    | "no_atmosphere"
  seed: number

  /**
   * advanced customization options for the planet.
   */
  advanced?: PlanetOptions
  className?: string
  stars?: boolean
  orbitControls?: boolean
  orbitControlsSensitivity?: number
}

const mapTypeToLabel: Record<PixelPlanetProps["type"], string> = {
  ice: "Ice Planet",
  gas_giant_1: "Gas giant 1",
  gas_giant_2: "Gas giant 2",
  asteroid: "Asteroid",
  star: "Star",
  lava: "Lava Planet",
  dry: "Dry Planet",
  earth: "Earth Planet",
  no_atmosphere: "No atmosphere",
}

function PlanetContent({
  type,
  seed,
  advanced: options,
  rotationOffset = 0,
}: PixelPlanetProps & { rotationOffset?: number }) {
  const planetLabel = mapTypeToLabel[type]

  // Generate planet group when type changes
  const planet = useMemo(() => {
    return generatePlanetByType(planetLabel, options)
  }, [planetLabel, options])

  // Update seed when it changes
  useEffect(() => {
    if (!planet) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planet.children.forEach((layer: any) => {
      if (layer.material && layer.material.uniforms) {
        if (layer.material.uniforms["seed"]) {
          layer.material.uniforms["seed"].value = seed
        }
      }
    })
  }, [planet, seed])

  const timer = useMemo(() => new Timer(), [])

  // Animation loop - update time and manual offset for texture scrolling
  useFrame(() => {
    if (!planet) return

    timer.update()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planet.children.forEach((layer: any) => {
      if (layer.material && layer.material.uniforms) {
        if (layer.material.uniforms["time"]) {
          layer.material.uniforms["time"].value =
            timer.getElapsed() + rotationOffset
        }
      }
    })
  })

  if (!planet) return null

  return <primitive object={planet} />
}

export function PixelPlanet({
  className,
  stars,
  orbitControls,
  orbitControlsSensitivity,
  ...props
}: PixelPlanetProps & React.ComponentProps<typeof Canvas>) {
  const [isDragging, setIsDragging] = useState(false)
  const [rotationOffset, setRotationOffset] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const dragStartXRef = useRef<number>(0)
  const rotationAtDragStartRef = useRef<number>(0)
  const lastDragTimeRef = useRef<number>(0)
  const lastDragXRef = useRef<number>(0)

  const orbitControlsEnabled = orbitControls ?? orbitControlsSensitivity !== undefined
  const sensitivity = orbitControlsSensitivity ?? -0.005 // Default sensitivity
  const friction = 0.95 // Friction coefficient (lower = more friction)

  // Apply velocity and friction when not dragging
  useEffect(() => {
    if (isDragging || !orbitControlsEnabled) return

    let animationFrame: number

    const applyMomentum = () => {
      setVelocity(v => {
        const newVelocity = v * friction
        // Stop when velocity is very small
        if (Math.abs(newVelocity) < 0.0001) {
          return 0
        }
        return newVelocity
      })

      setRotationOffset(offset => offset + velocity)

      // Continue animation loop if there's still velocity
      if (Math.abs(velocity) > 0.0001) {
        animationFrame = requestAnimationFrame(applyMomentum)
      }
    }

    if (Math.abs(velocity) > 0.0001) {
      animationFrame = requestAnimationFrame(applyMomentum)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isDragging, velocity, orbitControlsEnabled, friction])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!orbitControlsEnabled) return
    setIsDragging(true)
    setVelocity(0) // Stop any existing momentum
    dragStartXRef.current = e.clientX
    lastDragXRef.current = e.clientX
    lastDragTimeRef.current = Date.now()
    rotationAtDragStartRef.current = rotationOffset
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!orbitControlsEnabled || !isDragging) return

    const currentTime = Date.now()
    const deltaX = e.clientX - dragStartXRef.current
    const deltaTime = currentTime - lastDragTimeRef.current

    // Update rotation
    const newOffset = rotationAtDragStartRef.current + deltaX * sensitivity
    setRotationOffset(newOffset)

    // Calculate velocity based on movement since last frame
    if (deltaTime > 0) {
      const movementDelta = e.clientX - lastDragXRef.current
      const instantVelocity =
        ((movementDelta * sensitivity) / Math.max(deltaTime, 16)) * 16
      setVelocity(instantVelocity)
    }

    lastDragXRef.current = e.clientX
    lastDragTimeRef.current = currentTime
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!orbitControlsEnabled) return
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    // Velocity is already set from last move event, momentum will take over
  }

  const cursorStyle = orbitControlsEnabled
    ? isDragging
      ? "grabbing"
      : "grab"
    : "inherit"

  const canvasRef = useRef<HTMLDivElement>(null)

  // Apply cursor style directly to ensure it overrides any CSS
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.querySelector("canvas")
      if (canvas && orbitControlsEnabled) {
        canvas.style.cursor = cursorStyle
      }
    }
  }, [cursorStyle, orbitControlsEnabled])

  return (
    <div ref={canvasRef} className={className} style={props.style}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{
          cursor: cursorStyle,
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        {...props}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {stars && (
          <Stars
            radius={300}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        )}

        <PlanetContent {...props} rotationOffset={rotationOffset} />

        {/* <OrbitControls enablePan={false} /> */}
      </Canvas>
    </div>
  )
}
