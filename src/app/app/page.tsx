import PlaybackEngine from "fugue-state-ui/components/PlaybackEngine";
import Navigation from "fugue-state-ui/components/Navigation";
import GitHubForkRibbon from "react-github-fork-ribbon";
import "../globals.css";
import "./local.css";
export default function App() {
  return (
    <main className="dark">
      <PlaybackEngine />
    </main>
  );
}
