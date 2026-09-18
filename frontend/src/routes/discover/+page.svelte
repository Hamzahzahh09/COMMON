<script lang="ts">
  import { onMount } from 'svelte';
  import { getItems, type Item } from '$lib/api/items.api';
  import { getAllCommunities, type Community } from '$lib/api/communities.api';
  import ResourceCard from '$lib/components/ResourceCard.svelte';
  import CommunityCard from '$lib/components/CommunityCard.svelte';
  import BorrowModal from '$lib/components/BorrowModal.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { Search, Filter, RefreshCw, Sparkles, Users, Package } from 'lucide-svelte';

  let items: Item[] = [];
  let communities: Community[] = [];
  let activeTab: 'resources' | 'communities' = 'resources';
  let loading = true;
  let searchQuery = '';
  let selectedCategory = 'Semua';
  let onlyAvailable = false;
  let borrowingItem: Item | null = null;

  const CATEGORIES = ['Semua', 'Tools', 'Home', 'Events', 'Outdoor', 'Electronics'];

  async function loadData() {
    loading = true;
    try {
      if (activeTab === 'resources') {
        const res = await getItems({
          category: selectedCategory,
          status: onlyAvailable ? 'available' : undefined,
          search: searchQuery.trim() || undefined,
        });
        if (res.success && res.data) {
          items = res.data;
        }
      } else {
        const commRes = await getAllCommunities(searchQuery.trim() || undefined);
        if (commRes.success && commRes.data) {
          communities = commRes.data;
        }
      }
    } catch (err) {
      console.error('Error loading discover data:', err);
    } finally {
      loading = false;
    }
  }

  $: if (selectedCategory || onlyAvailable !== undefined || activeTab) {
    loadData();
  }

  function handleSearchSubmit() {
    loadData();
  }

</script>

<div class="space-y-8 animate-in fade-in duration-200">
  
  <!-- Page Header -->
  <div>
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
      <Sparkles class="w-3.5 h-3.5 text-brand-500" />
      Eksplorasi Bersama
    </div>
    <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
      Temukan Sumber Daya & Komunitas
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary mt-1">
      Cari alat yang Anda perlukan di sekitar Anda, atau temukan komunitas berbagi untuk bergabung.
    </p>
  </div>

  <!-- Search & Tabs Bar -->
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      
      <!-- Primary Search Box -->
      <form on:submit|preventDefault={handleSearchSubmit} class="relative flex-1 max-w-lg">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={activeTab === 'resources' ? 'Cari bor, tangga, proyektor, tenda...' : 'Cari nama komunitas atau lokasi...'}
          class="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-white shadow-sm"
        />
        <button
          type="submit"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
        >
          Cari
        </button>
      </form>

      <!-- Tab Switcher: Resources vs Communities -->
      <div class="inline-flex p-1 rounded-2xl bg-surface-muted border border-surface-border text-xs font-semibold self-start md:self-auto">
        <button
          type="button"
          on:click={() => (activeTab = 'resources')}
          class="px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5
            {activeTab === 'resources' ? 'bg-white text-ink-primary shadow-sm font-bold' : 'text-ink-secondary hover:text-ink-primary'}"
        >
          <Package class="w-3.5 h-3.5 text-brand-600" />
          <span>Barang ({items.length})</span>
        </button>

        <button
          type="button"
          on:click={() => (activeTab = 'communities')}
          class="px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5
            {activeTab === 'communities' ? 'bg-white text-ink-primary shadow-sm font-bold' : 'text-ink-secondary hover:text-ink-primary'}"
        >
          <Users class="w-3.5 h-3.5 text-brand-600" />
          <span>Komunitas ({communities.length})</span>
        </button>
      </div>

    </div>

    <!-- Filters Bar (Only for Resources) -->
    {#if activeTab === 'resources'}
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <!-- Category Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {#each CATEGORIES as cat}
            <button
              type="button"
              on:click={() => (selectedCategory = cat)}
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap
                {selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-sm font-bold'
                  : 'bg-white border border-surface-border text-ink-secondary hover:bg-stone-50'}"
            >
              {cat}
            </button>
          {/each}
        </div>

        <!-- Available Only Toggle -->
        <label class="flex items-center gap-2 text-xs font-medium text-ink-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            bind:checked={onlyAvailable}
            class="rounded border-surface-border text-brand-600 focus:ring-brand-500 w-4 h-4"
          />
          <span>Hanya yang tersedia</span>
        </label>
      </div>
    {/if}
  </div>

  <!-- Content Stream -->
  {#if loading}
    <div class="py-20 text-center">
      <RefreshCw class="w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat data penjelajahan...</p>
    </div>
  {:else if activeTab === 'resources'}
    {#if items.length === 0}
      <EmptyState
        title="Belum Ada Barang yang Cocok"
        description="Tidak ditemukan barang dengan kata kunci atau filter ini. Coba sesuaikan kata kunci pencarian Anda."
        actionText="Reset Filter"
        onAction={() => {
          searchQuery = '';
          selectedCategory = 'Semua';
          onlyAvailable = false;
        }}
      />
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each items as item (item.id)}
          <ResourceCard
            {item}
            onBorrow={(selected) => (borrowingItem = selected)}
          />
        {/each}
      </div>
    {/if}
  {:else}
    {#if communities.length === 0}
      <EmptyState
        title="Belum Ada Komunitas yang Ditemukan"
        description="Tidak ada komunitas yang cocok dengan kata kunci Anda. Anda dapat membuat komunitas baru."
        actionText="Buat Komunitas Baru"
        actionHref="/create-community"
      />
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each communities as comm (comm.id)}
          <CommunityCard community={comm} onUpdated={loadData} />
        {/each}
      </div>
    {/if}
  {/if}

  <!-- Borrow Modal Instance -->
  {#if borrowingItem}
    <BorrowModal
      item={borrowingItem}
      onClose={() => (borrowingItem = null)}
      onSuccess={loadData}
    />
  {/if}

</div>
