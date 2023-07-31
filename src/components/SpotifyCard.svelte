<script lang="ts">
  import { getPlayerState } from "$lib/fetchPlayer";
  import { createQuery, isError } from "@tanstack/svelte-query";
  import type { SongResponse } from "../routes/api/spotify-status/+server";
  import { esbuildVersion } from "vite";

  const song = createQuery<SongResponse, Error>({
    queryKey: ["playerState"],
    queryFn: getPlayerState,
    refetchInterval: 10000,
  });

  const lastPlayedAt = (date: string) =>
    new Date(date).toLocaleTimeString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
</script>

<div class="card">
  {#if $song.isLoading}
    <p>Chargement...</p>
  {:else if $song.isError}
    <p>Erreur lors du chargement de la musique</p>
  {:else if $song.isSuccess}
    {#if $song.data.isPlaying === true}
      <p>En train d'écouter 🎧</p>
    {:else}
      <p>
        Pas de musique en cours 🥲 (Dernière écoute le {lastPlayedAt(
          $song.data.playedAt
        )})
      </p>
    {/if}
    <img src={$song.data.albumImageUrl} alt={$song.data.album} />
    <a href={$song.data.songUrl}>
      <div>{$song.data.title}</div>
    </a>
    <div>{$song.data.artist}</div>
    <div>{$song.data.album}</div>
    <audio controls src={$song.data.previewUrl} />
  {/if}
</div>

<style lang="scss">
  a {
    text-decoration: none;
    color: black;

    &:hover {
      text-decoration: underline;
    }
  }
  img {
    width: 100%;
    height: auto;
    margin-bottom: 2rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
