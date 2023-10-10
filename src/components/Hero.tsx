import React from "react"

function Modus() {
  return (
    <div id='modus' className='text-center py-24 relative mx-auto px-4 sm:px-6 bg-gray-900'>
      <h1 className='text-lg font-semibold tracking-wider text-green-400'>
        <span className='block'>Modus Operandi</span>
      </h1>
      <p className='text-gray-400 tracking-tight'>Free, Open Source, Community Driven.</p>
    </div>
  )
}

function Feature(props: {
  title: React.ReactNode
  description: React.ReactNode
  svg: React.ReactNode
  textColorClass: string
  svgColorClass: string
}) {
  return (
    <div className='flow-root grid-cols-1 mx-auto p-2'>
      <span className={`inline-flex items-center justify-center p-3 rounded-md shadow-lg ${props.svgColorClass}`}>{props.svg}</span>
      <h3 className={`mt-8 text-lg font-medium tracking-tight ${props.textColorClass}`}>{props.title}</h3>
      <p className='mt-5 text-base text-gray-400'>{props.description}</p>
    </div>
  )
}

function Features({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div id='features' className='bg-gray-900'>
      <div className='text-center py-24 relative mx-auto px-4 sm:px-6 bg-gray-900'>
        <h1 className='text-lg font-semibold tracking-wider text-pink-400'>
          <span className='block'>Features</span>
        </h1>
      </div>
      <div className='max-w-3xl grid grid-cols-3 text-center mx-auto relative '>
        {children}
      </div>
    </div>
  )
}

function Raison() {
  return (
    <div id='raison' className='text-center py-24 relative mx-auto px-4 sm:px-6 bg-gray-900'>
      <h1 className='text-lg font-semibold tracking-wider text-green-400'>
        <span className='block'>Raison D&apos;etre</span>
      </h1>
      <p className='text-gray-400 tracking-tight'>Make learning music intuitive and easy</p>
    </div>
  )
}

export default function Hero() {
  return (
    <>
      <div className='py-24 mx-auto max-w-l px-4 sm:px-6 font-bold'>
        <div className='text-center'>
          <h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
            <span className='block'>fugue-state.io</span>
            <span className='block text-green-600'>A Music Learning Engine</span>
          </h1>
          <div className='mt-3 mx-auto grid text-gray-800 text-xl'>
            a work in progress
          </div>
        </div>
      </div>
      <Raison />
      <Features>
        <Feature svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} textColorClass="text-green-400" svgColorClass="bg-green-400" title='Metronome' description='Practice alone or for use in tempo mapping a song. Metric modulation.'/>
        <Feature svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z" /></svg>} textColorClass="text-pink-400" svgColorClass="bg-pink-400" title='Playback Engine' description='Speed up or Slow Down, Select a timespan and loop.'/>
        <Feature svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>} textColorClass="text-green-400" svgColorClass="bg-green-400" title='Practice Log' description="Automatically Record what you've practiced, how long, and when."/>
        <Feature svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>} textColorClass="text-pink-400" svgColorClass="bg-pink-400" title='Pitch Drone' description='A simple tool to drone a single pitch to aid in transcription.'/>
        <Feature svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" /></svg>} textColorClass="text-green-400" svgColorClass="bg-green-400" title='Audio Manipulation' description='Pitch Transposition, Karaoke Mode, and Equalization for audio files.'/>
        <Feature svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>} textColorClass="text-pink-400" svgColorClass="bg-pink-400" title='Note Taking' description="Take Notes and review them later!"/>
      </Features>
      <Modus />
    </>
  )
}