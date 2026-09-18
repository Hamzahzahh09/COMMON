<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getItemById, type Item } from '$lib/api/items.api';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import BorrowModal from '$lib/components/BorrowModal.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { authState } from '$lib/stores/auth';
  import { savedItems, isItemSaved, toggleSaveItem } from '$lib/stores/saved';
  import { toast } from '$lib/stores/toast';
  import {
    MapPin,
    User,
    Calendar,
    Shield,
    ArrowLeft,
    Share2,
    Sparkles,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Bookmark,
    Home,
    Building2,
    Check,
    MessageSquare,
    Clock,
  } from 'lucide-svelte';

  let item: Item | null = null;
  let loading = true;
  let errorMsg = '';
  let showBorrowModal = false;

  $: id = $page.params.id;
  $: isOwner = item?.owner_id === ($authState.resident?.id || $authState.user?.id);
  $: isSaved = item ? isItemSaved(item.id) : false;

  async function loadItem() {
    if (!id) return;
    loading = true;
    errorMsg = '';
    try {
      const res = await getItemById(id);
      if (res.success && res.data) {
        item = res.data;
      } else {
        errorMsg = res.error?.message || 'Barang tidak ditemukan.';
      }
    } catch (err: any) {
      errorMsg = err.message || 'Gagal memuat barang.';
    } finally {
      loading = false;
    }
  }

  function handleToggleBookmark() {
    if (!item) return;
    const nowSaved = toggleSaveItem(item);
    if (nowSaved) {
      toast.success('Disimpan ke daftar Bookmark barang Anda.');
    } else {
      toast.info('Dihapus dari Bookmark.');
    }
  }

  function handleShare() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan barang berhasil disalin ke clipboard!');
    }
  }

  onMount(() => {
    loadItem();
  });
</script>

