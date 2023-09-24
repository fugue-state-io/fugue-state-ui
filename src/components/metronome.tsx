'use client';

import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function Metronome() {
  
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  var synth: Tone.Synth | null = null;

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
    }
  }, []);

  useEffect(() => {
    Tone.start()
    if (playing) {
      Tone.Transport.start();
      synth = new Tone.Synth();

      Tone.Transport.scheduleRepeat((time: number) => {
        const nextStep = Math.round(Tone.Transport.seconds / Tone.Time("8n").toSeconds());
        if (synth) {
          if (nextStep % 8 == 0) {
            synth.triggerAttackRelease("C4", "32n", time);
          } else {
            synth.triggerAttackRelease("C3", "32n", time);
          }
        }
        setStep(nextStep);
      }, "8n");

      synth.toDestination();
    } else {
      Tone.Transport.stop();
    }
    return () => {
      Tone.Transport.stop();
    }
  }, [playing]);
  return (
    <>
      <div className='bg-gray-900 text-center'>
        <h3 className='text-lg font-semibold tracking-wider text-pink-400'>Metronome</h3>
        <div className='items-center rounded-md py-12'>
          <span id="0" className={'relative px-2 mx-1 rounded-md shadow-lg shadow-lg ' + (step % 8 == 0 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="1" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 8 == 1 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="2" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 8 == 2 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="3" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 8 == 3 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="4" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 8 == 4 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="5" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 8 == 5 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="6" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 8 == 6 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="7" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 8 == 7 ? "bg-pink-400" : "bg-pink-700")}></span>
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
