import * as THREE from 'three'
import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Color } from 'three';

const vertexShader = `
uniform float u_time;

varying float vZ;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  vZ = modelPosition.y;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`

const fragmentShader = `
uniform vec3 u_colorA;
uniform vec3 u_colorB;
varying float vZ;


void main() {
  vec3 color = mix(u_colorA, u_colorB, vZ * 2.0 + 0.5); 
  gl_FragColor = vec4(color, 1.0);
}
`

function Waveform(props: ThreeElements['mesh']) {
  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_duration: {
        value: 0.0,
      },
      u_colorA: { value: new Color("#FFFFFF") },
      u_colorB: { value: new Color("#000000") },
    }), []
  );
  const ref = useRef<THREE.Mesh>(null!)
  return (
    <mesh {...props} ref={ref}  scale={1.0}>
      <planeGeometry args={[-32, -4, 32, 4]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}


export default function WaveformVisualizer() {
  return (
    <Canvas>
      <Waveform position={[0, 0, 0]} />
    </Canvas>
  )
}
