"use client";
import Hero from "../components/Hero";
import PlaybackEngine from "../components/PlaybackEngine";
import "react-range-slider-input/dist/style.css";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <PlaybackEngine />
    </main>
  );
}
