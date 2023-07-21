<script>
  import { getPlayerState } from "$lib/fetchPlayer";

  let promise = getPlayerState();
</script>

<main>
  {#await promise}
    <p>Chargement...</p>
  {:then { data }}
    {#if data.isPlaying === false}
      <p>Pas de musique en cours 🥲</p>
      <p>
        Dernière écoute le {new Date(data.playedAt).toLocaleTimeString(
          "fr-FR",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }
        )}
        :
      </p>
    {/if}

    <div class="card">
      <img src={data.albumImageUrl} alt={data.album} />
      <a href={data.songUrl}>
        <div>{data.title}</div>
      </a>
      <div>{data.artist}</div>
      <div>{data.album}</div>
      <audio controls src={data.previewUrl} />
    </div>
  {/await}
</main>

<style lang="scss">
  body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  main {
    font-family: sans-serif;
    color: black;
    text-align: center;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
  }
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
