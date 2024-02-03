"use client";
import LoadingSpinner from "fugue-state-ui/components/LoadingSpinner";
import PlaybackEngine from "fugue-state-ui/components/PlaybackEngine";
import useSWR from "swr";

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)
  return res.json()
}
export default function Project(props: any) {
  const uuid = props.params.uuid;
  const { data, error, isLoading } = useSWR<any>("/api/project/" + uuid, fetcher);
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  } else if (error) {
    return <div>An Error Occured {JSON.stringify(error)}</div>;
  } else {
    return <PlaybackEngine url={data.media} ></PlaybackEngine>
  }
}
