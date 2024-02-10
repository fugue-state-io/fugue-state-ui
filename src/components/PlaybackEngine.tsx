"use client";
import React, { useState, useEffect, useRef } from "react";
import FFTVisualizer from "./FFTVisualizer";
import WaveformVisualizer from "./WaveformVisualizer";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import LoadingSpinner from "./LoadingSpinner";
import Minimap from "./Minimap";
import GraphicEqualizer from "./GraphicEqualizer";

export default function PlaybackEngine(props: { url: string }) {
  const videoElem = useRef<HTMLVideoElement>(null);
  const [repeat, setRepeat] = useState(true);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [loopPercents, setLoopPercents] = useState<number[]>([0, 1]);

  const [lowFilter, setLowFilter] = useState<BiquadFilterNode | null>(null);
  const [midLowFilter, setMidLowFilter] = useState<BiquadFilterNode | null>(
    null
  );
  const [midFilter, setMidFilter] = useState<BiquadFilterNode | null>(null);
  const [midHighFilter, setMidHighFilter] = useState<BiquadFilterNode | null>(
    null
  );
  const [highFilter, setHighFilter] = useState<BiquadFilterNode | null>(null);
  const [higherFilter, setHigherFilter] = useState<BiquadFilterNode | null>(
    null
  );
  const [highererFilter, setHighererFilter] = useState<BiquadFilterNode | null>(
    null
  );
  const [highestFilter, setHighestFilter] = useState<BiquadFilterNode | null>(
    null
  );
  const [higherestFilter, setHigherestFilter] =
    useState<BiquadFilterNode | null>(null);

  const [audioSource, setAudioSource] = useState<AudioNode | null>(null);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  useEffect(() => {
    if (audioBuffer) {
      setDuration(audioBuffer.duration);
    }
  }, [audioBuffer]);
  useEffect(() => {
    const tempAudioContext = new AudioContext();
    fetch(props.url)
      .then((response) => response.arrayBuffer())
      .then(async (buffer) => {
        if (buffer) {
          setAudioBuffer(await tempAudioContext.decodeAudioData(buffer));
        }
      });
    setAudioContext(tempAudioContext);
  }, [props.url]);

  useEffect(() => {
    if (audioContext && videoElem.current) {
      console.log("setting audio source");
      let tempAudioSource = audioContext.createMediaElementSource(
        videoElem.current
      );
      let tempAnalyser = audioContext.createAnalyser();
      let tempLowFilter = new BiquadFilterNode(audioContext, {
        type: "lowshelf",
        frequency: 100,
      });
      let tempMidLowFilter = new BiquadFilterNode(audioContext, {
        type: "peaking",
        frequency: 200,
        Q: 3,
      });
      let tempMidFilter = new BiquadFilterNode(audioContext, {
        type: "peaking",
        frequency: 400,
        Q: 3,
      });
      let tempMidHighFilter = new BiquadFilterNode(audioContext, {
        type: "peaking",
        frequency: 800,
        Q: 3,
      });
      let tempHighFilter = new BiquadFilterNode(audioContext, {
        type: "peaking",
        frequency: 1600,

        Q: 3,
      });
      let tempHigherFilter = new BiquadFilterNode(audioContext, {
        type: "peaking",
        frequency: 3200,

        Q: 3,
      });
      let tempHighererFilter = new BiquadFilterNode(audioContext, {
        type: "peaking",
        frequency: 4800,
        Q: 3,
      });
      let tempHighestFilter = new BiquadFilterNode(audioContext, {
        type: "peaking",
        frequency: 6400,
        Q: 3,
      });
      let tempHigherestFilter = new BiquadFilterNode(audioContext, {
        type: "highshelf",
        frequency: 12800,
      });
      tempAnalyser.smoothingTimeConstant = 0;
      tempAudioSource.connect(tempLowFilter);
      tempLowFilter.connect(tempMidLowFilter);
      tempMidLowFilter.connect(tempMidFilter);
      tempMidFilter.connect(tempMidHighFilter);
      tempMidHighFilter.connect(tempHighFilter);
      tempHighFilter.connect(tempHigherFilter);
      tempHigherFilter.connect(tempHighererFilter);
      tempHighererFilter.connect(tempHighestFilter);
      tempHighestFilter.connect(tempHigherestFilter);
      tempHigherestFilter.connect(tempAnalyser);
      tempHigherestFilter.connect(audioContext.destination);
      setLowFilter(tempLowFilter);
      setMidLowFilter(tempMidLowFilter);
      setMidFilter(tempMidFilter);
      setMidHighFilter(tempMidHighFilter);
      setHighFilter(tempHighFilter);
      setHigherFilter(tempHigherFilter);
      setHighererFilter(tempHighererFilter);
      setHighestFilter(tempHighestFilter);
      setHigherestFilter(tempHigherestFilter);
      setAudioSource(tempAudioSource);
      setAnalyser(tempAnalyser);
    }
  }, [audioContext]);

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
    if (videoElem.current && !Number.isNaN(duration)) {
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
  }, [volume]);

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
  if (audioContext) {
    return (
      <div className="bg-gray-900">
        <div className="" style={{ paddingTop: 128 }}>
          <div className="mx-auto max-w-md"></div>
          <Minimap
            audioBuffer={audioBuffer}
            elapsed={elapsed}
            duration={duration}
            loopPercents={loopPercents}
            audioContext={audioContext}
            setLoopPercents={setLoopPercents}
          />
          <video
            className="mx-auto w-full sm:w-3/4 lg:w-1/2"
            src={props.url}
            ref={videoElem}
            preload="auto"
            crossOrigin="anonymous"
            playsInline={true}
            loop={repeat}
          ></video>
          <WaveformVisualizer
            audioContext={audioContext}
            audioBuffer={audioBuffer}
            elapsed={elapsed / duration}
            setElapsedCallback={setElapsedCallback}
            height={256}
            loopPercents={loopPercents}
            duration={duration}
            setDuration={setDuration}
            zoom={true}
          ></WaveformVisualizer>
          <FFTVisualizer analyser={analyser} elapsed={elapsed} height={128} />
          <div className="">
            <div className="">
              {lowFilter &&
              midLowFilter &&
              midFilter &&
              midHighFilter &&
              highFilter &&
              higherFilter &&
              highererFilter &&
              highestFilter &&
              higherestFilter ? (
                <GraphicEqualizer
                  lowFilter={lowFilter}
                  midLowFilter={midLowFilter}
                  midFilter={midFilter}
                  midHighFilter={midHighFilter}
                  highFilter={highFilter}
                  higherFilter={higherFilter}
                  highererFilter={highererFilter}
                  highestFilter={highestFilter}
                  higherestFilter={higherestFilter}
                ></GraphicEqualizer>
              ) : (
                <div></div>
              )}
            </div>
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
      </div>
    );
  } else {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }
}
