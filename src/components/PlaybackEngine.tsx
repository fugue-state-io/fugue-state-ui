'use client';
import React, { useState, useEffect, useRef} from 'react';
import { FileUploader } from "react-drag-drop-files";
import { AudioVisualizer } from './AudioVisualizer';
const fileTypes = ["MP3", "WAV", "FLAC"];
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

export default function PlaybackEngine() {
  const [file, setFile] = useState<Blob | null>(null);
  const [files, setFiles] = useState<Blob []>([]);
  const [loopPercents, setLoopPercents] = useState([0,1000]);
  const [url, setUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(true);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const audioElem = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => {
      window.URL.revokeObjectURL(url);
    }
  })

  useEffect(() => {
    if(file && audioElem.current) {
      audioElem.current.currentTime = duration * (loopPercents[0] / 1000);
    }
  }, [loopPercents]);
  useEffect(() => {
    if(elapsed > duration * (loopPercents[1] / 1000)) {
      if (audioElem.current) {
        if (!repeat) {
          audioElem.current.pause();
          setPlaying(false);
        }
        audioElem.current.currentTime = duration * (loopPercents[0] / 1000);
      }
    }
  }, [elapsed]);
  useEffect(() => {
    if (file && audioElem.current) {
      if (playing) {
        audioElem.current.play();
      } else {
        audioElem.current.pause();
      }
    }

  }, [playing, url]);

  useEffect(() => {
    if(file) {
      setUrl(window.URL.createObjectURL(file));
      setFiles([...files, file]);
    }
  }, [file]);

  const handleChange = (file: React.SetStateAction<Blob | null>) => {
    if (file) {
      setFile(file);
    }
  };

  const onPlaying = () => {
    if(audioElem.current) {
      setDuration(audioElem.current.duration);
      setElapsed(audioElem.current.currentTime)
    } else {
      console.log("This should be disabled!")
    }
  }
  const setVolume = (percents: Number []) => {
    if(audioElem.current) {
      audioElem.current.volume = Number(percents[1]);
    }
  }
  const setPlaybackRate = (percents: Number []) => {
    if(audioElem.current) {
      audioElem.current.playbackRate= Number(percents[1]);
    }
  }
  return (
    <div className='bg-gray-900 text-center py-4'>
      <h3 className='text-lg font-semibold tracking-wider text-green-400'>Playback Engine</h3>
      <div className='mx-auto max-w-md'>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        <ul className='text-md text-gray-400'>
          {files.map((item: Blob, index: number) => <li key={index}>{item.name}</li>)}
        </ul>
      </div>
      <div className={file ? "" : "hidden"}>
        <div className='max-w-3xl grid grid-cols-2 text-center mx-auto relative my-2'>
          <div className='flow-root grid-cols-2 px-1 border-r leading-none align-middle'>
            <span className='text-base text-gray-400 float-right'>{Math.round(elapsed * 100) / 100}</span>
          </div>
          <div className='flow-root grid-cols-2 px-1 border-l leading-none align-middle'>
            <span className='text-base text-gray-400 float-left'>{Math.round(duration * 100) / 100}</span>
          </div>
        </div>
        <div className={"bg-gray-900 max-w-lg mx-auto"}>
          <RangeSlider id="range-slider-waveform" min={0} max={999} step={1} value={loopPercents} onInput={setLoopPercents} disabled={playing}>
          </RangeSlider>
          <AudioVisualizer
            zoom={false}
            startPercentage={loopPercents[0] / 1000}
            stopPercentage={loopPercents[1] / 1000}
            style={{"width": "100%"}}
            blob={file}
            width={1200}
            height={75}
            barWidth={1}
            currentTime={elapsed}
            gap={0}
            barColor={'#16A34A'}
            barPlayedColor={'#f472b6'}/>
        </div>
        <div className="bg-gray-900 max-w-3xl mx-auto">
        <AudioVisualizer
            zoom={true}
            startPercentage={loopPercents[0] / 1000}
            stopPercentage={loopPercents[1] / 1000}
            style={{"width": "100%"}}
            blob={file}
            width={1200}
            height={300}
            barWidth={1}
            currentTime={elapsed}
            gap={0}
            barColor={'#16A34A'}
            barPlayedColor={'#f472b6'}/>
        </div>
        <audio src={url} ref={audioElem} onTimeUpdate={onPlaying}/>
        <div className='max-w-md grid grid-cols-2 text-center mx-auto relative my-2'>
          <div className='flow-root grid-cols-1 px-1 leading-none align-middle'>
            <label htmlFor="volume" className="block text-sm font-medium leading-6 text-gray-400">
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
              onInput={setVolume}/>
          </div>
          <div className='flow-root grid-cols-1 px-1 leading-none align-middle'>
            <label htmlFor="playbackRate" className="block text-sm font-medium leading-6 text-gray-400">
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
              onInput={setPlaybackRate}/>
          </div>
        </div>

        <div className='items-center px-4 py-2 rounded-md'>
          <span onClick={() => setPlaying(!playing)} className='relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
            <span id="play" className='text-white font-bold'>{!playing ? "Play" : "Pause"}</span>
          </span>
        </div>
      </div>
      
    </div>
  )
}
