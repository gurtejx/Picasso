"use client";

import { scriptAtom, vidsAtom } from "@/state";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { produce } from "immer"
import LoadingSpinner from "./loading_spinner";

export default function VideoFetcher({ prompt, index }) {
  const setVids = useSetAtom(vidsAtom);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("")

  useEffect(() => {
    fetch(`http://localhost:8000/api/stock_vid?topic=${prompt}`)
      .then((res) => res.json())
      .then((data) => {
        // const prev = get
        // const newState = produce(prev, (draft) => {
        //   draft.json.content[index].video = data.url.link
        // })
        // console.log(index, newState.json)
        // setScript(newState)
        setVids((prev) => ({ ...prev, [`${index}`]: data.url.link }))

        setLoading(false);
        setUrl(data.url.link)
      });
  }, []);

  if (loading) return <LoadingSpinner></LoadingSpinner>

  return <div className="flex flex-col gap-2">
    <div className="font-semibold">{prompt}</div>
    <video src={url} controls className="w-full h-full" />
  </div>
}
