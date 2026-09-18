<script lang="ts">
  import { savedItems, toggleSaveItem } from '$lib/stores/saved';
  import ResourceCard from '$lib/components/ResourceCard.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import BorrowModal from '$lib/components/BorrowModal.svelte';
  import type { Item } from '$lib/api/items.api';
  import { Bookmark, Sparkles, Compass } from 'lucide-svelte';

  let borrowingItem: Item | null = null;
  let selectedCategory = 'Semua';

  const CATEGORIES = ['Semua', 'Tools', 'Home', 'Events', 'Outdoor', 'Electronics'];

  $: filteredItems = $savedItems.filter((i) => {
    if (selectedCategory === 'Semua') return true;
    return i.category === selectedCategory;
  });
</script>

<svelte:head>
  <title>Barang Tersimpan — COMMON</title>
</svelte:head>

<div class="space-y-8 animate-in fade-in duration-200 max-w-7xl mx-auto">
  
  <!-- Header -->
  <div>
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
      <Bookmark class="w-3.5 h-3.5 text-brand-500" />
      Koleksi Tersimpan
    </div>
    <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
      Barang yang Anda Simpan
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary mt-1">
      Akses cepat ke alat dan peralatan komunitas yang sewaktu-waktu ingin Anda pinjam.
    </p>
  </div>

  {#if $savedItems.length === 0}
    <EmptyState
      title="Belum Ada Barang yang Disimpan"
      description="Jelajahi inventaris komunitas dan klik ikon bookmark pada barang yang menarik untuk menyimpannya di sini."
      actionText="Jelajahi Inventaris"
      actionHref="/discover"
    />
  {:else}
    <!-- Category Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {#each CATEGORIES as cat}
        <button
          type="button"
          on:click={() => (selectedCategory = cat)}
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap
            {selectedCategory === cat ? 'bg-brand-500 text-white font-bold shadow-sm' : 'bg-white border border-surface-border text-ink-secondary hover:text-ink-primary'}"
        >
          {cat}
        </button>
      {/each}
    </div>

    <!-- Items Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {#each filteredItems as item (item.id)}
        <ResourceCard
          {item}
          onBorrow={(i) => (borrowingItem = i)}
        />
      {/each}
    </div>
  {/if}

  <!-- Borrow Modal -->
  {#if borrowingItem}
    <BorrowModal
      item={borrowingItem}
      onClose={() => (borrowingItem = null)}
      onSuccess={() => {
        borrowingItem = null;
      }}
    />
  {/if}

</div>
