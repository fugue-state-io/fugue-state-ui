import { useEffect, useState } from "react";

export default function EqSlider(props: {
  filter: BiquadFilterNode | null;
  frequency: string;
}) {
  const [filterDb, setFilterDb] = useState<number>(0);
  useEffect(() => {
    if (props.filter) {
      props.filter.gain.value = filterDb;
    }
  }, [filterDb]);
  
  return (
    <div className="flow-root grid-cols-1  leading-none align-middle">
      <div className="grid-cols-1 text-center text-base text-gray-400">
        {filterDb}db
      </div>
      <input
        type="range"
        // @ts-expect-error
        orient="vertical"
        min={-25}
        max={25}
        step={1}
        defaultValue={0}
        onInput={(e) => {
          if (props.filter)
            setFilterDb(Number((e.target as HTMLInputElement).value));
        }}
      ></input>
      <div className="my-auto flow-root grid-cols-1 leading-none align-middle text-base text-gray-400 ">
        {props.frequency}
      </div>
    </div>
  );
}
