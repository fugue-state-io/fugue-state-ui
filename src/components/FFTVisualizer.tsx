"use client";
import React, { useState, useEffect, useRef } from "react";
import "react-range-slider-input/dist/style.css";

export default function FFTVisualizer(props: {
  analyser: AnalyserNode | null;
  elapsed: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [floatFrequencyData, setFloatFrequencyData] =
    useState<Float32Array | null>(null);
  useEffect(() => {
    if (canvasRef.current && floatFrequencyData && props.analyser) {
      const canvasCtx = canvasRef.current.getContext("2d");
      if (canvasCtx) {
        canvasCtx.fillStyle = "rgb(244, 114, 182)";

        canvasCtx.clearRect(
          0,
          0,
          canvasCtx.canvas.width,
          canvasCtx.canvas.height
        );
        const barWidth =
          (canvasRef.current.width / props.analyser.frequencyBinCount) * 2.5;
        let posX = 0;
        for (let i = 0; i < props.analyser.frequencyBinCount; i++) {
          const barHeight = (floatFrequencyData[i] + 140) * 2;
          canvasCtx.fillStyle = "rgb()";
          canvasCtx.fillRect(
            posX,
            canvasRef.current.height - barHeight / 2,
            barWidth,
            barHeight / 2
          );
          posX += barWidth + 1;
        }
      }
    }
  }, [floatFrequencyData]);

  useEffect(() => {
    if (props.analyser) {
      let ffd = new Float32Array(props.analyser.frequencyBinCount);
      props.analyser.getFloatFrequencyData(ffd);
      setFloatFrequencyData(ffd);
    }
  }, [props.elapsed]);
  return (
    <div className="w-fit mx-auto">
      <canvas
        ref={canvasRef}
        width="2048px"
        height={props.height}
        style={{ width: "100%", height: props.height.toString() + "px" }}
      ></canvas>
    </div>
  );
}
