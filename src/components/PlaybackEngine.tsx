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
  const [clientSide, setClientSide] = useState(false);

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
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const fileChanged = (file: Blob) => {
    if (file) {
      setLoading(true);
      setFile(file);
      setDuration(file.size);
      if (clientSide) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          setUrl(String(reader.result));
          console.log(reader.result);
          setAudioContext(new AudioContext());
          setLoading(false);
        };
      } else {
        console.log(
          "axios post to ",
          process.env.NEXT_PUBLIC_FUGUE_STATE_API_URL
        );
        axios
          .post(
            process.env.NEXT_PUBLIC_FUGUE_STATE_API_URL + "/process_file",
            file,
            {
              headers: { "content-type": file.type },
            }
          )
          .then((response: any) => {
            setUrl(response.data.url);
            setAudioContext(new AudioContext());
            setLoading(false);
          });
      }
    }
  };
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
      //tempAudioSource.connect(audioContext.destination);
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
  return (
    <div className="bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mx-auto max-w-md" style={{ paddingTop: 128 }}>
          <div className="flow-root grid grid-cols-2 px-1 leading-none ">
            <label
              htmlFor="checkbox"
              className="block text-sm font-medium leading-6 text-right text-gray-400 grid-cols-1 m-1.5"
            >
              Client Side Rendering
            </label>
            <label className="relative inline-flex items-center cursor-pointer my-2  grid-cols-1">
              <input
                type="checkbox"
                checked={clientSide}
                className="sr-only peer"
                onChange={() => setClientSide(!clientSide)}
                disabled={playing || loading}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <FileUploader
            handleChange={fileChanged}
            name="file"
            types={["mp4", "mp3"]}
          />
        </div>
        {loading ? (
          <div className="text-center" style={{ padding: 128 }}>
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : url ? (
          <div>
            <div>
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
              <div className={"bg-gray-900 max-w-sm mx-auto"}>
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
              <div className="max-w-3xl grid grid-cols-1 text-center mx-auto relative">
                <div className="flow-root grid-cols-1 px-1 leading-none align-middle lg:grid-cols-2">
                  <div className="flow-root px-1 leading-none align-middle grid-cols-2">
                    <FFTVisualizer
                      analyser={analyser}
                      elapsed={elapsed}
                      height={128}
                    />
                  </div>
                  {lowFilter && midLowFilter && midFilter && midHighFilter && highFilter && higherFilter && highererFilter && highestFilter && higherestFilter ? (
                    <div className="flow-root grid grid-cols-10">
                      <div className="grid-cols-1 my-auto text-base text-gray-400"></div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {lowFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {midLowFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {midFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {midHighFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {highFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {higherFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {highererFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {highestFilter.gain.value}db
                      </div>
                      <div className="grid-cols-1 my-auto text-base text-gray-400">
                        {higherestFilter.gain.value}db
                      </div>
                      <div className="flow-root grid grid-cols-1 px-1 leading-none align-middle">
                        <label className="grid-cols-1 my-auto text-base text-gray-400">
                          +25db
                        </label>
                        <label className="grid-cols-1 my-auto text-base text-gray-400">
                          0db
                        </label>
                        <label className="grid-cols-1 my-auto text-base text-gray-400">
                          -25db
                        </label>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (lowFilter)
                              lowFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (midLowFilter)
                              midLowFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (midFilter)
                              midFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (midHighFilter)
                              midHighFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (highFilter)
                              highFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (higherFilter)
                              higherFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (highererFilter)
                              highererFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (highestFilter)
                              highestFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <input
                          type="range"
                          className="vranger"
                          min={-25}
                          max={25}
                          step={1}
                          defaultValue={0}
                          onInput={(e) => {
                            if (higherestFilter)
                              higherestFilter.gain.value = Number(
                                (e.target as HTMLInputElement).value
                              );
                          }}
                        ></input>
                      </div>
                      <div className="flow-root grid-cols-1 px-1 leading-none align-middle">
                        <p className="my-auto text-base text-gray-400">Hz</p>
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        100
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        200
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        400
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        800
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        1600
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        3200
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        4800
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        6400
                      </div>
                      <div className="my-auto flow-root grid-cols-1 px-1 leading-none align-middle text-base text-gray-400 ">
                        12800
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
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
        ) : (
          <div className="text-center text-gray-200 " style={{ padding: 128 }}>
            <div>load a file with the menu above</div>
          </div>
        )}
      </div>
    </div>
  );
}
