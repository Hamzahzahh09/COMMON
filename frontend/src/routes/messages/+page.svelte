<script lang="ts">
  import { onMount } from 'svelte';
  import { getMyRequests, getIncomingRequests, type BorrowingRequest } from '$lib/api/borrowing.api';
  import { authState } from '$lib/stores/auth';
  import BorrowChatModal from '$lib/components/BorrowChatModal.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { MessageSquare, Calendar, User, Clock, RefreshCw, ArrowRight } from 'lucide-svelte';

  let myRequests: BorrowingRequest[] = [];
  let incomingRequests: BorrowingRequest[] = [];
  let activeTab: 'all' | 'my-borrows' | 'my-items' = 'all';
  let loading = true;
  let activeChatRequest: BorrowingRequest | null = null;

  async function loadData() {
    loading = true;
    try {
      const [myRes, incRes] = await Promise.all([
        getMyRequests(),
        getIncomingRequests(),
      ]);

      if (myRes.success && myRes.data) myRequests = myRes.data;
      if (incRes.success && incRes.data) incomingRequests = incRes.data;
    } catch {
      // Ignored
    } finally {
      loading = false;
    }
  }

  $: allThreads = [
    ...myRequests.map((r) => ({ ...r, role: 'borrower' })),
    ...incomingRequests.map((r) => ({ ...r, role: 'owner' })),
  ].filter((t) => {
    if (activeTab === 'my-borrows') return t.role === 'borrower';
    if (activeTab === 'my-items') return t.role === 'owner';
    return true;
  });

  onMount(() => {
    loadData();
  });
</script>

<svelte:head>
  <title>Pesan & Koordinasi — COMMON</title>
</svelte:head>

<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
  
  <!-- Header -->
  <div>
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
      <MessageSquare class="w-3.5 h-3.5 text-brand-500" />
      Komunikasi & Koordinasi
    </div>
    <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
      Pesan Antar Warga
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary mt-1">
      Koordinasikan jadwal pengambilan, titik temu, dan kondisi barang langsung dengan tetangga.
    </p>
  </div>

  <!-- Filter Tabs -->
  <div class="inline-flex p-1 rounded-2xl bg-surface-muted border border-surface-border text-xs font-semibold">
    <button
      type="button"
      on:click={() => (activeTab = 'all')}
      class="px-4 py-2 rounded-xl transition-all
        {activeTab === 'all' ? 'bg-white text-ink-primary shadow-sm font-bold' : 'text-ink-secondary hover:text-ink-primary'}"
    >
      Semua Percakapan ({myRequests.length + incomingRequests.length})
    </button>
    <button
      type="button"
      on:click={() => (activeTab = 'my-borrows')}
      class="px-4 py-2 rounded-xl transition-all
        {activeTab === 'my-borrows' ? 'bg-white text-ink-primary shadow-sm font-bold' : 'text-ink-secondary hover:text-ink-primary'}"
    >
      Barang yang Saya Pinjam ({myRequests.length})
    </button>
    <button
      type="button"
      on:click={() => (activeTab = 'my-items')}
      class="px-4 py-2 rounded-xl transition-all
        {activeTab === 'my-items' ? 'bg-white text-ink-primary shadow-sm font-bold' : 'text-ink-secondary hover:text-ink-primary'}"
    >
      Barang Milik Saya ({incomingRequests.length})
    </button>
  </div>

  {#if loading}
    <div class="py-24 text-center">
      <RefreshCw class="w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat daftar koordinasi...</p>
    </div>
  {:else if allThreads.length === 0}
    <EmptyState
      title="Belum Ada Pesan Koordinasi"
      description="Pesan koordinasi akan otomatis muncul saat Anda mengajukan pinjaman atau menerima permintaan dari tetangga."
      actionText="Eksplorasi Barang"
      actionHref="/discover"
    />
  {:else}
    <div class="space-y-3">
      {#each allThreads as thread (thread.id + thread.role)}
        <div class="bg-white rounded-2xl border border-surface-border p-5 shadow-sm hover:border-brand-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start sm:items-center gap-4">
            <img
              src={thread.item?.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200'}
              alt={thread.item?.name}
              class="w-14 h-14 rounded-2xl object-cover ring-1 ring-surface-border flex-shrink-0"
            />
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-bold text-sm sm:text-base text-ink-primary">
                  {thread.item?.name}
                </h3>
                <StatusBadge status={thread.status} size="sm" />
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full {thread.role === 'owner' ? 'bg-purple-50 text-purple-800' : 'bg-blue-50 text-blue-800'}">
                  {thread.role === 'owner' ? 'Barang Anda' : 'Anda Meminjam'}
                </span>
              </div>
              <p class="text-xs text-ink-secondary flex items-center gap-2">
                <span>{thread.role === 'owner' ? `Pemohon: ${thread.requester?.full_name || 'Warga'}` : `Pemilik: ${thread.item?.owner?.full_name || 'Warga'}`}</span>
                <span>•</span>
                <span>{thread.start_date} s/d {thread.end_date}</span>
              </p>
              {#if thread.pickup_instructions}
                <p class="text-[11px] text-brand-700 font-medium">
                  Petunjuk: {thread.pickup_instructions}
                </p>
              {/if}
            </div>
          </div>

          <button
            type="button"
            on:click={() => (activeChatRequest = thread)}
            class="px-4 py-2.5 rounded-xl bg-surface-muted hover:bg-brand-50 text-ink-primary hover:text-brand-700 font-bold text-xs border border-surface-border transition-colors flex items-center justify-center gap-1.5 self-end sm:self-auto"
          >
            <MessageSquare class="w-3.5 h-3.5" />
            <span>Buka Pesan</span>
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Chat Drawer/Modal -->
  {#if activeChatRequest}
    <BorrowChatModal
      request={activeChatRequest}
      onClose={() => (activeChatRequest = null)}
    />
  {/if}

</div>
