import "../globals.css";
export default function How() {
  return (
    <main className="dark">
      <div className="h-screen flex justify-center items-center">
        <iframe
          width="1024"
          height="720"
          src="https://www.youtube.com/embed/adYPZUH1kSc?si=wZcjKTCER-aTeSfj"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </main>
  );
}