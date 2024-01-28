"use client";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

import useSWR from "swr";
import axios from "axios";
import { useRef } from "react";
import { FileUploader } from "react-drag-drop-files";

import "./local.css";

export default function Projects() {
  const fileChanged = (file: Blob) => {
    if (file) {
      console.log(
        "axios post to ",
        process.env.NEXT_PUBLIC_FUGUE_STATE_API_URL
      );
      axios
        .post("/api/project", file, {
          headers: { "content-type": file.type },
        })
        .then((response: any) => {});
    }
  };
  const { data, error, isLoading } = useSWR("/api/project", fetcher);
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>An Error Occured {error}</div>;
  } else {
    return (
      <div className="max-w-7xl mx-auto mt-3 px-3">
        <FileUploader
          className={"mx-auto"}
          handleChange={fileChanged}
          name="file"
          types={["mp4", "mp3"]}
        />
        [data]
      </div>
    );
  }
}
