<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllCommunities, type Community } from '$lib/api/communities.api';
  import CommunityCard from '$lib/components/CommunityCard.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { Search, Plus, Users, Sparkles, RefreshCw } from 'lucide-svelte';

  let communities: Community[] = [];
  let loading = true;
  let searchQuery = '';

  async function loadCommunities() {
    loading = true;
    try {
      const res = await getAllCommunities(searchQuery.trim() || undefined);
      if (res.success && res.data) {
        communities = res.data;
      }
    } catch (err) {
      console.error('Failed to load communities:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearchSubmit() {
    loadCommunities();
  }

  onMount(() => {
    loadCommunities();
  });
</script>

<div class="space-y-8 animate-in fade-in duration-200">
  
  <!-- Header & Action -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
        <Users class="w-3.5 h-3.5 text-brand-500" />
        Direktori Komunitas
      </div>
      <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
        Komunitas Berbagi
      </h1>
      <p class="text-xs sm:text-sm text-ink-secondary mt-1">
        Temukan ruang berbagi di sekitar Anda atau ciptakan komunitas untuk kelompok Anda.
      </p>
    </div>

    <a
      href="/create-community"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
    >
      <Plus class="w-4 h-4 stroke-[2.5]" />
      <span>Buat Komunitas</span>
    </a>
  </div>

  <!-- Search Box -->
  <form on:submit|preventDefault={handleSearchSubmit} class="relative max-w-md">
    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Cari komunitas (contoh: RT 05, Makers, Camping)..."
      class="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-white shadow-sm"
    />
    <button
      type="submit"
      class="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
    >
      Cari
    </button>
  </form>

  <!-- Communities Grid -->
  {#if loading}
    <div class="py-20 text-center">
      <RefreshCw class="w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat daftar komunitas...</p>
    </div>
  {:else if communities.length === 0}
    <EmptyState
      title="Belum Ada Komunitas yang Cocok"
      description="Tidak ada komunitas yang sesuai dengan pencarian Anda. Anda dapat membuat komunitas baru."
      actionText="Buat Komunitas Sekarang"
      actionHref="/create-community"
    />
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each communities as comm (comm.id)}
        <CommunityCard community={comm} onUpdated={loadCommunities} />
      {/each}
    </div>
  {/if}

</div>
