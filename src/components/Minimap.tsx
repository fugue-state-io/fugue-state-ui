import WaveformVisualizer from "./WaveformVisualizer";
import RangeSlider from "react-range-slider-input";

export default function Minimap(props: {
  elapsed: number;
  duration: number;
  loopPercents: number[];
  setLoopPercents: Function;
  audioContext: AudioContext | null;
  file: Blob | null;
}) {
  return (
    <>
      <div className="grid grid-cols-2 text-center mx-auto relative my-2">
        <div className="flow-root grid-cols-2 px-1 border-r leading-none align-middle">
          <span className="text-base text-gray-400 float-right">
            {Math.round(props.elapsed * 100) / 100}
          </span>
        </div>
        <div className="flow-root grid-cols-2 px-1 border-r leading-none align-middle">
          <span className="text-base text-gray-400 float-left">
            {Math.round(props.duration * 100) / 100}
          </span>
        </div>
      </div>
      <div className={"w-3/4 sm:w-3/4 lg:w-1/2 mx-auto"}>
        <RangeSlider
          id="range-slider-waveform"
          min={0}
          max={1}
          step={0.0001}
          value={props.loopPercents}
          onInput={props.setLoopPercents}
        ></RangeSlider>
        <WaveformVisualizer
          file={props.file}
          audioContext={props.audioContext}
          duration={props.duration}
          elapsed={props.elapsed / props.duration}
          loopPercents={props.loopPercents}
          height={64}
        ></WaveformVisualizer>
      </div>
    </>
  );
}
