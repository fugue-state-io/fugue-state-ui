"use client";
import EditField from "fugue-state-ui/components/EditField";
import LoadingSpinner from "fugue-state-ui/components/LoadingSpinner";
import PlaybackEngine from "fugue-state-ui/components/PlaybackEngine";
import useSWR from "swr";

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}
export default function Project(props: any) {
  const uuid = props.params.uuid;
  const project = useSWR<any>("/api/project/" + uuid, fetcher);
  const meta = useSWR<any>("/api/project_meta/" + uuid, fetcher);
  if (project.isLoading || meta.isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (project.error) {
    return <div>An Error Occured {JSON.stringify(project.error)}</div>;
  } else {
    return (
      <>
        <PlaybackEngine url={project.data.media}></PlaybackEngine>
      </>
    );
  }
}
