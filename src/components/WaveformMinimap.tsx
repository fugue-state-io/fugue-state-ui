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
  });
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
    <Canvas style={props.style} shadows={false} dpr={[4, 8]}>
      <ambientLight />
      <OrthographicCamera makeDefault position={[0, 0, 1]} top={props.height/ 2} bottom={props.height/-2} />
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
  const [textureUrl, setTextureUrl] = useState<string>("data:image/png;base64,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")
  useEffect(() => {
    if (props.texture) {
      setTextureUrl(props.texture);
    }
  }, [props.texture])
  return (
    <Waveform style={props.style} height={props.height} width={props.width} textureUrl={textureUrl}></Waveform>
  )
}