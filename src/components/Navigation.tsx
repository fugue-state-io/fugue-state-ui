function NavLink(props: {
  children: React.ReactNode;
  href: string | undefined;
}) {
  return (
    <a href={props.href} className="hover:text-green-300 py-2">
      {props.children}
    </a>
  );
}

function Home() {
  return (
    <div className="flex lg:flex-1">
      <a href="#" className="flex items-center hover:text-green-300">
        <h2>fugue-state.io</h2>
      </a>
    </div>
  );
}

export default function Navigation() {
  return (
    <header id="header" className="bg-green-700 text-white font-bold">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <Home />
        <div className="hidden ml-10 space-x-8 lg:block">
          <NavLink href="#raison">Raison D&apos;etre</NavLink>
          <NavLink href="#modus">Modus Operandi</NavLink>
          <NavLink href="#features">Features</NavLink>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          <NavLink href="#raison">Raison D&apos;etre</NavLink>
          <NavLink href="#modus">Modus Operandi</NavLink>
          <NavLink href="#features">Features</NavLink>
        </div>
      </nav>
    </header>
  );
}
