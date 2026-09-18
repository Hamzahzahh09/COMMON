<script lang="ts">
  import { page } from '$app/stores';
  import { isAuthenticated } from '../stores/auth';
  import { Home, Compass, Users, Clock, Plus, User } from 'lucide-svelte';

  export let onOpenShare: () => void = () => {};

  $: currentPath = $page.url.pathname;
</script>

<div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-surface-border px-3 py-2 flex items-center justify-around shadow-lg">
  <!-- Home -->
  <a
    href="/"
    class="flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors
      {currentPath === '/' ? 'text-brand-600 font-bold' : 'text-ink-muted hover:text-ink-primary'}"
  >
    <Home class="w-4 h-4 stroke-[2]" />
    <span>Home</span>
  </a>

  <!-- Discover -->
  <a
    href="/discover"
    class="flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors
      {currentPath.startsWith('/discover') ? 'text-brand-600 font-bold' : 'text-ink-muted hover:text-ink-primary'}"
  >
    <Compass class="w-4 h-4 stroke-[2]" />
    <span>Discover</span>
  </a>

  {#if $isAuthenticated}
    <!-- Share Quick Action Center Button -->
    <button
      type="button"
      on:click={onOpenShare}
      class="w-10 h-10 -mt-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-900/20 active:scale-95 transition-all"
      aria-label="Share a Resource"
    >
      <Plus class="w-5 h-5 stroke-[2.5]" />
    </button>

    <!-- Communities -->
    <a
      href="/communities"
      class="flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors
        {currentPath.startsWith('/communities') || currentPath.startsWith('/c/') ? 'text-brand-600 font-bold' : 'text-ink-muted hover:text-ink-primary'}"
    >
      <Users class="w-4 h-4 stroke-[2]" />
      <span>Komunitas</span>
    </a>

    <!-- Requests -->
    <a
      href="/requests"
      class="flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors
        {currentPath.startsWith('/requests') ? 'text-brand-600 font-bold' : 'text-ink-muted hover:text-ink-primary'}"
    >
      <Clock class="w-4 h-4 stroke-[2]" />
      <span>Requests</span>
    </a>
  {:else}
    <!-- Communities -->
    <a
      href="/communities"
      class="flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors
        {currentPath.startsWith('/communities') || currentPath.startsWith('/c/') ? 'text-brand-600 font-bold' : 'text-ink-muted hover:text-ink-primary'}"
    >
      <Users class="w-4 h-4 stroke-[2]" />
      <span>Komunitas</span>
    </a>

    <!-- Sign in -->
    <a
      href="/login"
      class="flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors
        {currentPath.startsWith('/login') ? 'text-brand-600 font-bold' : 'text-ink-muted hover:text-ink-primary'}"
    >
      <User class="w-4 h-4 stroke-[2]" />
      <span>Sign in</span>
    </a>
  {/if}
</div>

