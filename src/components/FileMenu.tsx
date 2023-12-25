"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";

export default function FileMenu(props: {
  fileTypes: string[];
  fileChangedCallback: Function;
}) {
  const [file, setFile] = useState<Blob>();
  const fileChanged = (file: Blob) => {
    if (file) {
      setFile(file);
      props.fileChangedCallback(file);
    }
  };
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-md">
        <FileUploader
          handleChange={fileChanged}
          name="file"
          types={props.fileTypes}
        />
        {file ? <div>{file.name}</div> : <div></div>}
      </div>
    </div>
  );
}
