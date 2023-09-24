'use client';
import React, { useState, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["MP3", "WAV", "FLAC"];

export default function PlaybackEngine() {
  const [file, setFile] = useState(null);
  const handleChange = (file: React.SetStateAction<null>) => {
    setFile(file);
  };
  return (
    <div className='bg-gray-900 text-center'>
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
      <h3 className='text-lg font-semibold tracking-wider text-green-400'>Playback Engine</h3>
    </div>
  )
}
