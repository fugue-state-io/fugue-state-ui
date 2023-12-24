"use client";
import { useEffect, useRef, useState } from "react";

export default function WaveformVisualizer(props: { file: Blob | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [summaryWorker, setSummaryWorker] = useState(new Worker("worker.js"));
  const [numberOfChannels, setNumberOfChannels] = useState<number>(1);
  const [summaries, setSummaries] = useState<Array<{low: number, high: number}>[]  | null[]>([
    null,
    null,
  ]);

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
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();
        context.strokeStyle = "#FFFFFF";
        if (numberOfChannels == 1 && summaries[0]) {
          for (let x = 0; x < summaries[0].length; x++) {
            context.moveTo((x / summaries[0].length) * context.canvas.width, (summaries[0][x]["low"] * context.canvas.height) + context.canvas.height / 2);
            context.lineTo((x / summaries[0].length) * context.canvas.width, (summaries[0][x]["high"] * context.canvas.height) + context.canvas.height / 2);
          }
        } else if (numberOfChannels == 2 && summaries[0] && summaries[1]) {
          for (let x = 0; x < summaries[0].length; x++) {
            context.moveTo((x / summaries[0].length) * context.canvas.width, (summaries[0][x]["low"] * context.canvas.height / 4) + context.canvas.height / 4);
            context.lineTo((x / summaries[0].length) * context.canvas.width, (summaries[0][x]["high"] * context.canvas.height / 4) + context.canvas.height / 4);
          }
          for (let x = 0; x < summaries[1].length; x++) {
            context.moveTo((x / summaries[1].length) * context.canvas.width, (summaries[1][x]["low"] * context.canvas.height / 4) + context.canvas.height * 3 / 4);
            context.lineTo((x / summaries[1].length) * context.canvas.width, (summaries[1][x]["high"] * context.canvas.height / 4) + context.canvas.height * 3 / 4);
          }
        }
        context.stroke()
      }
    }
  }, [summaries]);

  return <canvas ref={canvasRef} width="2048px" height="250px" style={{width: "100%", height: "250px"}}></canvas>;
}
