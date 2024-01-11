import { useState } from "react";
import EqSlider from "./EqSlider";

export default function GraphicEqualizer(props: {
  lowFilter: BiquadFilterNode | null;
  midLowFilter: BiquadFilterNode | null;
  midFilter: BiquadFilterNode | null;
  midHighFilter: BiquadFilterNode | null;
  highFilter: BiquadFilterNode | null;
  higherFilter: BiquadFilterNode | null;
  highererFilter: BiquadFilterNode | null;
  highestFilter: BiquadFilterNode | null;
  higherestFilter: BiquadFilterNode | null;
}) {
  return (
    <div className="flow-root grid grid-cols-9 max-w-sm mx-auto">
      <EqSlider filter={props.lowFilter} frequency="100"></EqSlider>
      <EqSlider filter={props.midLowFilter} frequency="200"></EqSlider>
      <EqSlider filter={props.midFilter} frequency="400"></EqSlider>
      <EqSlider filter={props.midHighFilter} frequency="800"></EqSlider>
      <EqSlider filter={props.highFilter} frequency="1600"></EqSlider>
      <EqSlider filter={props.higherFilter} frequency="3200"></EqSlider>
      <EqSlider filter={props.highererFilter} frequency="4800"></EqSlider>
      <EqSlider filter={props.highestFilter} frequency="6400"></EqSlider>
      <EqSlider filter={props.higherestFilter} frequency="12800"></EqSlider>
    </div>
  );
}
