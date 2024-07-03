"use client";

import { Button } from "@/components/ui/button";
import { pageAtom, scriptAtom, ttsAtom } from "@/state";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loading_spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TTS() {
  const script = useAtomValue(scriptAtom);
  const [loading, setLoading] = useState(true);
  const [tts, setTts] = useAtom(ttsAtom);
  const [audio_url, set_audio_url] = useState("");
  const set_page = useSetAtom(pageAtom);

  useEffect(() => {
    async function fetchAudio() {
      for (let line of script.json.content) {
        const ret = await fetch(`http://localhost:8000/api/speak`, {
          method: "POST",
          headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: line["sentence"],
          }),
        })
        const blob = await ret.blob()
        setTts((prev) => [...prev, {
          text: line["sentence"],
          data: blob,
          url: URL.createObjectURL(blob)
        }])
      }

      setLoading(false)
    }

    fetchAudio()
  }, []);

  if (loading) return <LoadingSpinner></LoadingSpinner>

  return (
    <main className="min-h-full flex flex-col items-center justify-center">
      <div className="max-w-[1000px] flex flex-col flex-wrap gap-5 items-center">
        <div className="grid grid-cols-3 gap-4">
          {tts.map((l) => {
            return <Card>
              <CardHeader>
                <CardTitle>TTS</CardTitle>
                <CardDescription>{l.text}</CardDescription>
                <CardContent className="pt-2">
                  <audio controls className="w-full h-full">
                    <source src={l.url} type="audio/mp3"></source>
                  </audio>
                </CardContent>
              </CardHeader>
            </Card>
          })}
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          set_page("vids");
        }}
      >
        <ChevronRight className="mr-2 h-4 w-4"></ChevronRight>
        Next
      </Button>
    </main>
  );
}
