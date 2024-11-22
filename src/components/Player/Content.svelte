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
</script>

<div class="wrapper" class:skeleton={!song.title}>
  <div class="artwork">
    <div class="container">
      <div class="artwork-content">
        <img src={song.albumImageUrl} alt={song.album} />
        <img class="blur" src={song.albumImageUrl} alt={song.album} />
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
            >(via <a
              href="https://open.spotify.com/user/_forex_?si=df7b55d00b394d94"
              >Spotify</a
            >)</span
          >
        </p>
      {/if}
    </div>
  </div>
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
      mix-blend-mode: soft-light;
      animation: liquid_blur 20s ease-in-out infinite;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: min(100vh, 1200px);
      will-change: transform, filter;
      filter: blur(100px);
      opacity: 1;
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

  @keyframes liquid_blur {
    0% {
      transform: scale(1.2) translate(-2%, -2%) rotate(0deg);
      filter: blur(100px) saturate(1.5) brightness(1.2);
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
    25% {
      transform: scale(1.25) translate(2%, 2%) rotate(2deg);
      filter: blur(120px) saturate(1.8) brightness(1.3);
      border-radius: 70% 30% 30% 70% / 70% 30% 70% 30%;
    }
    50% {
      transform: scale(1.3) translate(1%, -1%) rotate(-2deg);
      filter: blur(110px) saturate(1.6) brightness(1.4);
      border-radius: 30% 70% 30% 70% / 70% 30% 30% 70%;
    }
    75% {
      transform: scale(1.22) translate(-1%, 1%) rotate(1deg);
      filter: blur(130px) saturate(1.7) brightness(1.2);
      border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
    }
    100% {
      transform: scale(1.2) translate(-2%, -2%) rotate(0deg);
      filter: blur(100px) saturate(1.5) brightness(1.2);
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
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
