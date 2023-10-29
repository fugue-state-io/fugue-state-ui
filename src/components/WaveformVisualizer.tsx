import * as THREE from 'three'
import React, { CSSProperties, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, ReactThreeFiber } from '@react-three/fiber'
import { TextureLoader } from 'three';
import { OrthographicCamera } from '@react-three/drei';


const Waveform = (props : {textureUrl: string,
                           style: CSSProperties
                           height: number,
                           width: number}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const cam = useRef<THREE.OrthographicCamera>(null);
  const color = new THREE.Color("rgb(17, 24, 39)");
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
  
  return (
    <Canvas style={props.style} shadows={false} dpr={[8, 8]}>
      <ambientLight />
      <OrthographicCamera ref={cam} makeDefault position={[-props.width / 2, 0, 1]} />
      <Suspense fallback={null}>
        <mesh ref={mesh}>
          <boxGeometry args={[props.width, props.height, 1]} />
          <meshStandardMaterial ref={material} transparent opacity={1}/>
        </mesh>
      </Suspense>
    </Canvas>
  );
};

export default function WaveformVisualizer(props: {texture: string | null,
                                                   style: CSSProperties
                                                   height: number,
                                                   width: number}) {
  const [textureUrl, setTextureUrl] = useState<string>("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2MoXDr9PwAF5QKtsumckAAAAABJRU5ErkJggg==")
  useEffect(() => {
    if (props.texture) {
      setTextureUrl(props.texture);
    }
  }, [props.texture])
  return (
    <Waveform style={props.style} height={props.height} width={props.width} textureUrl={textureUrl}></Waveform>
  )
}