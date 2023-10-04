'use client';

import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import { useDebounce } from "@uidotdev/usehooks";
import * as Tone from 'tone';

export default function Metronome() {
  
  const [playing, setPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState(4);
  const debouncedTimeSignature = useDebounce(timeSignature, 300);
  const [bpm, setBpm] = useState(60);
  const debouncedBpm = useDebounce(bpm, 300);
  const [step, setStep] = useState(0);

  let synth: Tone.Synth | null = null;
  let scheduledRepeat: Number | null = null; 

  const scheduleRepeat = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.scheduleRepeat((time: number) => {
      const nextStep = Math.round(Tone.Transport.seconds / Tone.Time(debouncedTimeSignature + "n").toSeconds());
      if (synth) {
        if (nextStep % debouncedTimeSignature == 0) {
          synth.triggerAttackRelease("C4", "32n", time);
        } else {
          synth.triggerAttackRelease("C3", "32n", time);
        }
      }
      setStep(nextStep);
    }, debouncedTimeSignature + "n");
    Tone.Transport.start();
  }

  const getTime = (timeSignature: number) => {
    let content = [];
    for (let i = 0; i < timeSignature; i++) {
      content.push(<span id={i.toString()} key={i.toString()} className={'relative px-2 mx-1 rounded-md shadow-lg shadow-lg ' + (step % timeSignature == i ? "bg-pink-400" : "bg-pink-700")}></span>);
    }
    return content;
  };


  useEffect(() => {
    Tone.start()
    if (playing) {
      synth = new Tone.Synth();
      scheduleRepeat();
      synth.toDestination();
    } else {
      Tone.Transport.stop();
    }
    return () => {
      Tone.Transport.stop();
    }
  }, [playing]);

  useEffect(() => {
    if (debouncedBpm) {
      Tone.Transport.bpm.value = debouncedBpm;
    }
  }, [debouncedBpm]);

  useEffect(() => {
    if (playing) {
      Tone.Transport.stop();
      scheduleRepeat();
    }
  },[debouncedTimeSignature]);
  return (
    <>
      <div className='bg-gray-900 text-center py-4'>
        <h3 className='text-lg font-semibold tracking-wider text-pink-400'>Metronome</h3>
        <div className='items-center rounded-md py-12'>
          {getTime(timeSignature)}
        </div>
        <div className='max-w-md grid grid-cols-2 text-center mx-auto relative my-2'>
          <div className='flow-root grid-cols-1 px-1 leading-none align-middle'>
            <label htmlFor="bpm" className="block text-sm font-medium leading-6 text-gray-400">
              BPM
            </label>
            <input name="bpm" id="bpm" onChange={event => setBpm(parseInt(event?.target.value))} type="number" value={bpm} pattern='\d+' disabled={playing} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-1"/>
          </div>
          <div className='flow-root grid-cols-1 px-1 leading-none align-middle'>
            <label htmlFor="timeSignature" className="block text-sm font-medium leading-6 text-gray-400">
              Subdivisions
            </label>
            <input name="timeSignature" id="timeSignature"  onChange={event => setTimeSignature(parseInt(event?.target.value))} type="number" value={timeSignature} pattern='\d+'  disabled={playing} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-1"/>
          </div>
        </div>
        <div className='items-center px-4 py-2 rounded-md'>
          <span onClick={() => setPlaying(!playing)} className='relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
            <span id="play" className='text-white font-bold'>{!playing ? "Start" : "Stop"}</span>
          </span>
        </div>
      </div>
    </>
  )
}
