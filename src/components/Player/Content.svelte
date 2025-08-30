<script lang="ts">
  import type { SongResponse } from "../../routes/api/spotify-status/+server";
  import AlbumShader from "./AlbumShader.svelte";

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
</script>

{#if song.albumImageUrl}
  <AlbumShader albumImageUrl={song.albumImageUrl} />
{/if}

<div class="wrapper" class:skeleton={!song.title}>
  <div class="artwork">
    <div class="container">
      <div class="artwork-content">
        <img src={song.albumImageUrl} alt={song.album} />
      </div>
    </div>
  </div>
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
      {#if song.title}
        <p>
          {#if song.isPlaying}
            Now playing
          {:else}
            {song.playedAt}
          {/if}
          <span
            >(on my <a
              href="https://open.spotify.com/user/_forex_?si=df7b55d00b394d94"
              >account</a
            >)</span
          >
        </p>
      {/if}
    </div>
  </div>
</div>

<div class="info">
  Made for fun <a
    href="https://github.com/baptistejouin"
    target="_blank"
    rel="noopener noreferrer">here</a
  >
</div>

<style lang="scss">
  @use "$lib/scss/variables.scss" as vars;
  @use "$lib/scss/mixins.scss";

  $wave-size: 0.35rem;

  @keyframes skeleton-loading {
    0% {
      background-color: rgba(165, 165, 165, 0.1);
    }
    100% {
      background-color: rgba(165, 165, 165, 0.3);
    }
  }

  .wrapper {
    font-family: "JetBrains Mono", monospace;
    display: flex;
    gap: 6rem;
    justify-content: space-between;
    align-items: center;
    @include mixins.before(lg) {
      gap: 1rem;
      flex-direction: column;
    }

    &.skeleton {
      .artwork-content {
        width: 25.91667rem;
        height: 25.91667rem;
        border-radius: 1rem;
        animation: skeleton-loading 1s infinite alternate;
        box-shadow:
          0 20px 25px -5px rgb(0 0 0 / 0.1),
          0 8px 10px -6px rgb(0 0 0 / 0.1);
        @include mixins.before(lg) {
          width: 100%;
        }

        img {
          display: none;
        }
      }

      .song {
        h2,
        h3,
        h4 {
          height: 2rem;
          width: 80%;
          border-radius: 0.25rem;
          background: #a5a5a5;
          animation: skeleton-loading 1s infinite alternate;
          margin-bottom: 0.5rem;
          color: transparent;
        }

        h3 {
          height: 1.5rem;
          width: 60%;
        }

        h4 {
          height: 1.25rem;
          width: 40%;
        }
      }

      .waves {
        height: 3rem;
        width: 5rem;
        border-radius: 0.25rem;
        animation: skeleton-loading 1s infinite alternate;
        .wave {
          display: none;
        }
      }

      p {
        height: 1rem;
        width: 8rem;
        border-radius: 0.25rem;
        animation: skeleton-loading 1s infinite alternate;
        color: transparent;
      }
    }
  }

  .container {
    width: 100%;
    @include mixins.before(lg) {
      padding-inline: 2vw;
    }
  }

  .song {
    h2,
    h3 {
      display: -webkit-box;
      -webkit-line-clamp: 3; // limit to 3 lines
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      line-height: 1.2;
      max-width: 100%;
    }

    h2 {
      font-size: vars.$f-md-h2;

      @include mixins.before(lg) {
        font-size: vars.$f-xs-h2;
      }
    }

    h3 {
      font-size: vars.$f-md-h4;

      @include mixins.before(lg) {
        font-size: vars.$f-xs-h4;
      }
    }

    h4 {
      font-size: vars.$f-md-h4;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @include mixins.before(lg) {
        font-size: vars.$f-xs-h4;
      }
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

  .info {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.2);
    margin-top: 0.5rem;
    text-align: center;
    position: fixed;
    bottom: 1rem;
    left: 1rem;

    a {
      color: rgba(255, 255, 255, 0.25);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    @include mixins.before(lg) {
      text-align: center;
      margin-top: 1rem;
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
