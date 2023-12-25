"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import WaveformVisualizer from "./WaveformVisualizer";

var count = 1;

export default function PlaybackEngine(props: {
  playing: boolean;
  file: Blob | null;
  elapsed: number;
  setPlayingCallback: Function;
  setDurationCallback: Function;
  loopPercents: number[];
  setLoopPercentsCallback: Function;
  volume: number;
  playbackRate: number;
  children?: ReactNode;
}) {
  const [url, setUrl] = useState("");
  const [repeat, setRepeat] = useState(true);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const audioElem = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => {
      window.URL.revokeObjectURL(url);
    };
  });

  useEffect(() => {
    props.setDurationCallback(duration);
  }, [duration]);

  useEffect(() => {
    if (props.file && audioElem.current && !Number.isNaN(duration)) {
      if (audioElem.current.currentTime < duration * props.loopPercents[0]) {
        audioElem.current.currentTime = duration * props.loopPercents[0];
      }
      if (audioElem.current.currentTime > duration * props.loopPercents[1]) {
        audioElem.current.currentTime = duration * props.loopPercents[1];
      }
    }
  }, [props.loopPercents]);

  useEffect(() => {
    if (elapsed > duration * props.loopPercents[1] && !Number.isNaN(duration)) {
      if (audioElem.current) {
        if (!repeat) {
          audioElem.current.pause();
          props.setPlayingCallback(false);
        }
        audioElem.current.currentTime = duration * props.loopPercents[0];
      }
    }
  }, [elapsed]);

  useEffect(() => {
    if (props.file && audioElem.current) {
      if (props.playing) {
        audioElem.current.play();
      } else {
        audioElem.current.pause();
      }
    }
  }, [props.playing, url]);

  useEffect(() => {
    if (props.volume) {
      if (audioElem.current) {
        audioElem.current.volume = props.volume;
      }
    }
  }, [props.volume]);

  useEffect(() => {
    if (props.playbackRate) {
      if (audioElem.current) {
        audioElem.current.playbackRate = props.playbackRate;
      }
    }
  }, [props.playbackRate]);

  useEffect(() => {
    if (props.file) {
      setUrl(window.URL.createObjectURL(props.file));
    }
  }, [props.file]);

  const updateTimes = () => {
    if (audioElem.current) {
      setDuration(audioElem.current.duration);
      setElapsed(audioElem.current.currentTime);
    } else {
      console.log("This should be disabled!");
    }
  };
  const myCount = count;
  count += 1;
  const setElapsedConversion = (relativePercent: number, loopPercents: number[]) => {
    console.log(props.loopPercents[0], props.loopPercents[1]);
    console.log(loopPercents[0], loopPercents[1])
    console.log(count);
    console.log(myCount);
    console.log(relativePercent);
  };
  console.log([...props.loopPercents]);
  return (
    <div className="bg-gray-900 text-center py-4">
      <div className={props.file ? "" : "hidden"}>
        <div className="max-w-3xl grid grid-cols-2 text-center mx-auto relative my-2">
          <div className="flow-root grid-cols-2 px-1 border-r leading-none align-middle">
            <span className="text-base text-gray-400 float-right">
              {Math.round(elapsed * 100) / 100}
            </span>
          </div>
          <div className="flow-root grid-cols-2 px-1 border-l leading-none align-middle">
            <span className="text-base text-gray-400 float-left">
              {Math.round(duration * 100) / 100}
            </span>
          </div>
        </div>
        <div className={"bg-gray-900 max-w-4xl mx-auto"}>
          <div className={"bg-gray-900 max-w-md mx-auto"}>
            <RangeSlider
              id="range-slider-waveform"
              min={0}
              max={1}
              step={0.0001}
              value={props.loopPercents}
              onInput={props.setLoopPercentsCallback}
            ></RangeSlider>
            <WaveformVisualizer
              file={props.file}
              elapsed={elapsed / duration}
              loopPercents={props.loopPercents}
              height={32}
            ></WaveformVisualizer>
          </div>
          {props.children}
          <WaveformVisualizer
            file={props.file}
            elapsed={elapsed / duration}
            loopPercents={props.loopPercents}
            height={256}
            zoom={true}
            setElapsedConversion={setElapsedConversion}
          ></WaveformVisualizer>
        </div>
        <audio src={url} ref={audioElem} onTimeUpdate={updateTimes} />
      </div>
    </div>
  );
}
