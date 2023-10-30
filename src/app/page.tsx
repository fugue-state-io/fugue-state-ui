"use client";
import Hero from "../components/Hero"
import Metronome from "../components/Metronome"
import PlaybackEngine from "../components/PlaybackEngine"
import { useEffect, useState } from "react";
import FileMenu from "../components/FileMenu";
import PlaybackControls from "fugue-state-ui/components/PlaybackControls";
import WaveformVisualizer from "fugue-state-ui/components/WaveformVisualizer";
import axios from "axios";
import { RangeSlider } from "range-slider-input";
import WaveformMinimap from "fugue-state-ui/components/WaveformMinimap";


export default function Home() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [file, setFile] = useState<Blob | null>(null);
  const fileChanged = (file: React.SetStateAction<Blob | null>) => {
    if (file) {
      setFile(file);
    }
  };
  const onVolumeInput = (percents: Number []) => {
    setVolume(Number(percents[1]));
  };
  const onPlaybackRateInput = (percents: Number []) => { 
    setPlaybackRate(Number(percents[1]));
  };

  return (
    <main className="bg-gray-900">
      <Hero />
      <FileMenu fileTypes={["MP3", "WAV"]} fileChangedCallback={fileChanged}/>
      {/* <Metronome playing={playing} playbackRate={playbackRate} bpm={bpm} phaseOffset={phaseOffset} setBpmCallback={setBpm} subdivisions={subdivisions} setSubdivisionsCallback={setSubdivisions} setPhaseOffsetCallback={setPhaseOffset}/> */}
      <PlaybackEngine playing={playing} setPlayingCallback={setPlaying} volume={volume} playbackRate={playbackRate} file={file}></PlaybackEngine>
      <PlaybackControls playing={playing} setPlayingCallback={setPlaying} volume={volume} playbackRate={playbackRate} onPlaybackRateInput={onPlaybackRateInput} onVolumeInput={onVolumeInput}></PlaybackControls>
    </main>
  )
}
