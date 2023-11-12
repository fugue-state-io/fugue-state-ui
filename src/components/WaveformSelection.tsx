'use client';
import React, { CSSProperties, useRef, useState } from "react";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Waveform from "./Waveform";

export default function WaveformSelection(props: {
  height: number;
  width: number;
  style: CSSProperties;
  bytes: string | null;
}) {
  const [loopPercents, setLoopPercents] = useState<number []>([0,100]);
  return (
    <div className="range-slider-waveform" style={{width: props.width, height: props.height}}>
      <RangeSlider id="range-slider-waveform" min={0} max={100} step={0.01} value={loopPercents} onInput={setLoopPercents}>
      </RangeSlider>
      <Waveform bytes={props.bytes} height={props.height} width={props.width} channels={2} displayChannel="both" style={props.style} loopPercents={loopPercents}></Waveform>
    </div>
  );
}