import "../globals.css";
export default function Changelog() {
  return (
    <main className="dark">
      <div className="overflow-hidden rounded-md bg-white shadow max-w-4xl mx-auto">
        <ul role="list" className="divide-y divide-gray-200 mx-8">
          <li>
            <h1 className="text-lg">Release : 0.2.0</h1>
            <ul className="list-disc mx-8">
              <li>Updated UI to be full screen.</li>
              <li>Added Mobile Support for Iphone playback.</li>
              <li>Adjusted UI Scaling</li>
              <li>Implemented Blog</li>
              <li>Implemented Changelog</li>
            </ul>
          </li>
          <li>
          <h1 className="text-lg">Release : 0.1.0</h1>
            <ul className="list-disc mx-8">
              <li>Initial Release</li>
            </ul>
          </li>
        </ul>
      </div>
    </main>
  );
}
