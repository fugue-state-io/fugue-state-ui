"use client";
import Hero from "../components/Hero";
import "react-range-slider-input/dist/style.css";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <div className="h-screen flex justify-center items-center mx-auto max-w-3xl">
        <iframe
          className=""
          width="720"
          height="480"
          src="https://www.youtube.com/embed/adYPZUH1kSc?si=wZcjKTCER-aTeSfj"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <Footer />
    </main>
  );
}
