"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import WaveformVisualizer from "./WaveformVisualizer";

export default function GraphicEqualizer(props: {
  audioContext: AudioContext | null;
}) {
  return (
    <div className="bg-gray-900 text-center py-4">
      <RangeSlider
        id="low"
        className="single-thumb"
        defaultValue={[0, 1]}
        min={0}
        max={1}
        step={0.01}
        thumbsDisabled={[true, false]}
        rangeSlideDisabled={true}
        vertical={true}
      />
      <RangeSlider
        id="mid"
        className="single-thumb"
        defaultValue={[0, 1]}
        min={0}
        max={1}
        step={0.01}
        thumbsDisabled={[true, false]}
        rangeSlideDisabled={true}
        vertical={true}
      />
      <RangeSlider
        id="high"
        className="single-thumb"
        defaultValue={[0, 1]}
        min={0}
        max={1}
        step={0.01}
        thumbsDisabled={[true, false]}
        rangeSlideDisabled={true}
        vertical={true}
      />
    </div>
  );
}
