"use client";
import useSWR from "swr";
import axios from "axios";
import { FileUploader } from "react-drag-drop-files";
import { PlusIcon } from "@heroicons/react/20/solid";
import "./local.css";
import LoadingSpinner from "fugue-state-ui/components/LoadingSpinner";
import EditField from "fugue-state-ui/components/EditField";
import { useRef, useState } from "react";
import Modal from "fugue-state-ui/components/Modal";
async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}
export default function Projects() {
  const { data, error, isLoading } = useSWR<any, any>(
    "/api/project_meta/",
    fetcher
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [tempFile, setTempFile] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputError, setInputError] = useState<String | null>(null);
  const fileChanged = (file: Blob) => {
    if (file) {
      setTempFile(file);
    }
  };
  const submit = () => {
    if (tempFile) {
      if (inputRef.current) {
        let proj_uuid = null;
        axios
          .post(
            "/api/project_meta",
            { name: inputRef.current.value },
            { headers: { "content-type": "application/json" } }
          )
          .then((response: any) => {
            proj_uuid = response.data.media.split("/")[1];
            console.log(proj_uuid);
            axios
              .post("/api/project/" + proj_uuid, tempFile, {
                headers: { "content-type": tempFile.type },
              })
              .then((response: any) => {
                console.log(response);
                setInputError(null);
              })
              .catch((error: any) => {
                setInputError("Failed to upload Media!");
              });
          })
          .catch((error: any) => {
            setInputError("Failed to create Project!");
          });
      }
    } else {
      console.log("No file");
    }
  };
  const cancel = () => {
    if (tempFile) {
      setTempFile(null);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setModalOpen(false);
  };
  if (isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (error) {
    return <div>An Error Occured {error}</div>;
  } else {
    return (
      <div className="max-w-7xl mx-auto mt-3 px-3 text-white">
        <div className="text-center pt-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setModalOpen(true);
              }}
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Project
            </button>
          </div>
        </div>
        <div className={"mx-auto max-w-md my-6 "}>
          Select an Existing Project
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((value: any, index: any, array: any) => {
            return (
              <div
                key={index}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm  focus-within:ring-offset-2 hover:border-gray-400"
              >
                <div className="min-w-0 flex text-black">
                  <div className="focus:outline-none">
                    {value.media ? (
                      <>
                        {value.name}
                        <br></br>
                        <a
                          href={"/projects/" + value.media.split("/")[1]}
                          className="text-sm text-black"
                        >
                          {"/projects/" + value.media.split("/")[1]}
                        </a>
                      </>
                    ) : (
                      "No"
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="text-center my-4 text-gray-800">
            <h3>Create a Project</h3>
            <div className="relative my-4">
              <label
                htmlFor="name"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
              >
                Project Name
              </label>
              <input
                ref={inputRef}
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Untitled"
              />
            </div>
            <div className="mx-auto max-w-md my-12">
              <FileUploader
                handleChange={fileChanged}
                name="file"
                types={["mp4", "mp3"]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <button
                  onClick={() => {
                    submit();
                  }}
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Submit
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    cancel();
                  }}
                  className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
