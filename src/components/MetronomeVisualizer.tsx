'use client';
import React, { useState, useEffect, useRef } from 'react';

export const draw = (
  canvas: HTMLCanvasElement | null,
  bpm: number,
  subDivisions: number,
  width: number,
  duration:number,
  loopPercents: number [],
  phaseOffset: number
): void => {
  let ctx = null;
  if (canvas) {
    ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#111827";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#9CA3AF";

      let totalBeats = duration * bpm / 120;
      let totalSubdivisions = totalBeats * subDivisions;
      let pxBetweenSub = width / totalSubdivisions
      let pxBetweenBeat = width / totalBeats
      let pxPhaseOffset =  pxBetweenBeat * phaseOffset / 100;
      for (let i = 0; i < totalSubdivisions; i++) {
        ctx.fillRect(i * pxBetweenSub + pxPhaseOffset, 0, 1, 30);
      }

      for (let i = 0; i < totalBeats; i++) {
        ctx.fillRect(i * pxBetweenBeat - 1 + pxPhaseOffset, 0, 3, 60);
      }

      ctx.setTransform(1 / ((loopPercents[1] / 1000) - (loopPercents[0] / 1000)), 0, 0, 1, -width * (loopPercents[0] / 1000) / (loopPercents[1] /1000 - loopPercents[0] /1000), 0);
    }
  } else {
    return;
  }
};

export default function MetronomeVisualizer(props: {
  width: number
  height: number 
  zoom: boolean,
  bpm: number,
  phaseOffset: number,
  subDivisions : number,
  duration: number,
  loopPercents: number [],
  style?: React.CSSProperties,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    return () => {
    }
  },[]);
  useEffect(() => {
    draw(canvasRef.current, props.bpm, props.subDivisions, props.width, props.duration, props.loopPercents, props.phaseOffset);
  },[props.width, props.height, props.bpm, props.subDivisions, props.duration, props.loopPercents, props.phaseOffset])
  return (
    <canvas ref={canvasRef} width={props.width} height={props.height} style={{...props.style}}></canvas>
  )
}
