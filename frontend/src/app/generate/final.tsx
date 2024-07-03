"use client";

import { scriptAtom, ttsAtom, vidsAtom } from "@/state";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loading_spinner";

export default function FinalPage() {
  const script = useAtomValue(scriptAtom)
  const tts = useAtomValue(ttsAtom)
  const vids = useAtomValue(vidsAtom)

  const [loading, setLoading] = useState(true)
  const [vid, setVid] = useState("")

  useEffect(() => {
    async function fetchVideo() {
      for (const [index, line] of script.json.content.entries()) {
        line.video = vids[`${index}`]
      }

      const formData = new FormData()

      for (let [index, value] of tts.entries()) {
        const ttsFile = new File([value.data], `tts${index}.mp3`)
        formData.append("tts", ttsFile)
      }

      formData.append("script", JSON.stringify(script.json))

      fetch("http://localhost:8001/generate_video", {
        method: "POST",
        body: formData
      }).then((res) => res.blob()).then((data) => {
        setLoading(false)

        const objectURL = URL.createObjectURL(data);
        setVid(objectURL)
      })
    }

    fetchVideo()
  }, [])

  if (loading) return <LoadingSpinner></LoadingSpinner>

  return <main className="min-h-full flex flex-col items-center justify-center">
    <div className="max-w-[1000px] flex flex-col flex-wrap gap-5 items-center h-[90svh] mb-4">
      <video controls src={vid} className="h-full m-10 rounded-md"> </video>
    </div>
  </main>

}