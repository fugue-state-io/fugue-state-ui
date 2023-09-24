'use client';
import React, { useState, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["MP3", "WAV", "FLAC"];

export default function PlaybackEngine() {
  const [file, setFile] = useState(null);
  const handleChange = (file: React.SetStateAction<null>) => {
    setFile(file);
    console.log(file)
  };
  return (
    <div className='bg-gray-900 text-center'>
      <h3 className='text-lg font-semibold tracking-wider text-green-400'>Playback Engine</h3>
      <div className='mx-auto max-w-md'><FileUploader handleChange={handleChange} name="file" types={fileTypes} /></div>
    </div>
  )
}
