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
    spotifyTrackUrl: "https://open.spotify.com/track/70bwcV8l7p5vOsaPDFWNI7",
    spotifyTrackId: "70bwcV8l7p5vOsaPDFWNI7",
    description: "Heavy metal anthem from 1970",
    duration: "2:48",
  },
  {
    id: "2",
    title: "Barvy",
    artist: "Dunaj",
    spotifyTrackUrl: "https://open.spotify.com/track/1q3zGmGlbfjMDjRqJ3OEYP",
    spotifyTrackId: "1q3zGmGlbfjMDjRqJ3OEYP",
    description: "Czech experimental rock",
    duration: "4:32",
  },
  {
    id: "3",
    title: "Old Man",
    artist: "Neil Young",
    spotifyTrackUrl: "https://open.spotify.com/track/3R4dfI0KqPOYhFZGD8FVfe",
    spotifyTrackId: "3R4dfI0KqPOYhFZGD8FVfe",
    description: "Folk rock classic from Harvest",
    duration: "3:22",
  },
];
