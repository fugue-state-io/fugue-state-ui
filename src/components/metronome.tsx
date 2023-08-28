'use client';

import Script from 'next/script';
import React, { useState } from 'react';
import * as Tone from 'tone';

const synth = new Tone.Synth().toDestination();

const iterate = (time: number, loopStep: number, startTime: number, lastTime: number, upBeat: string, downBeat: string, duration: string, rhythmicGranularity: string, setStep: ((loopStep: number) => void)) => {
  loopStep = Math.round((time - startTime) / Tone.Time(rhythmicGranularity).toSeconds())
  setStep(loopStep);
  if (loopStep % 4 == 0 ) {
    synth.triggerAttackRelease(downBeat, duration, time);
  } else {
    synth.triggerAttackRelease(upBeat, duration, time);
  }
  console.log('loopStep: %s, dt: %s, totalTime: %s, time: %s', loopStep, time - lastTime, time - startTime, time);
  lastTime = time;
}

export default function Metronome() {
  var lastTime = 0;
  var startTime = 0;
  var loopStep = -1;
  const [step, setStep] = useState(loopStep);
  const [downBeat, setDownbeat] = useState("C4");
  const [upBeat, setUpbeat] = useState("C3");
  const [duration, setDuration] = useState("32n");
  const [rhythmicGranularity,  setRhythmicGranularity] = useState("4n");
  
  const [loop, setLoop] = useState(new Tone.Loop((time) => iterate(time, loopStep, startTime, lastTime, upBeat, downBeat, duration, rhythmicGranularity, setStep), rhythmicGranularity));
  
  const play = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    lastTime = Tone.now();
    startTime = lastTime;
    Tone.start()
    Tone.Transport.start();
    loop.start();
  };
  
  const stop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    loop.stop()
    Tone.Transport.stop();
  };

  React.useEffect(() => {
    return () => {
      loop.stop()
      Tone.Transport.stop();
    };
  }, []);

  return (
    <>
      <div onLoad={() => {
          const buffer = new Tone.ToneAudioBuffer();
        }
      } className='bg-gray-900 text-center'>
        <h3 className='text-lg font-semibold tracking-wider text-pink-400'>Metronome</h3>
        <div className='items-center rounded-md py-12'>
          <span id="0" className={'relative px-2 mx-1 rounded-md shadow-lg shadow-lg ' + (step % 4 == 0 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="1" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 4 == 1 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="2" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 4 == 2 ? "bg-pink-400" : "bg-pink-700")}></span>
          <span id="3" className={'relative px-2 mx-1 rounded-md shadow-lg bg-pink-400 shadow-lg ' + (step % 4 == 3 ? "bg-pink-400" : "bg-pink-700")}></span>
        </div>
        <div className='items-center px-4 py-2 rounded-md'>
          <span onClick={play} className='relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
            <span id="play" className='text-white font-bold'>Play</span>
          </span>
          <span  onClick={stop} className='relative mx-auto inline-flex items-center px-4 py-2 mx-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
            <span id="stop" className='text-white font-bold'>Reset</span>
          </span>
        </div>
      </div>
    </>
  )
}
