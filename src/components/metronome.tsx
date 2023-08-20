'use client'

import Script from 'next/script';
import React, { useState } from 'react';
import * as Tone from 'tone';

export default function Metronome() {

  const [deltaTime, setDeltaTime] = useState(Tone.now());
  const [lastTime, setLastTime] = useState(0);
  const [synth, setSynth] = useState(new Tone.Synth().toDestination());

  const [loop, setLoop] = useState(new Tone.Loop((time) => {
    synth.triggerAttackRelease("C4", "16n", time + 0.1);
    setDeltaTime(time);
    setLastTime(time);
    console.log('deltaTime: %s, lastTime: %s, Tone.now(): %s', deltaTime,  lastTime, Tone.now())
  }, "4n"));
  
  const reset = () => {
    setLoop(new Tone.Loop((time) => {
      synth.triggerAttackRelease("C4", "16n", time + 0.1);
      setDeltaTime(time - lastTime);
      setLastTime(time);
      console.log('time: %s,deltaTime: %s, lastTime: %s, Tone.now(): %s', time, deltaTime,  lastTime, Tone.now())
    }, "4n"))
  }
  
  const play = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Tone.start()
    Tone.Transport.start(Tone.now());
    loop.start();
  };
  
  const stop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Tone.Transport.stop(Tone.now());
    loop.stop();
    reset();
  };
  return (
    <>
      <div onLoad={() => {
          const buffer = new Tone.ToneAudioBuffer();
        }
      } className='bg-gray-900 text-center'>
        <h3 className='text-lg font-semibold tracking-wider text-pink-400'>Metronome</h3>
        <div className='items-center rounded-md py-12'>
          <input id="0" type="radio" value="false" className='bg-pink-400'></input>
          <input id="1" type="radio" value="false" className='shadow-lg bg-pink-400'></input>
          <input id="2" type="radio" value="false" className='bg-pink-400'></input>
          <input id="3" type="radio" value="false" className='shadow-lg bg-pink-400'></input>
        </div>
        <div className='items-center px-4 py-2 rounded-md'>
          <div className='relative mx-auto inline-flex items-center px-4 py-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
            <span onClick={play} id="play" className='text-white font-bold'>Play</span>
          </div>
          <div className='relative mx-auto inline-flex items-center px-4 py-2 rounded-md shadow-lg bg-pink-400 hover:bg-pink-700 shadow-lg'>
            <span onClick={stop} id="stop" className='text-white font-bold'>Stop</span>
          </div>
        </div>
      </div>
    </>
  )
}
