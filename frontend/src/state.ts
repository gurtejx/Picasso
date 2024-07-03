import { atom } from "jotai";

export const pageAtom = atom("script");
export const scriptAtom = atom({
  json: null,
  compiled: null,
});
export const ttsAtom = atom([])

export const vidsAtom = atom({})