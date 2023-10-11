'use client';

import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function Metronome(props: {
  playing: boolean,
  bpm: number,
  subdivisions: number,
  setBpmCallback: Function,
  setSubdivisionsCallback: Function,
  playbackRate: Number
}) {
  const [upBeat, setUpBeat] = useState(false);
  const [step, setStep] = useState(0);

  let synth: Tone.Synth | null = null;

  const scheduleRepeat = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    const loop = new Tone.Loop((time: number) => {
      console.log(time)
      const nextStep = Math.round((time) / Tone.Time(props.subdivisions * 4 + "n").toSeconds());
      if (synth) {
        if (nextStep % props.subdivisions == 0 && upBeat) {
          synth.triggerAttackRelease("C4", "32n", time);
        } else {
          synth.triggerAttackRelease("C3", "32n", time);
        }
      }
      setStep(nextStep);
    }, props.subdivisions * 4 + "n").start();
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
    Tone.start();
    if (props.playing) {
      synth = new Tone.Synth();
      scheduleRepeat();
      synth.toDestination();
    } else {
      Tone.Transport.stop();
    }
    return () => {
      Tone.Transport.stop();
    }
  }, [props.playing]);
  useEffect(() => {
    if (props.bpm) {
      Tone.Transport.bpm.value = props.bpm;
    }
  }, [props.bpm]);

  useEffect(() => {
    if (props.playing) {
      Tone.Transport.stop();
      Tone.Transport.timeSignature = props.subdivisions;
      scheduleRepeat();
    }
  },[props.subdivisions]);
  return (
    <>
      <div className='bg-gray-900 text-center py-4'>
        <div className='items-center rounded-md py-12'>
          {getTime(props.subdivisions)}
        </div>
        <div className='max-w-md grid grid-cols-3 text-center mx-auto relative my-2'>
          <div className='flow-root grid-cols-1 px-1 leading-none align-middle'>
            <label htmlFor="bpm" className="block text-sm font-medium leading-6 text-gray-400">
              BPM
            </label>
            <input name="bpm" id="bpm" onChange={event => props.setBpmCallback(parseInt(event?.target.value))} type="number" value={props.bpm} pattern='\d+' disabled={props.playing} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-1"/>
          </div>
          <div className='flow-root grid-cols-1 px-1 leading-none align-middle'>
            <label htmlFor="timeSignature" className="block text-sm font-medium leading-6 text-gray-400">
              Subdivisions
            </label>
            <input name="timeSignature" id="timeSignature"  onChange={event => props.setSubdivisionsCallback(parseInt(event?.target.value))} type="number" value={props.subdivisions} pattern='\d+'  disabled={props.playing} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-1"/>
          </div>
          <div className='flow-root grid-cols-1 px-1 leading-none align-middle'>
            <label htmlFor="checkbox" className="block text-sm font-medium leading-6 text-gray-400">
              Up Beat
            </label>
            <label className="relative inline-flex items-center cursor-pointer my-2">
              <input type="checkbox" checked={upBeat} className="sr-only peer" onChange={() => setUpBeat(!upBeat)} disabled={props.playing}/>
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
