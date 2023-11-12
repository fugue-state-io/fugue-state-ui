"use client";
import React, { useState, useEffect, useRef } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function PlaybackControls(props: {
  volume: number;
  onVolumeInput: Function;
  playbackRate: number;
  onPlaybackRateInput: Function;
  playing: boolean;
  setPlayingCallback: Function;
}) {
  return (
    <div className="bg-gray-900">
      <div className="max-w-md grid grid-cols-2 text-center mx-auto relative">
        <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
          <label
            htmlFor="volume"
            className="block text-sm font-medium leading-6 text-gray-400"
          >
            Volume
          </label>
          <RangeSlider
            id="volume"
            className="single-thumb"
            defaultValue={[0, 1]}
            min={0}
            max={1}
            step={0.01}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            onInput={props.onVolumeInput}
          />
          
          <label
            htmlFor="playbackRate"
            className="block text-sm font-medium leading-6 text-gray-400"
          >
            {props.volume * 100}%
          </label>
        </div>
        <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
          <label
            htmlFor="playbackRate"
            className="block text-sm font-medium leading-6 text-gray-400"
          >
            Playback Speed
          </label>
          <RangeSlider
            id="playbackRate"
            className="single-thumb"
            defaultValue={[0, 1]}
            min={0.2}
            max={2}
            step={0.01}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            onInput={props.onPlaybackRateInput}
          />
          <label
            htmlFor="playbackRate"
            className="block text-sm font-medium leading-6 text-gray-400"
          >
            {props.playbackRate.toString()}x
          </label>
        </div>
        <div className="items-center px-4 py-2 rounded-md">
          <span
            onClick={() => props.setPlayingCallback(!props.playing)}
            className="relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg"
          >
            <span id="play" className="text-white font-bold">
              {!props.playing ? "Play" : "Pause"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
