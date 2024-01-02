"use client";
import React, { useState, useEffect, useRef } from "react";
import "react-range-slider-input/dist/style.css";
import FFTVisualizer from "./FFTVisualizer";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import WaveformVisualizer from "./WaveformVisualizer";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function PlaybackEngine() {
  const videoElem = useRef<HTMLVideoElement>(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const [repeat, setRepeat] = useState(true);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [loopPercents, setLoopPercents] = useState<number[]>([0, 1]);

  const [audioSource, setAudioSource] = useState<AudioNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const fileChanged = (file: Blob) => {
    if (file) {
      setLoading(true);
      setFile(file);
      setDuration(file.size);
      axios
        .post(process.env.NEXT_PUBLIC_FUGUE_STATE_URL + "/process_file", file, {
          headers: { "content-type": file.type },
        })
        .then((response: any) => {
          setUrl(response.data.url);
          setAudioContext(new AudioContext());
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    if (audioContext && videoElem.current) {
      console.log("setting audio source");
      let tempAudioSource = audioContext.createMediaElementSource(
        videoElem.current
      );
      tempAudioSource.connect(audioContext.destination);
      let tempAnalyser = audioContext.createAnalyser();
      tempAnalyser.smoothingTimeConstant = 0;
      tempAudioSource.connect(tempAnalyser);
      setAudioSource(tempAudioSource);
      setAnalyser(tempAnalyser);
    }
  }, [videoElem, audioContext]);
  useEffect(() => {
    if (playbackRate) {
      if (videoElem.current) {
        videoElem.current.playbackRate = playbackRate;
      }
    }
  }, [playbackRate]);

  useEffect(() => {
    console.log("playing updated ", playing);
    if (playing) {
      if (videoElem.current) {
        console.log("starting video");
        videoElem.current.play();
        console.log(elapsed);
      }
    } else if (!playing) {
      if (videoElem.current) {
        console.log("stopping video");
        videoElem.current.pause();
      }
    }
  }, [playing]);
  useEffect(() => {
    console.log("playing updated ", playing);
    if (file && videoElem.current && !Number.isNaN(duration)) {
      if (videoElem.current.currentTime < duration * loopPercents[0]) {
        videoElem.current.currentTime = duration * loopPercents[0];
        videoElem.current.currentTime = duration * loopPercents[0];
      }
      if (videoElem.current.currentTime > duration * loopPercents[1]) {
        videoElem.current.currentTime = duration * loopPercents[1];
      }
    }
  }, [loopPercents, duration]);
  useEffect(() => {
    if (elapsed >= duration * loopPercents[1] && !Number.isNaN(duration)) {
      if (videoElem.current) {
        if (!repeat) {
          videoElem.current.pause();
        }
        videoElem.current.currentTime = duration * loopPercents[0];
      }
    }
  }, [elapsed]);
  useEffect(() => {
    if (videoElem.current) {
      videoElem.current.volume = volume;
    }
  }, [volume])
  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      if (videoElem.current) {
        setElapsed(videoElem.current.currentTime);
      }
    }, 100);
    //Clearing the interval
    return () => clearInterval(interval);
  }, []);
  const setElapsedCallback = (time: number) => {
    setElapsed(time);
    if (videoElem.current) {
      videoElem.current.currentTime = time;
    }
  };
  const reset = () => {
    setPlaying(false);
    if (videoElem.current) {
      videoElem.current.currentTime = loopPercents[0] * duration;
    }
  };
  const onVolumeInput = (percents: Number[]) => {
    setVolume(Number(percents[1]));
  };
  const onPlaybackRateInput = (percents: Number[]) => {
    setPlaybackRate(Number(percents[1]));
  };
  return (
    <div className="bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <FileUploader
          handleChange={fileChanged}
          name="file"
          types={["mp4", "mp3"]}
        />
        {loading ? (
          "loading"
        ) : url ? (
          <div>
            <div>
              <div>
                {elapsed}|{duration}
              </div>
              <div className={"bg-gray-900 max-w-md mx-auto"}>
                <RangeSlider
                  id="range-slider-waveform"
                  min={0}
                  max={1}
                  step={0.0001}
                  value={loopPercents}
                  onInput={setLoopPercents}
                ></RangeSlider>
                <WaveformVisualizer
                  file={file}
                  audioContext={audioContext}
                  duration={duration}
                  elapsed={elapsed / duration}
                  loopPercents={loopPercents}
                  height={32}
                ></WaveformVisualizer>
              </div>
              <video
                src={url}
                ref={videoElem}
                preload="auto"
                crossOrigin="anonymous"
                loop={repeat}
                hidden={file?.type == "video/mp4" ? false : true}
              ></video>
              <WaveformVisualizer
                file={file}
                audioContext={audioContext}
                elapsed={elapsed / duration}
                setElapsedCallback={setElapsedCallback}
                height={256}
                loopPercents={loopPercents}
                duration={duration}
                setDuration={setDuration}
                zoom={true}
              ></WaveformVisualizer>
              <FFTVisualizer
                analyser={analyser}
                elapsed={elapsed}
                height={128}
              />
            </div>
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
        ) : (
          <div>load a file with the menu above</div>
        )}
      </div>
    </div>
  );
}
