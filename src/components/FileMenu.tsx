'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import FileItem from './FileItem';
export default function FileMenu(props: {
  fileTypes: string [],
  fileChangedCallback: Function
}) {
  
  const [files, setFiles] = useState<Blob []>([]);
  const fileChanged = (file: Blob) => {
    if (file) {
      setFiles([ ...files, file]);
      props.fileChangedCallback(file);
    }
  };
  return (
  <div className='bg-gray-900'>
    <div className='mx-auto max-w-md'>
      <FileUploader handleChange={fileChanged} name="file" types={props.fileTypes} />
      <ul className='text-md text-gray-400'>
        {files.map((item: Blob, index: number) =>
          <li key={index}  className="flex justify-between gap-x-6 py-5">
            <FileItem key={index}  name={item.name}></FileItem>
          </li>)}
      </ul>
    </div>
  </div>
  )
}
