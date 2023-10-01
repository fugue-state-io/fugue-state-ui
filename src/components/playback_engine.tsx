'use client';
import React, { useState, useEffect, useRef} from 'react';
import { FileUploader } from "react-drag-drop-files";
import { AudioVisualizer } from './AudioVisualizer'
const fileTypes = ["MP3", "WAV", "FLAC"];

export default function PlaybackEngine() {
  const [file, setFile] = useState<Blob | null>(null);
  const [url, setUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const audioElem = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => {
      window.URL.revokeObjectURL(url);
    }
  })

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
    }
  }, [file])
  const handleChange = (file: React.SetStateAction<Blob | null>) => {
    setFile(file);
  };

  const onPlaying = () => {
    if(audioElem.current) {
      setDuration(audioElem.current.duration);
      setElapsed(audioElem.current.currentTime)
    } else {
      console.log("This should be disabled!")
    }
  }
  return (
    <div className='bg-gray-900 text-center py-4'>
      <h3 className='text-lg font-semibold tracking-wider text-green-400'>Playback Engine</h3>
      <div className='mx-auto max-w-md'>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
      </div>
      <div className='max-w-3xl grid grid-cols-2 text-center mx-auto relative my-2'>
        <div className='flow-root grid-cols-2 px-1 border-r leading-none align-middle'>
          <span className='text-base text-gray-400 float-right'>{Math.round(elapsed * 100) / 100}</span>
        </div>
        <div className='flow-root grid-cols-2 px-1 border-l leading-none align-middle'>
          <span className='text-base text-gray-400 float-left'>{Math.round(duration * 100) / 100}</span>
        </div>
      </div>
      <div className="bg-gray-900 max-w-3xl mx-auto">
      <AudioVisualizer
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
      <div className='items-center px-4 py-2 rounded-md'>
        <span onClick={() => setPlaying(!playing)} className='relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
          <span id="play" className='text-white font-bold'>{!playing ? "Play" : "Pause"}</span>
        </span>
      </div>
    </div>
  )
}
