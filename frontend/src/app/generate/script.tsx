"use client";

import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { pageAtom, scriptAtom } from "@/state";
import { useAtom, useSetAtom } from "jotai";
import { ChevronRight, EditIcon, RefreshCwIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loading_spinner";

export default function Script() {
  const set_page = useSetAtom(pageAtom);
  const [script, setScript] = useAtom(scriptAtom);
  const [loading, setLoading] = useState(true);

  const params = useSearchParams();
  const topic: string = params.get("topic") as string;

  useEffect(() => {
    fetch(`http://localhost:8000/api/script?topic=${topic}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        setScript((prev) => ({
          json: data,
          compiled: data.content.reduce((a, c) => a + " " + c.sentence, ""),
        }));
      });
  }, []);

  if (loading) return <LoadingSpinner></LoadingSpinner>

  return (
    <main className="min-h-full flex flex-col items-center justify-center">
      <div className="max-w-[1000px] flex flex-col gap-5 items-center">
        <div className="font-semibold text-2xl text-center text-neutral-50">
          <TextGenerateEffect words={script.compiled} />
        </div>
        <div className="flex flex-row gap-3">
          <Button variant="default">
            <RefreshCwIcon className="mr-2 h-4 w-4"></RefreshCwIcon>
            Regenerate
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              set_page("tts");
            }}
          >
            <ChevronRight className="mr-2 h-4 w-4"></ChevronRight>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
