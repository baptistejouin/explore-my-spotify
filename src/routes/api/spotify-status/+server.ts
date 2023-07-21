import type {
  CurrentlyPlayingType,
  RecentlyPlayedType,
  Song,
} from "$lib/type/spotify";
import { json, error } from "@sveltejs/kit";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} from "$env/static/private";

export type SongResponse = {
  data: {
    isPlaying: boolean;
    title: string;
    artist: string;
    album: string;
    albumImageUrl: string;
    songUrl: string;
    previewUrl: string;
    playedAt: string;
  }
}

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64");
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.access_token);

  return response;
};

const getNowPlaying = async (accessToken: string) => {
  return await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getRecentlyPlayed = async (accessToken: string) => {
  return await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const buildResponse = (isPlaying: boolean, song: Song, playedAt?: string): SongResponse["data"] => ({
  isPlaying,
  title: song.name,
  artist: song.artists.map((_artist) => _artist.name).join(", "),
  album: song.album.name,
  albumImageUrl: song.album.images[1].url,
  songUrl: song.external_urls.spotify,
  previewUrl: song.preview_url,
  playedAt: playedAt ? playedAt : Date.now().toString(),
});

export async function GET() {
  const accessToken = await getAccessToken();
  const resNowPlaying = await getNowPlaying(accessToken);

  if (resNowPlaying.status === 204 || resNowPlaying.status > 400) {
    const resRecentlyPlayed = await getRecentlyPlayed(accessToken);

    if (resRecentlyPlayed.status === 204 || resRecentlyPlayed.status > 400) {
      throw error(404, "No song currently playing or played recently");
    }

    const song = (await resRecentlyPlayed.json()) as RecentlyPlayedType;

    return json({
      data: buildResponse(false, song.items[0].track, song.items[0].played_at)
    });
  }

  const song = (await resNowPlaying.json()) as CurrentlyPlayingType;

  return json({
    data: buildResponse(true, song.item),
  });
}
