"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import "react-range-slider-input/dist/style.css";
import WaveformVisualizer from "./WaveformVisualizer";

export default function PlaybackEngine(props: {
  playing: boolean;
  file: Blob | null;
  setPlayingCallback: Function;
  setDurationCallback: Function;
  setLoopPercentsCallback: Function;
  volume: number;
  playbackRate: number;
  children?: ReactNode;
}) {
  const [loopPercents, setLoopPercents] = useState([0, 1000]);
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
      audioElem.current.currentTime = duration * (loopPercents[0] / 1000);
      props.setLoopPercentsCallback(loopPercents);
    }
  }, [loopPercents]);

  useEffect(() => {
    if (
      elapsed > duration * (loopPercents[1] / 1000) &&
      !Number.isNaN(duration)
    ) {
      if (audioElem.current) {
        if (!repeat) {
          audioElem.current.pause();
          props.setPlayingCallback(false);
        }
        audioElem.current.currentTime = duration * (loopPercents[0] / 1000);
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
          {props.children}
          <WaveformVisualizer file={props.file}></WaveformVisualizer>
        </div>
        <audio src={url} ref={audioElem} onTimeUpdate={updateTimes} />
      </div>
    </div>
  );
}
