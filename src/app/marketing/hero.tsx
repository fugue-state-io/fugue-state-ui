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
}) {
  return (
    <div className='flow-root grid-cols-1 mx-auto'>
      <span className='inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-pink-400'>{props.svg}</span>
      <h3 className='mt-8 text-lg font-medium tracking-tight text-pink-400'>{props.title}</h3>
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
        <span className='block'>Raison D'etre</span>
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
            <span className='block text-green-600'>A work in progress</span>
          </h1>
          <div className='mt-3 mx-auto grid text-gray-800 text-xl max-w-xs grid-cols-3'>
            <p className='grid-cols-1'>Modular</p>
            <p className='grid-cols-1'>Free</p>
            <p className='grid-cols-1'>Extensible</p>
          </div>
        </div>
      </div>
      <Raison />
      <Features>
        <Feature svg='' title='feature' description='it is a thing'/>
        <Feature svg='' title='feature' description='it is a thing'/>
        <Feature svg='' title='feature' description='it is a thing'/>
      </Features>
      <Modus />
    </>
  )
}