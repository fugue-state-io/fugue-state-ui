"use client";
import React, { CSSProperties, useEffect, useRef } from "react";
import style from "styled-jsx/style";
import { context } from "tone";

export default function Waveform(props: {
  height: number;
  width: number;
  channels: number;
  displayChannel: string | undefined;
  elapsed: number | undefined;
  style: CSSProperties | undefined;
  bytes: string | null;
  loopPercents: number[] | undefined;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  function resetStroke(
    context: CanvasRenderingContext2D,
    x: number,
    buffer: Buffer
  ) {
    if (
      props.loopPercents &&
      x ==
        Math.round(
          (buffer.byteLength / (2 * props.channels)) *
            (props.loopPercents[1] / 100)
        )
    ) {
      context.stroke();
      context.beginPath();
      context.strokeStyle = "rgb(128, 128, 128)";
    }
    if (
      props.loopPercents &&
      x ==
        Math.round(buffer.byteLength / (2 * props.channels)) *
          (props.loopPercents[0] / 100)
    ) {
      context.stroke();
      context.beginPath();
      context.strokeStyle = "rgb(244, 114, 182)";
    }
    if (
      props.elapsed &&
      x ==
        Math.round((buffer.byteLength / (2 * props.channels)) * props.elapsed)
    ) {
      context.stroke();
      context.beginPath();
      context.strokeStyle = "rgb(74, 222, 128)";
    }
  }
  function initStroke(context: CanvasRenderingContext2D) {
    if (props.loopPercents) {
      context.strokeStyle = "rgb(128, 128, 128)";
    } else if (props.elapsed) {
      context.strokeStyle = "rgb(244, 114, 182)";
    } else {
      context.strokeStyle = "rgb(74, 222, 128)";
    }
  }
  function drawLine(
    context: CanvasRenderingContext2D,
    x: number,
    buffer: Buffer,
    offset: number,
    height: number,
    heightOffset: number
  ) {
    const bottom = buffer[x * 2 + offset] / 255;
    const top = buffer[x * 2 + 1 + offset] / 255;
    context.moveTo(
      x,
      top * props.height * height + props.height * heightOffset
    );
    context.lineTo(
      x,
      bottom * props.height * height + props.height * heightOffset
    );
  }
  useEffect(() => {
    if (canvas.current) {
      const context = canvas.current.getContext("2d");
      if (context && props.bytes) {
        context.scale(props.width / 2048, props.height / context.canvas.height);
        context.beginPath();
        initStroke(context);
        let buffer = Buffer.from(props.bytes, "base64");
        console.log(buffer.byteLength);
        let x = 0;
        // default to display both channels
        if (
          props.displayChannel === undefined ||
          props.displayChannel === "both"
        ) {
          // channel one
          while (x < 2048) {
            resetStroke(context, x, buffer);
            drawLine(context, x, buffer, 0, 0.5, 0);
            x = x + 1;
          }
          context.stroke();
          context.beginPath();
          initStroke(context);
          // channel two
          x = 0;
          while (x < 2048) {
            resetStroke(context, x, buffer);
            drawLine(context, x, buffer, 4096, 0.5, 0.5);
            x = x + 1;
          }
          context.stroke();
        } else if (props.displayChannel == "left") {
          while (x < 2048) {
            resetStroke(context, x, buffer);
            drawLine(context, x, buffer, 0, 1, 0);
            x = x + 1;
          }
          context.stroke();
        } else if (props.displayChannel == "right") {
          while (x < 2048) {
            resetStroke(context, x, buffer);
            drawLine(context, x, buffer, 4096, 1, 0);
            x = x + 1;
          }
          context.stroke();
        }
      }
    }
    return () => {
      if (canvas.current) {
        canvas.current.getContext("2d")?.clearRect(0,0,props.width,props.height);
      }
    }
  });
  return (
    <canvas
      ref={canvas}
      height={props.height}
      width={props.width}
      style={props.style}
    ></canvas>
  );
}
