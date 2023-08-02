<script lang="ts">
  import { getPlayerState } from "$lib/fetchPlayer";
  import { createQuery } from "@tanstack/svelte-query";
  import type { SongResponse } from "../../routes/api/spotify-status/+server";
  import Content from "./Content.svelte";

  export let data: SongResponse = {
    isPlaying: false,
    title: "",
    artist: "",
    album: "",
    albumImageUrl: "",
    previewUrl: "",
    songUrl: "",
    playedAt: "",
    release: "",
  };

  const song = createQuery<SongResponse, Error>({
    queryKey: ["playerState"],
    queryFn: getPlayerState,
    initialData: data,
    refetchInterval: 15000, // 15s
  });
</script>

<div class="player">
  {#if $song.isSuccess}
    <Content
      isLoading={$song.isFetching || $song.isLoading}
      song={$song.data}
    />
  {:else if $song.isError}
    <p>Something went wrong</p>
  {/if}
</div>

<style lang="scss">
  @use "$lib/scss/variables.scss" as vars;
  @use "$lib/scss/mixins.scss";

  .player {
    display: flex;
    flex-direction: column;
    margin-block: 3rem;
    max-width: 100%;

    @include mixins.before(lg) {
      margin-inline: auto;
      max-width: vars.$sm;
    }
  }
</style>
