"use client";

import { useAtomValue } from "jotai";
import Script from "./script";
import TTS from "./tts";
import { pageAtom } from "@/state";
import VidsPage from "./vids";
import FinalPage from "./final";

export default function Generate() {
  const page = useAtomValue(pageAtom)

  switch (page) {
    case "script": {
      return <Script></Script>
    }
    case "tts": {
      return <TTS></TTS>
    }
    case "vids": {
      return <VidsPage></VidsPage>
    }
    case "final": {
      return <FinalPage></FinalPage>
    }
    default: {
      return <h1>...</h1>
    }
  }
}
