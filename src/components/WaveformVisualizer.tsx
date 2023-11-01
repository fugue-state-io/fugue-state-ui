import * as THREE from 'three'
import React, { CSSProperties, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three';
import { OrthographicCamera } from '@react-three/drei';
import { cameraNormalMatrix } from 'three/examples/jsm/nodes/Nodes.js';


const Waveform = (props : {textureUrl: string,
                           style: CSSProperties
                           height: number,
                           width: number,
                           loopPercents: number [],
                           elapsed: number}
                          ) => {
  const waveform_mesh = useRef<THREE.Mesh>(null);
  const crosshair_mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const cam = useRef<THREE.OrthographicCamera>(null);
  useEffect(() => {
    if (props.textureUrl) {
      const textureLoader = new TextureLoader();
      textureLoader.load(props.textureUrl, (t) => {
        if (material.current) {
          material.current.map = t;
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
          <meshStandardMaterial ref={material} transparent opacity={1}/>
        </mesh>
        <mesh ref={crosshair_mesh} position={[(props.width * props.elapsed), 0, 2]}>
          <boxGeometry args={[1, props.height, 1]} />
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
                                                   elapsed: number}) {
  const [textureUrl, setTextureUrl] = useState<string>("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2MoXDr9PwAF5QKtsumckAAAAABJRU5ErkJggg==")
  useEffect(() => {
    if (props.texture) {
      setTextureUrl(props.texture);
    }
  }, [props.texture])
  return (
    <Canvas style={props.style} shadows={false} dpr={[4, 8]}>
      <Waveform style={props.style} height={props.height} width={props.width} textureUrl={textureUrl} loopPercents={props.loopPercents} elapsed={props.elapsed}></Waveform>
    </Canvas>
  )
}