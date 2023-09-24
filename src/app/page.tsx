import Navigation from "../components/navigation"
import Hero from "../components/hero"
import Metronome from "../components/metronome"
import PlaybackEngine from "../components/playback_engine"

export default function Home() {
  return (
    <main className="">
      <Navigation />
      <Hero />
      <Metronome />
      <PlaybackEngine />
    </main>
  )
}
