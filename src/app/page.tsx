"use client";
import Hero from "../components/Hero";
import PlaybackEngine from "../components/PlaybackEngine";
import { ReactElement, createRef, useEffect, useRef, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import FileMenu from "../components/FileMenu";
import WaveSurfer from "wavesurfer.js";

export default function Home() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [loopPercents, setLoopPercents] = useState<number[]>([0,1]);
  const [duration, setDuration] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const [file, setFile] = useState<Blob | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const fileChanged = async (file: React.SetStateAction<Blob | null>) => {
    if (file) {
      setFile(file);
    }
  };
  const reset = () => {
    setPlaying(false);
  };
  const onVolumeInput = (percents: Number[]) => {
    setVolume(Number(percents[1]));
  };
  const onPlaybackRateInput = (percents: Number[]) => {
    setPlaybackRate(Number(percents[1]));
  };
  return (
    <main className="">
      <Hero />
      <FileMenu
        fileTypes={["MP3", "WAV", "FLAC"]}
        fileChangedCallback={fileChanged}
      />
      <PlaybackEngine
        playing={playing}
        setPlayingCallback={setPlaying}
        volume={volume}
        playbackRate={playbackRate}
        file={file}
        elapsed={elapsed}
        setDurationCallback={setDuration}
        loopPercents={loopPercents}
        setLoopPercentsCallback={setLoopPercents}
      ></PlaybackEngine>
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
              onInput={onVolumeInput}
            />
            <label
              htmlFor="playbackRate"
              className="block text-sm font-medium leading-6 text-gray-400"
            >
              {volume * 100}%
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
              onInput={onPlaybackRateInput}
            />
            <label
              htmlFor="playbackRate"
              className="block text-sm font-medium leading-6 text-gray-400"
            >
              {playbackRate.toString()}x
            </label>
          </div>
          <div className="items-center px-4 py-2 rounded-md">
            <span
              onClick={() => setPlaying(!playing)}
              className="relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg"
            >
              <span id="play" className="text-white font-bold">
                {!playing ? "Play" : "Pause"}
              </span>
            </span>
          </div>
          <div className="items-center px-4 py-2 rounded-md">
            <span
              onClick={() => reset()}
              className="relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg"
            >
              <span id="play" className="text-white font-bold">
                {"Reset"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