<div class="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
  
  <!-- Back Button & Actions -->
  <div class="flex items-center justify-between">
    <a
      href="/discover"
      class="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>Kembali ke Discover</span>
    </a>

    {#if item}
      <div class="flex items-center gap-2">
        <button
          type="button"
          on:click={handleToggleBookmark}
          class="p-2 rounded-xl border border-surface-border bg-white hover:bg-stone-50 text-ink-secondary transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={isSaved ? 'Hapus dari Tersimpan' : 'Simpan Barang'}
        >
          <Bookmark class="w-4 h-4 {isSaved ? 'fill-brand-500 text-brand-500' : ''}" />
          <span class="hidden sm:inline">{isSaved ? 'Tersimpan' : 'Simpan'}</span>
        </button>

        <button
          type="button"
          on:click={handleShare}
          class="p-2 rounded-xl border border-surface-border bg-white hover:bg-stone-50 text-ink-secondary transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Bagikan Tautan"
        >
          <Share2 class="w-4 h-4" />
          <span class="hidden sm:inline">Bagikan</span>
        </button>
      </div>
    {/if}
  </div>

  {#if loading}
    <div class="py-24 text-center">
      <RefreshCw class="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat informasi barang...</p>
    </div>
  {:else if errorMsg || !item}
    <EmptyState
      title="Barang Tidak Ditemukan"
      description={errorMsg || 'Barang yang Anda tuju mungkin telah dihapus atau tidak tersedia.'}
      actionText="Eksplorasi Barang Lain"
      actionHref="/discover"
    />
  {:else}
    <div class="space-y-6">

      <!-- ========================================================================= -->
      <!-- MAIN RESOURCE CONTAINER                                                   -->
      <!-- ========================================================================= -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-sm">
        
        <!-- Left Column: Large Image & Community Box -->
        <div class="md:col-span-5 space-y-4">
          <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-surface-border">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800'}
              alt={item.name}
              class="w-full h-full object-cover"
            />
            <div class="absolute top-3 left-3">
              <StatusBadge status={item.status} size="md" />
            </div>
          </div>

          <!-- Community Attribution Box -->
          {#if item.community}
            <div class="p-4 rounded-2xl bg-surface-base border border-surface-border">
              <div class="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                Bagian dari Komunitas
              </div>
              <a
                href="/c/{item.community.slug}"
                class="font-bold text-sm text-brand-600 hover:text-brand-700 mt-1 block"
              >
                c/{item.community.name}
              </a>
              {#if item.community.location}
                <div class="flex items-center gap-1.5 text-xs text-ink-secondary mt-1">
                  <MapPin class="w-3.5 h-3.5 text-stone-400" />
                  <span>{item.community.location}</span>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Right Column: Details, Ownership & Borrow Action -->
        <div class="md:col-span-7 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            
            <!-- Category, Condition & Ownership Badge -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-surface-muted text-ink-primary border border-surface-border">
                {item.category}
              </span>
              {#if item.condition}
                <span class="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-earth-light text-earth-deep border border-earth-sand/50">
                  Kondisi: {item.condition}
                </span>
              {/if}

              {#if item.ownership_type === 'community'}
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Building2 class="w-3.5 h-3.5" />
                  <span>Inventaris Komunitas (RT/RW)</span>
                </span>
              {:else}
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Home class="w-3.5 h-3.5" />
                  <span>Milik Pribadi Warga</span>
                </span>
              {/if}
            </div>

            <!-- Item Name -->
            <h1 class="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              {item.name}
            </h1>

            <!-- Ownership Banner Notice -->
            {#if item.ownership_type === 'community'}
              <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                <Building2 class="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div class="text-xs text-amber-900 leading-relaxed">
                  <strong class="font-bold">Aset Bersama Komunitas:</strong> Barang ini dibeli/dimiliki bersama oleh komunitas. Permintaan pinjam akan ditinjau dan disetujui oleh pengurus/admin RT/RW.
                </div>
              </div>
            {:else}
              <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                <Home class="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div class="text-xs text-emerald-900 leading-relaxed">
                  <strong class="font-bold">Milik Pribadi Tetangga:</strong> Barang ini milik pribadi warga yang sukarela dipinjam-pakaikan. Permintaan pinjam akan dikonfirmasi langsung oleh pemilik.
                </div>
              </div>
            {/if}

            <!-- Description -->
            <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
              {item.description || 'Tidak ada deskripsi rinci untuk barang ini. Barang siap dipinjam pakai untuk kebutuhan bersama warga.'}
            </p>

            <!-- Owner / Custodian Information -->
            <div class="p-4 rounded-2xl border border-surface-border bg-surface-base flex items-center gap-3">
              <img
                src={item.owner?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={item.owner?.full_name || 'Owner'}
                class="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-500/20"
              />
              <div>
                <div class="text-[11px] text-ink-muted">
                  {item.ownership_type === 'community' ? 'Pengelola / Kontak Inventaris' : 'Pemilik Barang'}
                </div>
                <div class="text-xs font-bold text-ink-primary">
                  {item.owner?.full_name || 'Warga Komunitas'}
                  {#if isOwner}
                    <span class="ml-1 text-[10px] font-semibold text-brand-600">(Anda)</span>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Location Hint -->
            {#if item.location_hint}
              <div class="flex items-start gap-2 text-xs text-ink-secondary">
                <MapPin class="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span class="font-bold text-ink-primary">Lokasi Pengambilan:</span>
                  <span class="ml-1">{item.location_hint}</span>
                </div>
              </div>
            {/if}

            <!-- Borrowing Rules -->
            {#if item.borrowing_rules}
              <div class="p-4 rounded-2xl bg-earth-light border border-earth-sand/60 text-xs text-earth-deep space-y-1">
                <div class="font-bold text-ink-primary flex items-center gap-1.5">
                  <Shield class="w-3.5 h-3.5 text-brand-600" />
                  <span>Aturan Pemakaian & Pengembalian</span>
                </div>
                <p class="leading-relaxed">
                  {item.borrowing_rules}
                </p>
              </div>
            {/if}
          </div>

          <!-- Primary Action -->
          <div class="pt-6 border-t border-surface-border">
            {#if isOwner}
              <div class="p-3.5 rounded-xl bg-surface-muted text-ink-secondary text-xs text-center font-medium">
                Ini adalah barang milik Anda di komunitas ini. Pantau permintaan pinjam masuk di menu <a href="/incoming" class="font-bold text-brand-600 underline">Incoming Requests</a>.
              </div>
            {:else if item.status === 'available'}
              <button
                type="button"
                on:click={() => (showBorrowModal = true)}
                class="w-full py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-900/10 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles class="w-4 h-4" />
                <span>REQUEST TO BORROW</span>
              </button>
            {:else if item.status === 'borrowed'}
              <button
                type="button"
                disabled
                class="w-full py-3.5 px-6 rounded-2xl bg-surface-muted text-ink-muted font-bold text-sm cursor-not-allowed text-center"
              >
                CURRENTLY BORROWED
              </button>
            {:else}
              <button
                type="button"
                disabled
                class="w-full py-3.5 px-6 rounded-2xl bg-surface-muted text-ink-muted font-bold text-sm cursor-not-allowed text-center"
              >
                UNAVAILABLE
              </button>
            {/if}
          </div>

        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- COMMON BORROWING LIFECYCLE GUIDE                                          -->
      <!-- ========================================================================= -->
      <div class="bg-surface-base rounded-3xl border border-surface-border p-6 sm:p-7 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Alur & Etika Peminjaman Bersama di COMMON
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-3.5 rounded-2xl bg-white border border-surface-border space-y-1">
            <div class="text-xs font-bold text-brand-600 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-[10px]">1</span>
              <span>Kirim Permintaan</span>
            </div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              Tentukan tanggal mulai dan selesai serta tujuan pemakaian alat dengan sopan.
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-white border border-surface-border space-y-1">
            <div class="text-xs font-bold text-brand-600 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-[10px]">2</span>
              <span>Persetujuan Pemilik</span>
            </div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              Pemilik/pengurus menyetujui dan memberikan petunjuk titik temu pengambilan.
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-white border border-surface-border space-y-1">
            <div class="text-xs font-bold text-brand-600 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-[10px]">3</span>
              <span>Ambil & Koordinasi</span>
            </div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              Ambil tepat waktu dan rawat alat dengan baik layaknya milik sendiri.
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-white border border-surface-border space-y-1">
            <div class="text-xs font-bold text-brand-600 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-[10px]">4</span>
              <span>Kembalikan & Kondisi</span>
            </div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              Kembalikan bersih dan lengkap. Pemilik mengonfirmasi kondisi alat demi reputasi warga.
            </p>
          </div>
        </div>
      </div>

    </div>
  {/if}

</div>

<!-- Borrow Modal Instance -->
{#if showBorrowModal && item}
  <BorrowModal
    {item}
    onClose={() => (showBorrowModal = false)}
    onSuccess={loadItem}
  />
{/if}

