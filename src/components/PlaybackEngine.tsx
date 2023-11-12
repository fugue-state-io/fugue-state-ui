'use client';
import React, { useState, useEffect, useRef, ReactNode, createContext} from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import axios from 'axios';
import Waveform from './Waveform';
import WaveformSelection from './WaveformSelection';


export default function PlaybackEngine(props: {
  playing: boolean,
  file: Blob | null,
  setPlayingCallback: Function,
  volume: number,
  playbackRate: number,
  mpm: number,
  children?: ReactNode
}) {
  const [loopPercents, setLoopPercents] = useState([0,2048]);
  const [image, setImage] = useState<string | null>(null);
  const [url, setUrl] = useState("");
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
    if (audioElem.current) {
      if(elapsed > duration * (loopPercents[1] / 2048) && !Number.isNaN(duration)) {
        if (!repeat) {
          audioElem.current.pause();
          props.setPlayingCallback(false);
        }
        audioElem.current.currentTime = duration * (loopPercents[0] / 2048);
      }
    }
  }, [elapsed]);
  useEffect(() => {
    if ((loopPercents[0]/ 2048) * duration > elapsed) {
      if (audioElem.current) {
        audioElem.current.currentTime = (loopPercents[0] / 2048) * duration;
      }
      setElapsed( duration * (loopPercents[0] / 2048))
    }
  }, [loopPercents])
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
    if(props.volume) {
      if(audioElem.current) {
        audioElem.current.volume = props.volume;
      }
    }
  }, [props.volume]);

  useEffect(() => {
    if(props.playbackRate) {
      if(audioElem.current) {
        audioElem.current.playbackRate = props.playbackRate;
      }
    }
  }, [props.playbackRate]);

  useEffect(() => {
    if(props.file) {
      setUrl(window.URL.createObjectURL(props.file));
      var formData = new FormData();
      formData.append("file", props.file);
      axios.post("http://localhost:5000/api/process_audio", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        setImage(response.data);
      }).catch((error) => {
        console.log(error.message);
      })
    }
  }, [props.file]);
  const updateTimes = () => {
    if(audioElem.current) {
      setDuration(audioElem.current.duration);
      setElapsed(audioElem.current.currentTime)
    } else {
      console.log("This should be disabled!")
    }
  }
  return (
    <div className='bg-gray-900 text-center py-4'>
      <WaveformSelection bytes={image} height={64} width={256} style={{width: '100%', height: '100%'}}></WaveformSelection>
      <div className={props.file ? "" : "hidden"}>
        <div className='max-w-3xl grid grid-cols-2 text-center mx-auto relative my-2'>
          <div className='flow-root grid-cols-2 px-1 border-r leading-none align-middle'>
            <span className='text-base text-gray-400 float-right'>{Math.round(elapsed * 100) / 100}</span>
          </div>
          <div className='flow-root grid-cols-2 px-1 border-l leading-none align-middle'>
            <span className='text-base text-gray-400 float-left'>{Math.round(duration * 100) / 100}</span>
          </div>
        </div>
        <div className="bg-gray-900 max-w-3xl mx-auto">
          <Waveform bytes={image} height={256} width={512} style={{width: '100%', height: '100%'}} channels={2}></Waveform>
        </div>
        <audio src={url} ref={audioElem} onTimeUpdate={updateTimes}/>
      </div>
    </div>
  )
}
