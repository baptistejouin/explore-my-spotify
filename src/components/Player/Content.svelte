<script lang="ts">
  import type { SongResponse } from "../../routes/api/spotify-status/+server";

  export let song: SongResponse = {
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

  export let isLoading = false;
</script>

<div class="wrapper" class:is-loading={isLoading}>
  <div class="container">
    <div class="song">
      <h2>{song.title}</h2>
      <h3>{song.release.split("-")[0]}&nbsp;&bull;&nbsp;{song.album}</h3>
      <h4>{song.artist}</h4>
    </div>
    <div class="last-played">
      <div class="waves" class:is-playing={song.isPlaying}>
        <span class="wave" />
        <span class="wave" />
        <span class="wave" />
      </div>
      <p>
        {#if song.isPlaying}
          Now playing
        {:else}
          {song.playedAt}
        {/if}
        <span
          >(via <a
            href="https://open.spotify.com/user/_forex_?si=df7b55d00b394d94"
            >Spotify</a
          >)</span
        >
      </p>
    </div>
  </div>
  <div class="artwork">
    <div class="container">
      <img src={song.albumImageUrl} alt={song.album} />
      <img class="blur" src={song.albumImageUrl} alt={song.album} />
    </div>
  </div>
</div>

<style lang="scss">
  @use "$lib/scss/variables.scss" as vars;
  @use "$lib/scss/mixins.scss";
  $wave-size: 0.35rem;

  .wrapper {
    font-family: JetBrains Mono;
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    align-items: center;

    @include mixins.before(lg) {
      gap: 1rem;
      flex-direction: column-reverse;
    }
  }

  .container {
    width: 100%;
    @include mixins.before(lg) {
      padding-inline: 2vw;
    }
  }

  .song {
    h4 {
      color: #a5a5a5;
    }
  }
  .last-played {
    display: flex;
    align-items: center;
    gap: 1rem;

    p {
      font-size: vars.$f-md-h4;
      @include mixins.before(lg) {
        font-size: vars.$f-xs-h4;
      }
    }
    span {
      color: #a5a5a5;
      font-size: 1rem;
    }
  }
  .artwork {
    width: 100%;

    @include mixins.after(lg) {
      display: flex;
      justify-content: flex-end;
    }

    .container {
      @include mixins.after(lg) {
        width: fit-content;
      }
      position: relative;
    }

    img {
      width: 25.91667rem;
      border-radius: 1rem;

      @include mixins.before(lg) {
        width: 100%;
      }
    }
    .blur {
      z-index: -1;
      mix-blend-mode: lighten;
      animation: artwork_blur 10s ease-in-out alternate infinite;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .waves {
    display: flex;
    gap: $wave-size;
    align-items: center;
    height: 3rem;

    .wave {
      width: $wave-size;
      height: $wave-size;
      border-radius: 3rem;
      background-color: #a5a5a5;
      animation: wave_not_playing 0.6s ease-in-out alternate infinite;
    }
    &.is-playing {
      .wave {
        animation-name: wave_playing;
      }
    }
    .wave:nth-child(1) {
      animation-delay: 0.2s;
    }
    .wave:nth-child(2) {
      animation-delay: 0.1s;
    }
    .wave:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes artwork_blur {
    0% {
      filter: blur(13rem) saturate(1);
      transform: scale(1.15);
      opacity: 0.5;
    }
    100% {
      filter: blur(15rem) saturate(1.5);
      transform: scale(1.2);
      opacity: 0.3;
    }
  }

  @keyframes wave_not_playing {
    0% {
      height: $wave-size;
    }
    100% {
      height: $wave-size * 1.71;
    }
  }

  @keyframes wave_playing {
    0% {
      height: $wave-size;
    }
    100% {
      height: $wave-size * 3.15;
    }
  }
</style>
