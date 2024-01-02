"use client";
import React, { useEffect, useRef, useState } from "react";
import GraphicEqualizer from "./GraphicEqualizer";
export default function WaveformVisualizer(props: {
  file: Blob | null;
  audioContext: AudioContext | null;
  elapsed: number;
  duration: number;
  height: number;
  loopPercents: number[];
  zoom?: boolean;
  setElapsedCallback?: Function;
  setDuration?: Function;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const workerRef = useRef<Worker>();
  // const [summaryWorker, setSummaryWorker] = useState(
  //   new Worker(new URL("../workers/worker.ts", import.meta.url))
  // );
  const [numberOfChannels, setNumberOfChannels] = useState<number>(2);
  const [leftSummary, setLeftSummary] =
    useState<Array<{ low: number; high: number }>>();
  const [rightSummary, setRightSummary] =
    useState<Array<{ low: number; high: number }>>();

  const [monoSummary, setMonoSummary] =
    useState<Array<{ low: number; high: number }>>();
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/worker.ts", import.meta.url)
    );
    workerRef.current.onmessage = (
      event: MessageEvent<{
        channel: number;
        summary: Array<{ low: number; high: number }>;
      }>
    ) => {
      console.log("setting summary", event.data.channel, event.data.summary);
      if (numberOfChannels == 2) {
        if (event.data.channel == 0) {
          setLeftSummary(event.data.summary);
        }
        if (event.data.channel == 1) {
          setRightSummary(event.data.summary);
        }
      }
      if (numberOfChannels == 1) {
        setMonoSummary(event.data.summary);
      }
      return () => {
        workerRef.current?.terminate();
      };
    };
  }, []);

  const clickEvent = (event: MouseEvent) => {
    if (canvasRef.current && props.setElapsedCallback) {
      let { width, height } = canvasRef.current.getBoundingClientRect();
      props.setElapsedCallback(
        ((event.offsetX / width) *
          (props.loopPercents[1] - props.loopPercents[0]) +
          props.loopPercents[0]) *
          props.duration
      );
    }
  };

  useEffect(() => {
    if (canvasRef.current && props.setElapsedCallback) {
      canvasRef.current.addEventListener("click", clickEvent);
      return () => {
        canvasRef.current?.removeEventListener("click", clickEvent);
      };
    }
  });

  useEffect(() => {
    const processFile = async (): Promise<void> => {
      if (props.file && props.audioContext) {
        const arrayBuffer = await props.file.arrayBuffer();
        await props.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          if (props.setDuration) {
            props.setDuration(buffer.duration);
          }
          setNumberOfChannels(buffer.numberOfChannels);
          workerRef.current?.postMessage({
            channel: 0,
            buffer: buffer.getChannelData(0),
          });
          if (buffer.numberOfChannels > 1) {
            workerRef.current?.postMessage({
              channel: 1,
              buffer: buffer.getChannelData(1),
            });
          }
        });
      }
    };
    processFile();
  }, [props.file, props.audioContext]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.resetTransform();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if (props.zoom) {
          context.scale(1 / (props.loopPercents[1] - props.loopPercents[0]), 1);
          context.translate(context.canvas.width * -props.loopPercents[0], 0);
        }
        // waveforms
        if (numberOfChannels == 1 && monoSummary) {
          // First
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = 0;
            x < Math.round(monoSummary.length * props.loopPercents[0]);
            x++
          ) {
            context.moveTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
          // Second
          context.beginPath();
          context.strokeStyle = "rgb(244, 114, 182)";
          for (
            let x = Math.round(monoSummary.length * props.loopPercents[0]);
            x < Math.round(monoSummary.length * props.elapsed);
            x++
          ) {
            context.moveTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
          // Third
          context.beginPath();
          context.strokeStyle = "rgb(74, 222, 128)";
          for (
            let x = Math.round(monoSummary.length * props.elapsed);
            x < Math.round(monoSummary.length * props.loopPercents[1]);
            x++
          ) {
            context.moveTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
          // Fourth
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = Math.round(monoSummary.length * props.loopPercents[1]);
            x < Math.round(monoSummary.length);
            x++
          ) {
            context.moveTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / monoSummary.length) * context.canvas.width,
              (monoSummary[x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
        } else if (numberOfChannels == 2 && leftSummary && rightSummary) {
          // First
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = 0;
            x < Math.round(leftSummary.length * props.loopPercents[0]);
            x++
          ) {
            context.moveTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["high"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
          }
          context.stroke();
          // Second
          context.beginPath();
          context.strokeStyle = "rgb(244, 114, 182)";
          for (
            let x = Math.round(leftSummary.length * props.loopPercents[0]);
            x < Math.round(leftSummary.length * props.elapsed);
            x++
          ) {
            context.moveTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["high"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
          }
          context.stroke();
          // Third
          context.beginPath();
          context.strokeStyle = "rgb(74, 222, 128)";
          for (
            let x = Math.round(leftSummary.length * props.elapsed);
            x < Math.round(leftSummary.length * props.loopPercents[1]);
            x++
          ) {
            context.moveTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["high"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
          }
          context.stroke();
          // Fourth
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = Math.round(leftSummary.length * props.loopPercents[1]);
            x < Math.round(leftSummary.length);
            x++
          ) {
            context.moveTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / leftSummary.length) * context.canvas.width,
              (leftSummary[x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / rightSummary.length) * context.canvas.width,
              (rightSummary[x]["high"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
          }
          context.stroke();
        }
        // Progress Bar
        context.beginPath();
        context.strokeStyle = "#FFFFFF";
        context.moveTo(context.canvas.width * props.elapsed - 0.5, 0);
        context.lineTo(
          context.canvas.width * props.elapsed - 0.5,
          context.canvas.height
        );
        context.moveTo(context.canvas.width * props.elapsed + 0.5, 0);
        context.lineTo(
          context.canvas.width * props.elapsed + 0.5,
          context.canvas.height
        );
        context.stroke();
      }
    }
  }, [
    leftSummary,
    rightSummary,
    monoSummary,
    props.elapsed,
    props.loopPercents,
    props.file,
  ]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width="2048px"
        height={props.height}
        style={{ width: "100%", height: props.height.toString() + "px" }}
      ></canvas>
    </>
  );
}
