'use client';

import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function Metronome() {
  
  const [playing, setPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState(4);
  const [bpm, setBpm] = useState(60);
  const [step, setStep] = useState(0);
  var synth: Tone.Synth | null = null;

  const getTime = (timeSignature: number) => {
    let content = [];
    for (let i = 0; i < timeSignature; i++) {
      content.push(<span id={i.toString()} className={'relative px-2 mx-1 rounded-md shadow-lg shadow-lg ' + (step % timeSignature == i ? "bg-pink-400" : "bg-pink-700")}></span>);
    }
    return content;
  };

  useEffect(() => {
    Tone.Transport.bpm.value = bpm
  }, [bpm]);

  useEffect(() => {
    Tone.start()
    if (playing) {
      Tone.Transport.start();
      synth = new Tone.Synth();

      Tone.Transport.scheduleRepeat((time: number) => {
        const nextStep = Math.round(Tone.Transport.seconds / Tone.Time(timeSignature + "n").toSeconds());
        if (synth) {
          if (nextStep % timeSignature == 0) {
            synth.triggerAttackRelease("C4", "32n", time);
          } else {
            synth.triggerAttackRelease("C3", "32n", time);
          }
        }
        setStep(nextStep);
      }, timeSignature + "n");

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
      <div className='bg-gray-900 text-center py-4'>
        <h3 className='text-lg font-semibold tracking-wider text-pink-400'>Metronome</h3>
        <div className='items-center rounded-md py-12'>
          {getTime(timeSignature)}
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
