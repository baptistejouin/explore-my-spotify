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
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  previewUrl: string;
  playedAt: string;
  release: string;
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

const timeAgo = (date: string) => {
  const now = new Date();
  const pastDate = new Date(date);
  const timeDifferenceInMilliseconds = now.getTime() - pastDate.getTime();

  if (timeDifferenceInMilliseconds < 3600000) {
    return "Less than an hour ago";
  } else if (timeDifferenceInMilliseconds < 86400000) {
    const hours = Math.floor(timeDifferenceInMilliseconds / 3600000);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    const days = Math.floor(timeDifferenceInMilliseconds / 86400000);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
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

const buildResponse = (isPlaying: boolean, song: Song, playedAt?: string): SongResponse => ({
  isPlaying,
  title: song.name,
  artist: song.artists.map((_artist) => _artist.name).join(", "),
  album: song.album.name,
  albumImageUrl: song.album.images[0].url,
  songUrl: song.external_urls.spotify,
  previewUrl: song.preview_url,
  playedAt: playedAt ? timeAgo(playedAt) : "Now",
  release: song.album.release_date,
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
