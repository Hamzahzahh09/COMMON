<script lang="ts">
  import type { Item } from '$lib/api/items.api';
  import StatusBadge from './StatusBadge.svelte';
  import { savedItems, toggleSaveItem } from '$lib/stores/saved';
  import { toast } from '$lib/stores/toast';
  import {
    MapPin,
    User,
    ArrowUpRight,
    Bookmark,
    Landmark,
    Sparkles,
  } from 'lucide-svelte';

  export let item: Item;
  export let onBorrow: ((item: Item) => void) | undefined = undefined;

  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80';

  $: isSaved = $savedItems.some((i) => i.id === item.id);
  $: isCommunityOwned = item.ownership_type === 'community';

  function handleToggleSave(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const saved = toggleSaveItem(item);
    if (saved) {
      toast.success(`"${item.name}" disimpan ke koleksi Anda.`);
    } else {
      toast.info(`"${item.name}" dihapus dari koleksi.`);
    }
  }
</script>

<div class="group bg-white rounded-2xl border border-surface-border overflow-hidden hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between h-full relative">
  <div>
    <!-- Photo & Availability Overlay -->
    <a href="/items/{item.id}" class="block relative aspect-[4/3] bg-stone-100 overflow-hidden">
      <img
        src={item.image_url || DEFAULT_IMAGE}
        alt={item.name}
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        on:error={(e) => {
          (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
        }}
      />

      <!-- Availability Overlay -->
      <div class="absolute top-3 left-3 flex items-center gap-1.5">
        <StatusBadge status={item.status} size="sm" />
      </div>

      <!-- Bookmark / Save Button -->
      <button
        type="button"
        on:click={handleToggleSave}
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-ink-primary shadow-sm flex items-center justify-center transition-transform active:scale-90"
        title={isSaved ? 'Hapus dari simpanan' : 'Simpan barang'}
        aria-label={isSaved ? 'Hapus dari simpanan' : 'Simpan barang'}
      >
        <Bookmark
          class="w-4 h-4 transition-colors {isSaved ? 'fill-brand-600 text-brand-600' : 'text-stone-500'}"
        />
      </button>

      <!-- Category Pill -->
      <div class="absolute bottom-3 left-3">
        <span class="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium tracking-wide">
          {item.category}
        </span>
      </div>
    </a>

    <!-- Content -->
    <div class="p-4 sm:p-5">
      <!-- Community Reference & Ownership Model Tag -->
      <div class="flex items-center justify-between gap-2 mb-1.5">
        {#if item.community}
          <a
            href="/c/{item.community.slug}"
            class="text-[11px] font-semibold text-brand-700 hover:text-brand-800 tracking-tight truncate max-w-[150px]"
          >
            {item.community.name}
          </a>
        {/if}

        {#if isCommunityOwned}
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
            <Landmark class="w-2.5 h-2.5 text-emerald-600" />
            <span>Community</span>
          </span>
        {:else}
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
            <span>Personal</span>
          </span>
        {/if}
      </div>

      <!-- Item Name -->
      <a href="/items/{item.id}" class="block">
        <h3 class="font-bold text-base text-ink-primary tracking-tight line-clamp-1 group-hover:text-brand-700 transition-colors">
          {item.name}
        </h3>
      </a>

      <!-- Condition & Status hint -->
      <div class="text-[11px] text-ink-muted mt-1 flex items-center gap-1.5 font-medium">
        <span>{item.condition || 'Kondisi terawat'}</span>
        <span>•</span>
        <span class={item.status === 'available' ? 'text-brand-700 font-semibold' : 'text-stone-500'}>
          {item.status === 'available' ? 'Tersedia sekarang' : 'Sedang dipinjam'}
        </span>
      </div>

      <!-- Description -->
      <p class="text-xs text-ink-secondary mt-2 line-clamp-2 leading-relaxed">
        {item.description || 'Alat inventaris bersama warga yang siap digunakan untuk kebutuhan rumah tangga atau lingkungan.'}
      </p>

      <!-- Shared by Owner Meta -->
      <div class="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-[11px] text-ink-secondary">
        <div class="flex items-center gap-1.5 truncate">
          {#if isCommunityOwned}
            <div class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-[9px]">
              🏛️
            </div>
            <span class="truncate text-ink-secondary font-medium">
              Aset Komunitas
            </span>
          {:else}
            {#if item.owner?.avatar_url}
              <img
                src={item.owner.avatar_url}
                alt={item.owner.full_name}
                class="w-4 h-4 rounded-full object-cover ring-1 ring-stone-200 flex-shrink-0"
              />
            {:else}
              <User class="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            {/if}
            <span class="truncate">
              <span class="text-ink-muted">Shared by</span> <strong class="font-medium text-ink-primary">{item.owner?.full_name || 'Warga'}</strong>
            </span>
          {/if}
        </div>

        {#if item.location_hint}
          <div class="flex items-center gap-1 flex-shrink-0 text-ink-muted" title={item.location_hint}>
            <MapPin class="w-3 h-3 text-stone-400" />
            <span class="truncate max-w-[80px]">{item.location_hint}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Action Bar -->
  <div class="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
    {#if item.status === 'available'}
      <button
        type="button"
        on:click={() => onBorrow?.(item)}
        class="w-full py-2.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
      >
        <span>Ajukan Pinjam</span>
        <ArrowUpRight class="w-3.5 h-3.5 stroke-[2]" />
      </button>
    {:else}
      <a
        href="/items/{item.id}"
        class="w-full py-2 px-3 rounded-xl bg-surface-muted hover:bg-stone-200 text-ink-secondary text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-center"
      >
        <span>Lihat Detail Barang</span>
      </a>
    {/if}
  </div>
</div>
