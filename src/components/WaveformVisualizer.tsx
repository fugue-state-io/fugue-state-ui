"use client";
import { useEffect, useRef, useState } from "react";

export default function WaveformVisualizer(props: {
  file: Blob | null;
  elapsed: number;
  height: number;
  loopPercents: number[];
  zoom?: boolean;
  setElapsedConversion?: Function;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [summaryWorker, setSummaryWorker] = useState(new Worker("worker.js"));
  const [numberOfChannels, setNumberOfChannels] = useState<number>(1);
  const [summaries, setSummaries] = useState<
    Array<{ low: number; high: number }>[] | null[]
  >([null, null]);

  summaryWorker.onmessage = (e) => {
    if (numberOfChannels == 2) {
      if (e.data.channel == 0) {
        setSummaries([e.data.summary, summaries[1]]);
      }
      if (e.data.channel == 1) {
        setSummaries([summaries[0], e.data.summary]);
      }
    }
    if (numberOfChannels == 1) {
      setSummaries([e.data.summary]);
    }
  };

  const clickEvent = (event: MouseEvent) => {
    if (canvasRef.current && props.setElapsedConversion) {
      let { width, height } = canvasRef.current.getBoundingClientRect();
      console.log(event.target);
      props.setElapsedConversion(event.offsetX / width, props.loopPercents);
    }
  };

  useEffect(() => {
    if (canvasRef.current && props.setElapsedConversion) {
      console.log("setting click event");
      canvasRef.current.addEventListener("click", clickEvent);
      return () => {
        console.log("unsetting click event");
        canvasRef.current?.removeEventListener("click", clickEvent);
      };
    }
  }, []);

  useEffect(() => {
    const processFile = async (): Promise<void> => {
      if (props.file) {
        const arrayBuffer = await props.file.arrayBuffer();
        const audioContext = new AudioContext();
        await audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          setNumberOfChannels(buffer.numberOfChannels);
          summaryWorker.postMessage({
            channel: 0,
            buffer: buffer.getChannelData(0),
          });
          if (buffer.numberOfChannels > 1) {
            summaryWorker.postMessage({
              channel: 1,
              buffer: buffer.getChannelData(1),
            });
          }
        });
      }
    };
    processFile();
  }, [props.file]);

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
        if (numberOfChannels == 1 && summaries[0]) {
          // First
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = 0;
            x < Math.round(summaries[0].length * props.loopPercents[0]);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
          // Second
          context.beginPath();
          context.strokeStyle = "rgb(244, 114, 182)";
          for (
            let x = Math.round(summaries[0].length * props.loopPercents[0]);
            x < Math.round(summaries[0].length * props.elapsed);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
          // Third
          context.beginPath();
          context.strokeStyle = "rgb(74, 222, 128)";
          for (
            let x = Math.round(summaries[0].length * props.elapsed);
            x < Math.round(summaries[0].length * props.loopPercents[1]);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
          // Fourth
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = Math.round(summaries[0].length * props.loopPercents[1]);
            x < Math.round(summaries[0].length);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 2 +
                context.canvas.height / 2
            );
          }
          context.stroke();
        } else if (numberOfChannels == 2 && summaries[0] && summaries[1]) {
          // First
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = 0;
            x < Math.round(summaries[0].length * props.loopPercents[0]);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["high"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
          }
          context.stroke();
          // Second
          context.beginPath();
          context.strokeStyle = "rgb(244, 114, 182)";
          for (
            let x = Math.round(summaries[0].length * props.loopPercents[0]);
            x < Math.round(summaries[0].length * props.elapsed);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["high"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
          }
          context.stroke();
          // Third
          context.beginPath();
          context.strokeStyle = "rgb(74, 222, 128)";
          for (
            let x = Math.round(summaries[0].length * props.elapsed);
            x < Math.round(summaries[0].length * props.loopPercents[1]);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["high"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
          }
          context.stroke();
          // Fourth
          context.beginPath();
          context.strokeStyle = "#444444";
          for (
            let x = Math.round(summaries[0].length * props.loopPercents[1]);
            x < Math.round(summaries[0].length);
            x++
          ) {
            context.moveTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["low"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.lineTo(
              (x / summaries[0].length) * context.canvas.width,
              (summaries[0][x]["high"] * context.canvas.height) / 4 +
                context.canvas.height / 4
            );
            context.moveTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["low"] * context.canvas.height) / 4 +
                (context.canvas.height * 3) / 4
            );
            context.lineTo(
              (x / summaries[1].length) * context.canvas.width,
              (summaries[1][x]["high"] * context.canvas.height) / 4 +
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
  }, [summaries, props.elapsed, props.loopPercents]);

  return (
    <canvas
      ref={canvasRef}
      width="2048px"
      height={props.height}
      style={{ width: "100%", height: props.height.toString() + "px" }}
    ></canvas>
  );
}
