import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function EditField(props: {
  endpoint: string;
  value: string;
  key: string;
  className: string;
}) {
  const [edit, setEdit] = useState<boolean>(false);
  const input = useRef<HTMLInputElement | null>(null);


  const post = () => {
    if (input.current) {
      let body = { name: input.current.value };
      axios.post(props.endpoint, body).then((response: any) => {
        setEdit(false);
      });
    }
  };
  const reset = () => {
    if (input.current) {
      input.current.value = input.current.defaultValue;
      setEdit(false);
    }
  };
  return (
    <div className="">
      <input
        type="text"
        ref={input}
        name={props.key}
        id={props.key}
        defaultValue={props.value}
        disabled={!edit}
        size={input.current?.value.length}
        className={"appearance-none bg-transparent border-none text-black focus:outline-none inline-flex " + props.className}
      />
      {!edit ? (
        <span onClick={() => setEdit(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="black"
            className="w-6 h-6 inline-flex"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </span>
      ) : (
        <>
          <span onClick={() => post()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="green"
              className="w-6 h-6 inline-flex"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </span>
          <span onClick={() => reset()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="red"
              className="w-6 h-6 inline-flex"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </span>
        </>
      )}
    </div>
  );
}
