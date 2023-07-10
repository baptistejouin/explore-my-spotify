export async function getPlayerState() {
    const res = await fetch('/api/currently-playing');

    if (res.ok) {
        return await res.json();
    } else {
        throw new Error('Request failed');
    }
}