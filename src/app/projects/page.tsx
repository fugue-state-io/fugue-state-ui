"use client";
import useSWR from "swr";
import axios from "axios";
import { FileUploader } from "react-drag-drop-files";

import "./local.css";
import LoadingSpinner from "fugue-state-ui/components/LoadingSpinner";
async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}
export default function Projects() {
  const { data, error, isLoading } = useSWR<any, any>("/api/project", fetcher);
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
        .then((response: any) => {
          console.log(response);
        });
    }
  };
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  } else if (error) {
    return <div>An Error Occured {error}</div>;
  } else {
    return (
      <div className="max-w-7xl mx-auto mt-3 px-3 text-white">
        <div className="mx-auto max-w-md my-6">Create a new Project</div>
        <div className="mx-auto max-w-md my-12">
          <FileUploader
            handleChange={fileChanged}
            name="file"
            types={["mp4", "mp3"]}
          />
        </div>
        <div className={"mx-auto max-w-md my-6 "}>
          Select an Existing Project
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((value: any, index: any, array: any) => {
            return (
              <div
                key={index}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
              >
                <div className="flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <a
                    href={"/projects/" + value.media.split("/")[1]}
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {value.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {"/projects/" + value.media.split("/")[1]}
                    </p>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
