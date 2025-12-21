// Import all jam audio files
import kochanovce01 from "@/assets/33 Hudba - jams/zmvl-kochanovce/01.mp3";
import kochanovce02 from "@/assets/33 Hudba - jams/zmvl-kochanovce/02.mp3";
import kochanovce03 from "@/assets/33 Hudba - jams/zmvl-kochanovce/03.mp3";
import kochanovce04 from "@/assets/33 Hudba - jams/zmvl-kochanovce/04.mp3";
import kochanovce05 from "@/assets/33 Hudba - jams/zmvl-kochanovce/05.mp3";
import kochanovce06 from "@/assets/33 Hudba - jams/zmvl-kochanovce/06.mp3";
import kochanovce07 from "@/assets/33 Hudba - jams/zmvl-kochanovce/07.mp3";
import kochanovce08 from "@/assets/33 Hudba - jams/zmvl-kochanovce/08.mp3";
import kochanovce09 from "@/assets/33 Hudba - jams/zmvl-kochanovce/09.mp3";

import session1_01 from "@/assets/33 Hudba - jams/zmvl-session1/01.mp3";
import session1_02 from "@/assets/33 Hudba - jams/zmvl-session1/02.mp3";
import session1_03 from "@/assets/33 Hudba - jams/zmvl-session1/03.mp3";
import session1_04 from "@/assets/33 Hudba - jams/zmvl-session1/04.mp3";
import session1_05 from "@/assets/33 Hudba - jams/zmvl-session1/05.mp3";
import session1_06 from "@/assets/33 Hudba - jams/zmvl-session1/06.mp3";

import session2_01 from "@/assets/33 Hudba - jams/zmvl-session2/01.mp3";
import session2_02 from "@/assets/33 Hudba - jams/zmvl-session2/02.mp3";
import session2_03 from "@/assets/33 Hudba - jams/zmvl-session2/03.mp3";

import { Track, Album } from "./albumSongs";

export const jamAlbums: Album[] = [
  {
    id: "kochanovce",
    title: "Kochanovce",
    tracks: [
      { id: "koch-01", title: "Kochanovce 01", audioUrl: kochanovce01 },
      { id: "koch-02", title: "Kochanovce 02", audioUrl: kochanovce02 },
      { id: "koch-03", title: "Kochanovce 03", audioUrl: kochanovce03 },
      { id: "koch-04", title: "Kochanovce 04", audioUrl: kochanovce04 },
      { id: "koch-05", title: "Kochanovce 05", audioUrl: kochanovce05 },
      { id: "koch-06", title: "Kochanovce 06", audioUrl: kochanovce06 },
      { id: "koch-07", title: "Kochanovce 07", audioUrl: kochanovce07 },
      { id: "koch-08", title: "Kochanovce 08", audioUrl: kochanovce08 },
      { id: "koch-09", title: "Kochanovce 09", audioUrl: kochanovce09 },
    ],
  },
  {
    id: "session1",
    title: "Session 1",
    tracks: [
      { id: "s1-01", title: "Session 1 - 01", audioUrl: session1_01 },
      { id: "s1-02", title: "Session 1 - 02", audioUrl: session1_02 },
      { id: "s1-03", title: "Session 1 - 03", audioUrl: session1_03 },
      { id: "s1-04", title: "Session 1 - 04", audioUrl: session1_04 },
      { id: "s1-05", title: "Session 1 - 05", audioUrl: session1_05 },
      { id: "s1-06", title: "Session 1 - 06", audioUrl: session1_06 },
    ],
  },
  {
    id: "session2",
    title: "Session 2",
    tracks: [
      { id: "s2-01", title: "Session 2 - 01", audioUrl: session2_01 },
      { id: "s2-02", title: "Session 2 - 02", audioUrl: session2_02 },
      { id: "s2-03", title: "Session 2 - 03", audioUrl: session2_03 },
    ],
  },
];

// Flatten all jam tracks for easy access
export const allJamTracks: Track[] = jamAlbums.flatMap((album) => album.tracks);
