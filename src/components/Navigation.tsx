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
        <div className="mr-28 space-x-8">
          <NavLink href="/app">App</NavLink>
          <NavLink href="/how">How To Use</NavLink>
        </div>
      </nav>
    </header>
  );
}
