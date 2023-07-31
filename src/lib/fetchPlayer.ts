import type { SongResponse } from "../routes/api/spotify-status/+server";

export async function getPlayerState() {
    const res = await fetch('/api/spotify-status');

    if (res.ok) {
        return await res.json() as SongResponse;
    } else {
        throw new Error('Request failed');
    }
}