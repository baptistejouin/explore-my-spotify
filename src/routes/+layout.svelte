<script lang="ts">
  import "../app.scss";
  import { QueryClientProvider, QueryClient } from "@tanstack/svelte-query";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <main>
    <slot />
  </main>
</QueryClientProvider>

<p />

<style lang="scss">
  main {
    font-family: sans-serif;
    color: black;
    text-align: center;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
  }
</style>
