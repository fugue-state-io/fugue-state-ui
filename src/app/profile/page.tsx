"use client";
import { useSession } from "next-auth/react";
import "../globals.css";
export default function Profile() {
  const session = useSession();
  return <main className="dark">{String(session.data)}</main>;
}
