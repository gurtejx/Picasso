import HomePrompt from "@/components/HomePrompt";

export default function Home() {
  return (
    <main className="min-h-full flex flex-col items-center justify-center">
      <div className="max-w-[800px] flex flex-col gap-5 items-center">
        <div className="font-bold text-6xl line-clamp-2 text-center text-neutral-50">
          Craft Your Story, Ignite Your Presence
        </div>
        <div className="text-center text-neutral-100">
          Unleash the Power of Words: Effortlessly Generate Stunning Visuals for
          Instagram, TikTok, YouTube, and Beyond. Your Story, Your Style –
          Transform Every Text into an Engaging Video Masterpiece
        </div>
        <HomePrompt></HomePrompt>
      </div>
    </main>
  );
}
