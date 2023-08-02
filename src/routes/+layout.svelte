<script lang="ts">
  import "../app.scss";
  import { browser } from "$app/environment";
  import { QueryClientProvider, QueryClient } from "@tanstack/svelte-query";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <main>
    <slot />
  </main>
</QueryClientProvider>

<style lang="scss">
  @use "$lib/scss/variables.scss" as vars;

  main {
    font-family: sans-serif;
    color: white;
    max-width: vars.$lg;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
  }
</style>
