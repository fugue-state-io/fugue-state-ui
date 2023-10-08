'use client';

import Script from 'next/script';
import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function MetronomeVisualizer(props: {
  width: string | number | undefined
  height: string | number | undefined
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas ref={canvasRef} width={props.width} height={props.height}></canvas>
  )
}
