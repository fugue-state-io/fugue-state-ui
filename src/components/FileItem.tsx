"use client";
export default function FileItem(props: { name: String }) {
  return (
    <div className="flex min-w-0 gap-x-4">
      <div>{props.name}</div>
    </div>
  );
}
