'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileUploader } from 'react-drag-drop-files';

export default function MetronomeVisualizer(props: {
  fileTypes: string [],
  fileChangedCallback: Function,
}) {
  
  const [files, setFiles] = useState<Blob []>([]);
  const fileChanged = (file: React.SetStateAction<Blob | null>) => {
    if (file) {
      setFiles([file, ...files]);
      props.fileChangedCallback(file);
    }
  };
  return (
  <div className='mx-auto max-w-md'>
    <FileUploader handleChange={props.fileChangedCallback} name="file" types={props.fileTypes} />
    <ul className='text-md text-gray-400'>
      {files.map((item: Blob, index: number) => <li key={index}>{item.name}</li>)}
    </ul>
  </div>
  )
}
