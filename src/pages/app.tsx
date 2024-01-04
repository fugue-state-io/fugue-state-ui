import PlaybackEngine from "fugue-state-ui/components/PlaybackEngine";
import Navigation from "fugue-state-ui/components/Navigation";
import GitHubForkRibbon from "react-github-fork-ribbon";
import "./globals.css";
export default function App() {
  return (
    <main className="">
      <Navigation />
      <GitHubForkRibbon
          href="https://github.com/fugue-state-io/fugue-state-ui"
          position="right"
          color="black"
        >Fork me on Github!</GitHubForkRibbon>
      <PlaybackEngine />
    </main>
  );
}
