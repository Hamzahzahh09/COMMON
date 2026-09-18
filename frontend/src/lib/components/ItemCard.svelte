<script lang="ts">
  import { authState } from '../stores/auth';
  import { savedItems, toggleSaveItem } from '../stores/saved';
  import { toast } from '../stores/toast';
  import { MapPin, User, ArrowRight, CheckCircle2, Clock, AlertTriangle, Landmark, Bookmark } from 'lucide-svelte';

  export let item: any;
  export let onBorrow: (item: any) => void = () => {};

  $: isOwner = $authState.resident?.id === item.owner_id || $authState.user?.id === item.owner_id;
  $: isAvailable = item.status === 'available';
  $: isCommunityOwned = item.ownership_type === 'community';
  $: isSaved = $savedItems.some((i) => i.id === item.id);

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

<div class="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden relative">
  
  <!-- Image Container -->
  <div class="relative aspect-video w-full overflow-hidden bg-slate-100">
    <img
      src={item.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600'}
      alt={item.name}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />

    <!-- Category & Ownership Pill -->
    <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
      <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
        {item.category}
      </span>
      {#if isCommunityOwned}
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
          <Landmark class="w-3 h-3" />
          Community
        </span>
      {:else}
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600/90 backdrop-blur-md text-white shadow-sm">
          Personal
        </span>
      {/if}
    </div>

    <!-- Bookmark and Status Badge -->
    <div class="absolute top-3 right-3 flex items-center gap-1.5">
      <button
        type="button"
        on:click={handleToggleSave}
        class="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-ink-primary shadow-sm flex items-center justify-center transition-transform active:scale-90"
        title={isSaved ? 'Hapus dari simpanan' : 'Simpan barang'}
      >
        <Bookmark class="w-3.5 h-3.5 {isSaved ? 'fill-brand-600 text-brand-600' : 'text-stone-500'}" />
      </button>

      {#if item.status === 'available'}
        <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white shadow-sm">
          <CheckCircle2 class="w-3 h-3" />
          Tersedia
        </span>
      {:else if item.status === 'borrowed'}
        <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white shadow-sm">
          <Clock class="w-3 h-3" />
          Dipinjam
        </span>
      {:else}
        <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-500/90 backdrop-blur-md text-white shadow-sm">
          <AlertTriangle class="w-3 h-3" />
          Tidak Tersedia
        </span>
      {/if}
    </div>
  </div>

  <!-- Content Body -->
  <div class="p-5 flex-1 flex flex-col justify-between">
    <div>
      <h3 class="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-1">
        {item.name}
      </h3>
      
      <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
        {item.description || 'Tidak ada deskripsi tambahan.'}
      </p>

      <!-- Meta Info (Owner & Location) -->
      <div class="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div class="flex items-center gap-2">
          {#if isCommunityOwned}
            <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
              🏛️
            </span>
            <span class="font-medium text-emerald-800 truncate max-w-[130px]">
              Aset Komunitas
            </span>
          {:else}
            <img
              src={item.owner?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={item.owner?.full_name || 'Owner'}
              class="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span class="font-medium text-slate-700 truncate max-w-[120px]">
              {item.owner?.full_name || 'Warga'}
            </span>
          {/if}
        </div>

        {#if item.location_hint}
          <div class="flex items-center gap-1 text-slate-400 text-[11px]">
            <MapPin class="w-3 h-3" />
            <span class="truncate max-w-[100px]">{item.location_hint}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Action Button -->
    <div class="mt-4">
      {#if isOwner}
        <div class="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold text-center">
          Barang Milik Anda
        </div>
      {:else if isAvailable}
        <button
          type="button"
          on:click={() => onBorrow(item)}
          class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-brand-500/20 active:scale-[0.98]"
        >
          <span>Ajukan Pinjam</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      {:else}
        <a
          href="/items/{item.id}"
          class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-center"
        >
          <span>Lihat Detail</span>
        </a>
      {/if}
    </div>
  </div>
</div>
