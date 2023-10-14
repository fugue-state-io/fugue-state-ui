import {
  useRef,
  useState,
  forwardRef,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  useImperativeHandle,
  useEffect,
} from "react";
import { type dataPoint } from "./types";
import { calculateBarData, draw } from "./utils";

interface Props {
  startPercentage: number;
  stopPercentage: number;
  /**
   * Audio blob to visualize
   */
  blob: Blob | null;
  /**
   * Width of the visualizer
   */
  width: number;
  /**
   * Height of the visualizer
   */
  height: number;
  /**
   * Width of each individual bar in the visualization. Default: `2`
   */
  barWidth?: number;
  /**
   * Gap between each bar in the visualization. Default: `1`
   */
  gap?: number;
  /**
   * BackgroundColor for the visualization: Default: `"transparent"`
   */
  backgroundColor?: string;
  /**
   * Color for the bars that have not yet been played: Default: `"rgb(184, 184, 184)""`
   */
  barColor?: string;
  /**
   * Color for the bars that have been played: Default: `"rgb(160, 198, 255)""`
   */
  barPlayedColor?: string;
  
  unsetColor?: string;
  /**
   * Current time stamp till which the audio blob has been played.
   * Visualized bars that fall before the current time will have `barPlayerColor`, while that ones that fall after will have `barColor`
   */
  currentTime?: number;
  /**
   * Custome styles that can be passed to the visualization canvas
   */
  style?: React.CSSProperties;
  /**
   * A `ForwardedRef` for the `HTMLCanvasElement`
   */
  ref?: React.ForwardedRef<HTMLCanvasElement | null>;

  zoom: boolean;
}

const AudioVisualizer: ForwardRefExoticComponent<
  Props & RefAttributes<HTMLCanvasElement | undefined>
> = forwardRef(
  (
    {
      startPercentage,
      stopPercentage,
      blob,
      width,
      height,
      barWidth = 2,
      gap = 1,
      currentTime,
      style,
      backgroundColor = "transparent",
      barColor = "rgb(184, 184, 184)",
      barPlayedColor = "rgb(160, 198, 255)",
      unsetColor = "rgb(107, 114, 128)",
      zoom = false,
    }: Props,
    ref?: ForwardedRef<HTMLCanvasElement>
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<dataPoint[]>([]);
    const [duration, setDuration] = useState<number>(0);

    useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(
      ref,
      () => canvasRef.current,
      []
    );

    useEffect(() => {
      const processBlob = async (): Promise<void> => {
        if (!canvasRef.current) return;

        if (!blob) {
          const barsData = Array.from({ length: 100 }, () => ({
            max: 0,
            min: 0,
          }));
          draw(
            zoom,
            startPercentage,
            stopPercentage,
            barsData,
            canvasRef.current,
            backgroundColor,
            unsetColor,
            barColor,
            barPlayedColor,
          );
          return;
        }

        const audioBuffer = await blob.arrayBuffer();
        const audioContext = new AudioContext();
        await audioContext.decodeAudioData(audioBuffer, (buffer) => {
          if (!canvasRef.current) return;
          setDuration(buffer.duration);
          const barsData = calculateBarData(
            buffer,
            height,
            width
          );
          setData(barsData);
          draw(
            zoom,
            startPercentage,
            stopPercentage,
            barsData,
            canvasRef.current,
            backgroundColor,
            unsetColor,
            barColor,
            barPlayedColor,
          );
        });
      };

      processBlob();
    }, [blob, canvasRef.current]);
    
    useEffect(() => {
      if (!canvasRef.current) return;

      draw(
        zoom,
        startPercentage,
        stopPercentage,
        data,
        canvasRef.current,
        backgroundColor,
        barColor,
        barPlayedColor,
        unsetColor,
        currentTime,
        duration,
      );
    }, [currentTime, duration, stopPercentage]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          ...style,
        }}
      />
    );
  }
);

AudioVisualizer.displayName = "AudioVisualizer";

export { AudioVisualizer };