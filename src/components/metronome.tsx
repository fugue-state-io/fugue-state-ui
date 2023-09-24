'use client';

import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function Metronome() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  var lastTime = 0;
  useEffect(() => {
    Tone.Transport.scheduleRepeat(function(time: number){
      console.log(Tone.Transport.seconds);
      setStep(Math.round(Tone.Transport.seconds / Tone.Time("8n").toSeconds()));
    }, "8n");
    
    return () => {
      Tone.Transport.stop();
    }
  }, []);

  useEffect(() => {
    Tone.start();
    if (playing) {
      Tone.Transport.start();
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
          <span id="0" className={'relative px-2 mx-1 rounded-md shadow-lg shadow-lg ' + (step % 4 == 0 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="1" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 4 == 1 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="2" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 4 == 2 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="3" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 4 == 3 ? "bg-pink-400" : "bg-pink-700")}></span>
        </div>
        <div className='items-center px-4 py-2 rounded-md'>
          <span onClick={() => setPlaying(!playing)} className='relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
            <span id="play" className='text-white font-bold'>{!playing ? "Play" : "Pause"}</span>
          </span>
        </div>
      </div>
    </>
  )
}
