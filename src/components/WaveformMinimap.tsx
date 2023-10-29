import * as THREE from 'three'
import React, { CSSProperties, Suspense, createContext, useContext, useEffect, useRef, useState } from 'react'
import { Canvas, ThreeElements } from '@react-three/fiber'
import { TextureLoader } from 'three';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';


const Waveform = (props : {textureUrl: string,
                           style: CSSProperties
                           height: number,
                           width: number}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
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
    <Canvas style={props.style} shadows={false} dpr={[4, 4]}>
      <ambientLight />
      <OrthographicCamera makeDefault position={[0, 0, 1]} />
      <Suspense fallback={null}>
        <mesh ref={mesh}>
          <boxGeometry args={[props.width, props.height, 1]} />
          <meshStandardMaterial ref={material} transparent opacity={1}/>
        </mesh>
      </Suspense>
    </Canvas>
  );
};

export default function WaveformMinimap(props: {texture: string | null,
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