"use client";

import { pageAtom } from "@/state";
import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname()
  const page = useAtomValue(pageAtom)

  let path = "home"

  if (pathname == "/generate") {
    path = `generate / ${page}`
  }

  console.log(pathname)

  return (
    <div className="py-6 px-6">
      <h1 className="font-bold text-2xl">{path}</h1>
    </div>
  );
}
