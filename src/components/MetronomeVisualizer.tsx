'use client';

import Script from 'next/script';
import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

export const draw = (
  canvas: HTMLCanvasElement | null,
  bpm: number,
  subDivisions: number,
  duration:number
): void => {
  let ctx = null;
  if (canvas) {
    ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    return;
  }
};

export default function MetronomeVisualizer(props: {
  width: string | number | undefined
  height: string | number | undefined
  zoom: number [],
  bpm: number,
  subDivisions : number,
  duration: number,
  style?: React.CSSProperties
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    return () => {
    }
  },[]);
  useEffect(() => {
    draw(canvasRef.current, props.bpm, props.subDivisions, props.duration)
  },[props.width, props.height, props.bpm, props.subDivisions, props.duration])
  return (
    <canvas ref={canvasRef} width={props.width} height={props.height}></canvas>
  )
}
