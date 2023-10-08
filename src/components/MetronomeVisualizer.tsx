'use client';

import Script from 'next/script';
import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function MetronomeVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas ref={canvasRef}></canvas>
  )
}
