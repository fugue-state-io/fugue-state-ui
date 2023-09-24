'use client';
import React, { useState, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { AudioVisualizer } from './AudioVisualizer';
const fileTypes = ["MP3", "WAV", "FLAC"];

export default function PlaybackEngine() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(0);

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

  const handleChange = (file: React.SetStateAction<null>) => {
    setFile(file);
    console.log(file)
  };
  return (
    <div className='bg-gray-900 text-center py-4'>
      <h3 className='text-lg font-semibold tracking-wider text-green-400'>Playback Engine</h3>
      <div className='mx-auto max-w-md'><FileUploader handleChange={handleChange} name="file" types={fileTypes} /></div>
      <AudioVisualizer
          id="canvas"
          blob={file}
          width={width}
          height={300}
          barWidth={1}
          gap={0}
          barColor={'#16A34A'}
        />
    </div>
  )
}
