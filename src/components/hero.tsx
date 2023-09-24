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
    <div className='flow-root grid-cols-1 mx-auto'>
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
      <div id='modus' className='text-center py-24 relative mx-auto px-4 sm:px-6 bg-gray-900'>
        <h1 className='text-lg font-semibold tracking-wider text-green-400'>
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
      <h1 className='text-lg font-semibold tracking-wider text-pink-400'>
        <span className='block'>Raison D&apos;etre</span>
      </h1>
      <p className='text-gray-400 tracking-tight'>Make learning music intuitive</p>
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
        <Feature svg='' textColorClass="text-pink-400" svgColorClass="bg-pink-400" title='Metronome' description='Simple Meters, Compound Meters, Complex Meters and Swing Ratios. All made easy.'/>
        <Feature svg='' textColorClass="text-green-400" svgColorClass="bg-green-400" title='Playback Engine' description='Pitch Transposition, Metric Modulation, Karaoke Mode, and Equalization for audio files.'/>
        <Feature svg='' textColorClass="text-pink-400" svgColorClass="bg-pink-400" title='Data Driven Practice' description="Stop spinning your wheels. Practice how proven to work. Compare with others."/>
      </Features>
      <Modus />
    </>
  )
}