<script lang="ts">
  import { onMount } from 'svelte';
  import { getMyRequests, returnItem, cancelRequest, type BorrowingRequest } from '$lib/api/borrowing.api';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import BorrowChatModal from '$lib/components/BorrowChatModal.svelte';
  import { toast } from '$lib/stores/toast';
  import { authState } from '$lib/stores/auth';
  import {
    Clock,
    Calendar,
    Check,
    X,
    RefreshCw,
    AlertCircle,
    RotateCcw,
    MessageSquare,
    MapPin,
    ShieldCheck,
  } from 'lucide-svelte';

  let requests: BorrowingRequest[] = [];
  let loading = true;
  let activeTab: 'all' | 'pending' | 'approved' | 'returned' | 'rejected' = 'all';
  let processingId: string | null = null;
  let chattingRequest: BorrowingRequest | null = null;

  async function loadRequests() {
    loading = true;
    try {
      const res = await getMyRequests();
      if (res.success && res.data) {
        requests = res.data;
      }
    } catch (err) {
      console.error('Failed to load borrowing requests:', err);
    } finally {
      loading = false;
    }
  }

  $: filteredRequests = requests.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return r.status === 'approved' || r.status === 'overdue';
    return r.status === activeTab;
  });

  async function handleReturn(requestId: string) {
    if (!confirm('Apakah Anda sudah selesai menggunakan barang dan mengembalikannya ke pemilik?')) return;
    processingId = requestId;

    try {
      const res = await returnItem(requestId);
      if (res.success) {
        toast.success('Barang berhasil dikonfirmasi kembali! Terima kasih telah merawat inventaris warga.');
        loadRequests();
      } else {
        toast.error(res.error?.message || 'Gagal mengembalikan barang.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      processingId = null;
    }
  }

  async function handleCancel(requestId: string) {
    if (!confirm('Batalkan permohonan pinjam ini?')) return;
    processingId = requestId;

    try {
      const res = await cancelRequest(requestId);
      if (res.success) {
        toast.info('Permohonan pinjam dibatalkan.');
        loadRequests();
      } else {
        toast.error(res.error?.message || 'Gagal membatalkan permohonan.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan.');
    } finally {
      processingId = null;
    }
  }

  let lastResidentId = '';

  $: if ($authState.resident && $authState.resident.id !== lastResidentId) {
    lastResidentId = $authState.resident.id;
    loadRequests();
  }

  onMount(() => {
    loadRequests();
  });
</script>

<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
  
  <!-- Header -->
  <div>
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
      <Clock class="w-3.5 h-3.5 text-brand-600" />
      <span>Riwayat Peminjaman Warga</span>
    </div>
    <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
      Permohonan Pinjam Saya
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary mt-1">
      Pantau status permohonan, koordinasikan serah terima dengan pemilik, dan konfirmasikan pengembalian barang.
    </p>
  </div>

  <!-- Filter Tabs -->
  <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
    {#each [
      { id: 'all', label: 'Semua' },
      { id: 'pending', label: 'Menunggu (Pending)' },
      { id: 'approved', label: 'Disetujui / Aktif' },
      { id: 'returned', label: 'Selesai Dikembalikan' },
      { id: 'rejected', label: 'Ditolak' }
    ] as tab}
      <button
        type="button"
        on:click={() => (activeTab = tab.id as any)}
        class="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap
          {activeTab === tab.id
            ? 'bg-brand-500 text-white font-bold shadow-sm'
            : 'bg-white border border-surface-border text-ink-secondary hover:bg-stone-50'}"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- Requests List -->
  {#if loading}
    <div class="py-24 text-center">
      <RefreshCw class="w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat daftar permohonan pinjam...</p>
    </div>
  {:else if filteredRequests.length === 0}
    <EmptyState
      title="Belum Ada Permohonan Pinjam"
      description="Anda belum mengajukan peminjaman barang di kategori ini. Jelajahi katalog alat di sekitar Anda."
      actionText="Jelajahi Katalog Barang"
      actionHref="/discover"
    />
  {:else}
    <div class="space-y-4">
      {#each filteredRequests as req (req.id)}
        <div class="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-brand-300 transition-colors">
          
          <!-- Left: Item Photo & Info -->
          <div class="flex items-start gap-4">
            <img
              src={req.item?.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200'}
              alt={req.item?.name || 'Item'}
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100 flex-shrink-0 border border-surface-border"
            />
            
            <div class="space-y-1.5 min-w-0">
              <div class="flex items-center gap-2">
                <StatusBadge status={req.status} size="sm" />
                {#if req.item?.category}
                  <span class="text-[10px] text-ink-muted bg-surface-muted px-2 py-0.5 rounded">
                    {req.item.category}
                  </span>
                {/if}
              </div>

              <a href="/items/{req.item_id}" class="block font-bold text-base text-ink-primary hover:text-brand-700 transition-colors truncate">
                {req.item?.name || 'Barang Komunitas'}
              </a>

              <!-- Dates Info -->
              <div class="flex items-center gap-1.5 text-xs text-ink-secondary">
                <Calendar class="w-3.5 h-3.5 text-brand-600" />
                <span>
                  Periode: <strong>{req.start_date}</strong> s/d <strong>{req.end_date}</strong>
                </span>
              </div>

              <!-- Pickup Instructions From Owner -->
              {#if req.pickup_instructions}
                <div class="p-2.5 rounded-xl bg-amber-50/80 text-xs text-amber-900 border border-amber-200 flex items-start gap-2 max-w-xl">
                  <MapPin class="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Petunjuk Pengambilan dari Pemilik:</strong> {req.pickup_instructions}</span>
                </div>
              {/if}

              <!-- Purpose -->
              {#if req.purpose}
                <p class="text-xs text-ink-muted line-clamp-1 italic">
                  Tujuan: "{req.purpose}"
                </p>
              {/if}

              <!-- Return Condition Verified Notice -->
              {#if req.return_condition}
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kondisi Dikembalikan: <strong>{req.return_condition}</strong></span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-wrap items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-surface-border self-end md:self-center">
            
            <!-- Chat & Coordination Button -->
            <button
              type="button"
              on:click={() => (chattingRequest = req)}
              class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-base hover:bg-stone-100 text-ink-primary border border-surface-border transition-colors flex items-center gap-1.5"
              title="Kirim pesan koordinasi ke pemilik"
            >
              <MessageSquare class="w-3.5 h-3.5 text-brand-600" />
              <span>Koordinasi / Chat</span>
            </button>

            {#if req.status === 'approved' || req.status === 'overdue'}
              <button
                type="button"
                on:click={() => handleReturn(req.id)}
                disabled={processingId === req.id}
                class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Kembalikan Barang</span>
              </button>
            {:else if req.status === 'pending'}
              <button
                type="button"
                on:click={() => handleCancel(req.id)}
                disabled={processingId === req.id}
                class="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                Batalkan
              </button>
            {:else if req.status === 'returned'}
              <span class="text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200">
                Telah Dikembalikan
              </span>
            {/if}
          </div>

        </div>
      {/each}
    </div>
  {/if}

</div>

<!-- Chat Coordination Modal -->
{#if chattingRequest}
  <BorrowChatModal
    request={chattingRequest}
    onClose={() => (chattingRequest = null)}
  />
{/if}

