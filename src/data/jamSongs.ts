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
      { id: "koch-01", title: "Track 1", audioUrl: kochanovce01 },
      { id: "koch-02", title: "Track 2", audioUrl: kochanovce02 },
      { id: "koch-03", title: "Track 3", audioUrl: kochanovce03 },
      { id: "koch-04", title: "Track 4", audioUrl: kochanovce04 },
      { id: "koch-05", title: "Track 5", audioUrl: kochanovce05 },
      { id: "koch-06", title: "Track 6", audioUrl: kochanovce06 },
      { id: "koch-07", title: "Track 7", audioUrl: kochanovce07 },
      { id: "koch-08", title: "Track 8", audioUrl: kochanovce08 },
      { id: "koch-09", title: "Track 9", audioUrl: kochanovce09 },
    ],
  },
  {
    id: "session1",
    title: "Session 1",
    tracks: [
      { id: "s1-01", title: "Track 1", audioUrl: session1_01 },
      { id: "s1-02", title: "Track 2", audioUrl: session1_02 },
      { id: "s1-03", title: "Track 3", audioUrl: session1_03 },
      { id: "s1-04", title: "Track 4", audioUrl: session1_04 },
      { id: "s1-05", title: "Track 5", audioUrl: session1_05 },
      { id: "s1-06", title: "Track 6", audioUrl: session1_06 },
    ],
  },
  {
    id: "session2",
    title: "Session 2",
    tracks: [
      { id: "s2-01", title: "Track 1", audioUrl: session2_01 },
      { id: "s2-02", title: "Track 2", audioUrl: session2_02 },
      { id: "s2-03", title: "Track 3", audioUrl: session2_03 },
    ],
  },
];

// Flatten all jam tracks for easy access
export const allJamTracks: Track[] = jamAlbums.flatMap((album) => album.tracks);
