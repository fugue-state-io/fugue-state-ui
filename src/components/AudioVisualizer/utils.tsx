import { type dataPoint } from "./types";

interface CustomCanvasRenderingContext2D extends CanvasRenderingContext2D {
  roundRect: (
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) => void;
}

export const calculateBarData = (
  buffer: AudioBuffer,
  height: number,
  width: number,
  barWidth: number,
  gap: number
): dataPoint[] => {
  const bufferData = buffer.getChannelData(0);
  const units = width / (barWidth + gap);
  const step = Math.floor(bufferData.length / units);
  const amp = height / 2;

  let data: dataPoint[] = [];
  let maxDataPoint = 0;

  for (let i = 0; i < units; i++) {
    const mins: number[] = [];
    let minCount = 0;
    const maxs: number[] = [];
    let maxCount = 0;

    for (let j = 0; j < step && i * step + j < buffer.length; j++) {
      const datum = bufferData[i * step + j];
      if (datum <= 0) {
        mins.push(datum);
        minCount++;
      }
      if (datum > 0) {
        maxs.push(datum);
        maxCount++;
      }
    }
    const minAvg = mins.reduce((a, c) => a + c, 0) / minCount;
    const maxAvg = maxs.reduce((a, c) => a + c, 0) / maxCount;

    const dataPoint = { max: maxAvg, min: minAvg };

    if (dataPoint.max > maxDataPoint) maxDataPoint = dataPoint.max;
    if (Math.abs(dataPoint.min) > maxDataPoint)
      maxDataPoint = Math.abs(dataPoint.min);

    data.push(dataPoint);
  }

  if (amp * 0.8 > maxDataPoint * amp) {
    const adjustmentFactor = (amp * 0.8) / maxDataPoint;
    data = data.map((dp) => ({
      max: dp.max * adjustmentFactor,
      min: dp.min * adjustmentFactor,
    }));
  }

  return data;
};

export const draw = (
  zoom: boolean = false,
  startPercentage: number,
  stopPercentage: number,
  data: dataPoint[],
  canvas: HTMLCanvasElement,
  backgroundColor: string,
  barColor: string,
  barPlayedColor?: string,
  unsetColor?: string,
  currentTime: number = 0,
  duration: number = 1,
): void => {
  const amp = canvas.height / 2;

  const ctx = canvas.getContext("2d") as CustomCanvasRenderingContext2D;
  if (!ctx) return;
  if (zoom) {
    ctx.setTransform(1 / (stopPercentage - startPercentage), 0, 0, 1, -data.length * (startPercentage) / (stopPercentage - startPercentage), 0);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const playedPercent = (currentTime || 0) / duration;

  data.forEach((dp, i) => {
    const mappingPercent = i / data.length;
    const played = playedPercent > mappingPercent;
    if (mappingPercent < startPercentage) {
      ctx.fillStyle = unsetColor ? unsetColor : barColor;
    } else if (mappingPercent >= startPercentage && mappingPercent < stopPercentage) {
      ctx.fillStyle = played && barPlayedColor ? barPlayedColor : barColor;
    } else if (mappingPercent > stopPercentage) {
      ctx.fillStyle = unsetColor ? unsetColor : barColor;
    }

    const x = i;
    const y = amp + dp.min;
    const w = 3;
    const h = amp + dp.max - y;

    ctx.beginPath();
    if (ctx.roundRect) {
      // making sure roundRect is supported by the browser
      ctx.roundRect(x, y, w, h, 50);
      ctx.fill();
    } else {
      // fallback for browsers that do not support roundRect
      ctx.fillRect(x, y, w, h);
    }
  });
};