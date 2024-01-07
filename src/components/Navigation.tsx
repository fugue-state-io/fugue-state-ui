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
export default function Navigation() {
  return (
    <header id="header" className="bg-green-700 text-white font-bold">
      <div className="py-2 mx-auto">
        <a href="/" className="hover:text-green-300">
          <h1 className="text-center">fugue-state.io</h1>
        </a>
      </div>
      <nav className="mx-auto flex max-w-4xl items-center justify-between p-6">
        <div className="space-x-8">
          <NavLink href="/app">App</NavLink>
          <NavLink href="/how">How To Use</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </div>
      </nav>
    </header>
  );
}
