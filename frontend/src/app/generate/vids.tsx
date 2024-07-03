"use client";

import { pageAtom, scriptAtom } from "@/state";
import { useAtomValue, useSetAtom } from "jotai";
import VideoFetcher from "./video_fetcher";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function VidsPage() {
  const set_page = useSetAtom(pageAtom);
  const script = useAtomValue(scriptAtom);

  return (
    <main className="min-h-full flex flex-col items-center justify-center mb-3 gap-5">
      <div className="max-w-[1000px] grid grid-cols-3 grid-rows-[250px] gap-5">
        {script.json.content.map((s, i) => {
          return (
            <VideoFetcher
              prompt={s.image_search_keyword}
              index={i}
              key={s.image_search_keyword}
            ></VideoFetcher>
          );
        })}
      </div>
      <Button
        variant="outline"
        onClick={() => {
          set_page("final");
        }}
      >
        <ChevronRight className="mr-2 h-4 w-4"></ChevronRight>
        Next
      </Button>
    </main>
  );
}
