// Import all audio files
import acerDemo01 from "@/assets/32 Hudba - studio nahravky/ZMVL - Acer studio - Demo/01.mp3";
import acerDemo02 from "@/assets/32 Hudba - studio nahravky/ZMVL - Acer studio - Demo/02.mp3";
import acerDemo03 from "@/assets/32 Hudba - studio nahravky/ZMVL - Acer studio - Demo/03.mp3";
import acerDemo04 from "@/assets/32 Hudba - studio nahravky/ZMVL - Acer studio - Demo/04.mp3";
import acerDemo05 from "@/assets/32 Hudba - studio nahravky/ZMVL - Acer studio - Demo/05.mp3";
import acerDemo06 from "@/assets/32 Hudba - studio nahravky/ZMVL - Acer studio - Demo/06.mp3";

import studioTrack01 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 01 - Track  1.mp3";
import studioTrack02 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 02 - Track  2.mp3";
import studioTrack03 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 03 - Track  3.mp3";
import studioTrack04 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 04 - Track  4.mp3";
import studioTrack05 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 05 - Track  5.mp3";
import studioTrack06 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 06 - Track  6.mp3";
import studioTrack07 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 07 - Track  7.mp3";
import studioTrack08 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 08 - Track  8.mp3";
import studioTrack09 from "@/assets/32 Hudba - studio nahravky/ZMVL - Studio/Zozer mesiac v lufte - 09 - Track  9.mp3";

import rehearsal from "@/assets/32 Hudba - studio nahravky/ZMVL - ladenie a skusanie pred nahravanim/ZMVL 2 - ladenie a skusanie pred nahravanim.mp3";

import zabloudilovSideA from "@/assets/32 Hudba - studio nahravky/demo u Zabloudilov/sideA.mp3";
import zabloudilovSideB from "@/assets/32 Hudba - studio nahravky/demo u Zabloudilov/sideB.mp3";

export interface Track {
  id: string;
  title: string;
  audioUrl: string;
  duration?: string;
}

export interface Album {
  id: string;
  title: string;
  year?: string;
  description?: string;
  tracks: Track[];
}

export const albums: Album[] = [
  {
    id: "acer-demo",
    title: "Acer Studio Demo",
    description: "Demo nahrávky z Acer štúdia",
    tracks: [
      { id: "acer-01", title: "Demo 1", audioUrl: acerDemo01 },
      { id: "acer-02", title: "Demo 2", audioUrl: acerDemo02 },
      { id: "acer-03", title: "Demo 3", audioUrl: acerDemo03 },
      { id: "acer-04", title: "Demo 4", audioUrl: acerDemo04 },
      { id: "acer-05", title: "Demo 5", audioUrl: acerDemo05 },
      { id: "acer-06", title: "Demo 6", audioUrl: acerDemo06 },
    ],
  },
  {
    id: "zmvl-studio",
    title: "Zožer Mesiac v Lufte",
    description: "Štúdiové nahrávky",
    tracks: [
      { id: "studio-01", title: "Track 1", audioUrl: studioTrack01 },
      { id: "studio-02", title: "Track 2", audioUrl: studioTrack02 },
      { id: "studio-03", title: "Track 3", audioUrl: studioTrack03 },
      { id: "studio-04", title: "Track 4", audioUrl: studioTrack04 },
      { id: "studio-05", title: "Track 5", audioUrl: studioTrack05 },
      { id: "studio-06", title: "Track 6", audioUrl: studioTrack06 },
      { id: "studio-07", title: "Track 7", audioUrl: studioTrack07 },
      { id: "studio-08", title: "Track 8", audioUrl: studioTrack08 },
      { id: "studio-09", title: "Track 9", audioUrl: studioTrack09 },
    ],
  },
  {
    id: "rehearsal",
    title: "Ladenie a skúšanie",
    description: "Pred nahrávaním",
    tracks: [
      { id: "rehearsal-01", title: "Skúšobňa", audioUrl: rehearsal },
    ],
  },
  {
    id: "zabloudilov",
    title: "Demo u Zablúdilov",
    description: "Domáce demo nahrávky",
    tracks: [
      { id: "zab-side-a", title: "Strana A", audioUrl: zabloudilovSideA },
      { id: "zab-side-b", title: "Strana B", audioUrl: zabloudilovSideB },
    ],
  },
];

// Flatten all tracks for easy access
export const allTracks: Track[] = albums.flatMap((album) => album.tracks);
