"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const pathname = usePathname();
  const session = useSession();
  console.log(session);
  const navigation = [
    { name: "Projects", href: "/projects", current: pathname == "/projects" },
  ];
  return (
    <Disclosure as="header" className="bg-green-600 shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 px-4 divide-y divide-gray-200">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-0">
                <div className="flex flex-shrink-0 items-center text-white">
                  <a href="/">
                    <b>fugue-state.io</b>
                  </a>
                </div>
              </div>
              <div className="relative z-10 ml-4 flex items-center">
                {session.data?.user ? (
                  <>
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div className="text-white">
                        Welcome,{" "}
                        <a className="text-white underline" href="/profile">
                          {session.data?.user.email}
                        </a>
                      </div>
                    </Menu>
                  </>
                ) : (
                  <div className="relative z-10 flex items-center text-white">
                    <button onClick={() => signIn("keycloak")}>Sign in</button>
                  </div>
                )}
              </div>
            </div>
            {session.data?.user && (
              <nav
                className="flex space-x-8 py-2 justify-between"
                aria-label="Global"
              >
                <div>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-green-400 text-white"
                          : "text-white hover:bg-green-400",
                        "inline-flex items-center rounded-md py-2 px-3 text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div>
                  <button
                    onClick={() => signOut()}
                    className="text-white hover:bg-green-400 inline-flex items-center rounded-md py-2 px-3 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </nav>
            )}
          </div>
        </>
      )}
    </Disclosure>
  );
}
