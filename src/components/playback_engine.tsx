'use client';
import React, { useState, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { AudioVisualizer } from './AudioVisualizer'
import { useDebounce } from "@uidotdev/usehooks";
import * as Tone from 'tone';
const fileTypes = ["MP3", "WAV", "FLAC"];

export default function PlaybackEngine() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(1280);
  const [playing, setPlaying] = useState(false);
  const [playable, setPlayable] = useState(false);
  const [height, setHeight] = useState(0);
  const debouncedWidth = useDebounce(width, 50);
  const [player, setPlayer] = useState<Tone.Player>(new Tone.Player());

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setWidth(rect.width);
      setHeight(rect.height);
    });
    observer.observe(document.documentElement);
    return () => {
      observer.unobserve(document.documentElement);
    };
  }, []);

  useEffect(() => {
    if (file) {
      if (playing) {
        player.start();
      } else {
        player.stop();
      }
    }

  }, [playing]);

  const handleChange = (file: React.SetStateAction<null>) => {
    setFile(file);
    console.log(file)
  };
  return (
    <div className='bg-gray-900 text-center py-4'>
      <h3 className='text-lg font-semibold tracking-wider text-green-400'>Playback Engine</h3>
      <div className='mx-auto max-w-md'>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
      </div>
      <AudioVisualizer
          id="canvas"
          blob={file}
          player={player}
          width={debouncedWidth}
          height={300}
          barWidth={3}
          gap={1}
          barColor={'#16A34A'}/>
      <div className='items-center px-4 py-2 rounded-md'>
        <span onClick={() => setPlaying(!playing)} className='relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
          <span id="play" className='text-white font-bold'>{!playing ? "Play" : "Pause"}</span>
        </span>
      </div>
    </div>
  )
}
