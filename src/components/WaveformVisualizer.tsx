import * as THREE from 'three'
import React, { CSSProperties, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three';
import { OrthographicCamera, useTexture } from '@react-three/drei';
import { cameraNormalMatrix } from 'three/examples/jsm/nodes/Nodes.js';

const vertex_shader = `
varying vec2 vUv;

void main()
{
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`

const fragment_shader = `
uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
  vec4 textureColor = texture2D(uTexture, vUv);
  gl_FragColor = textureColor;
}
`

const Waveform = (props : {textureUrl: string,
                           style: CSSProperties
                           height: number,
                           width: number,
                           loopPercents: number [],
                           elapsed: number,
                           duration: number,
                           mpm: number}
                          ) => {
  const waveform_mesh = useRef<THREE.Mesh>(null);
  const crosshair_mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const cam = useRef<THREE.OrthographicCamera>(null);
  const [texture] = useMemo(() => {
    const loader = new TextureLoader();
    return [loader.load(props.textureUrl)];
  }, [props.textureUrl]);

  useEffect(() => {
    if (props.textureUrl) {
      const textureLoader = new TextureLoader();
      textureLoader.load(props.textureUrl, (t) => {
        if (material.current) {
          material.current.uniforms = {uTexture: { value: t}}
          material.current.needsUpdate = true;
        }
      });
    }
  });
  useEffect(() => {
    if (props.textureUrl) {
      const textureLoader = new TextureLoader();
      textureLoader.load(props.textureUrl, (t) => {
        if (material.current) {
          material.current.uniforms = {uTexture: { value: t}}
          material.current.needsUpdate = true;
        }
      });
    }
  }, [props.textureUrl]);

  useFrame((state, delta, xrFrame) => {
    
    if (cam.current) {
      cam.current.left = (props.width * ((props.loopPercents[0]) / 1000)) ;
      cam.current.right = (props.width * (props.loopPercents[1] / 1000));
      cam.current.top = props.height / 2;
      cam.current.bottom = -props.height / 2;
      cam.current.updateProjectionMatrix();
    }
  })

  
  return (
    <>
      <ambientLight />
      <OrthographicCamera ref={cam} makeDefault position={[0, 0, 3]}/>
      <Suspense fallback={null}>
        <mesh ref={waveform_mesh} position={[props.width / 2,3,1]}>
          <boxGeometry args={[props.width, props.height, 1]} />
          <shaderMaterial ref={material} fragmentShader={fragment_shader} vertexShader={vertex_shader} transparent opacity={1}/>
        </mesh>
        
        <mesh ref={crosshair_mesh} position={[(props.width * props.elapsed), 0, 2]}>
          <boxGeometry args={[(props.loopPercents[1] - props.loopPercents[0])/ 1000, props.height, 1]} />
          <meshStandardMaterial transparent opacity={0.7}/>
        </mesh>
        {[...Array(Math.round((props.duration / 60) * props.mpm))].map((x, i) =>
          <mesh key={x} position={[((props.width / Math.ceil((props.duration / 60) * props.mpm)) * i), -props.height / 2, 2]}>
            <boxGeometry key={x} args={[(props.loopPercents[1] - props.loopPercents[0])/ 500, 25, 1]} />
            <meshStandardMaterial key={x} transparent opacity={1}/>
          </mesh>
        )}
        <mesh position={[props.width / 2, -props.height / 2, 2]}>
          <boxGeometry args={[props.width, 1, 1]} />
          <meshStandardMaterial transparent opacity={1}/>
        </mesh>
      </Suspense>
    </>
  );
};

export default function WaveformVisualizer(props: {texture: string | null,
                                                   style: CSSProperties
                                                   height: number,
                                                   width: number,
                                                   loopPercents: number [],
                                                   elapsed: number,
                                                   duration: number,
                                                   mpm: number}) {
  const [textureUrl, setTextureUrl] = useState<string>("data:image/png;base64,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")
  useEffect(() => {
    if (props.texture) {
      setTextureUrl(props.texture);
    }
  }, [props.texture])
  return (
    <Canvas style={props.style} shadows={false} dpr={[4, 8]}>
      <Waveform style={props.style} height={props.height} width={props.width} textureUrl={textureUrl} loopPercents={props.loopPercents} elapsed={props.elapsed} duration={props.duration} mpm={props.mpm}></Waveform>
    </Canvas>
  )
}