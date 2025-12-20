export interface Song {
  id: string;
  title: string;
  artist: string;
  spotifyTrackUrl: string;
  spotifyTrackId: string;
  description?: string;
  duration?: string;
}

export const songs: Song[] = [
  {
    id: "1",
    title: "Paranoid",
    artist: "Black Sabbath",
    spotifyTrackUrl: "https://open.spotify.com/track/0xOVhZlNcmqdd80OWDNwmH",
    spotifyTrackId: "0xOVhZlNcmqdd80OWDNwmH",
    description: "Heavy metal anthem from 1970",
    duration: "2:48",
  },
  {
    id: "2",
    title: "Potichu",
    artist: "Dunaj",
    spotifyTrackUrl: "https://open.spotify.com/track/7z2TIkE2BULCwrP5ZqU2EK",
    spotifyTrackId: "7z2TIkE2BULCwrP5ZqU2EK",
    description: "Czech experimental rock",
    duration: "3:38",
  },
  {
    id: "3",
    title: "Old Man",
    artist: "Neil Young",
    spotifyTrackUrl: "https://open.spotify.com/track/16XeptMdlJTWWeIrwEAOvv",
    spotifyTrackId: "16XeptMdlJTWWeIrwEAOvv",
    description: "Folk rock classic from Harvest",
    duration: "3:22",
  },
];
