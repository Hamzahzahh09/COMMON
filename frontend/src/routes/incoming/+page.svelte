<script lang="ts">
  import { onMount } from 'svelte';
  import { getIncomingRequests, approveRequest, rejectRequest, type BorrowingRequest } from '$lib/api/borrowing.api';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import ConfirmReturnModal from '$lib/components/ConfirmReturnModal.svelte';
  import BorrowChatModal from '$lib/components/BorrowChatModal.svelte';
  import { toast } from '$lib/stores/toast';
  import { authState } from '$lib/stores/auth';
  import {
    Inbox,
    Calendar,
    User,
    Check,
    X,
    RefreshCw,
    AlertCircle,
    MessageSquare,
    CheckCircle2,
    RotateCcw,
    MapPin,
    ShieldCheck,
  } from 'lucide-svelte';

  let requests: BorrowingRequest[] = [];
  let loading = true;
  let processingId: string | null = null;

  // Modals state
  let chattingRequest: BorrowingRequest | null = null;
  let returningRequest: BorrowingRequest | null = null;
  let approvingRequest: BorrowingRequest | null = null;
  let pickupInstructionsInput = '';

  async function loadIncoming() {
    loading = true;
    try {
      const res = await getIncomingRequests();
      if (res.success && res.data) {
        requests = res.data;
      }
    } catch (err) {
      console.error('Failed to load incoming requests:', err);
    } finally {
      loading = false;
    }
  }

  function openApproveModal(req: BorrowingRequest) {
    approvingRequest = req;
    pickupInstructionsInput = req.item?.location_hint || '';
  }

  async function handleConfirmApprove() {
    if (!approvingRequest) return;
    const reqId = approvingRequest.id;
    processingId = reqId;

    try {
      const res = await approveRequest(reqId, pickupInstructionsInput.trim() || undefined);
      if (res.success) {
        toast.success('Permintaan pinjam disetujui! Petunjuk pengambilan telah disampaikan ke peminjam.');
        approvingRequest = null;
        loadIncoming();
      } else {
        toast.error(res.error?.message || 'Gagal menyetujui permintaan.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      processingId = null;
    }
  }

  async function handleReject(requestId: string) {
    const reason = prompt('Masukkan alasan penolakan (opsional):') || undefined;
    processingId = requestId;

    try {
      const res = await rejectRequest(requestId, reason);
      if (res.success) {
        toast.info('Permintaan pinjam ditolak.');
        loadIncoming();
      } else {
        toast.error(res.error?.message || 'Gagal menolak permintaan.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      processingId = null;
    }
  }

  let lastResidentId = '';

  $: if ($authState.resident && $authState.resident.id !== lastResidentId) {
    lastResidentId = $authState.resident.id;
    loadIncoming();
  }

  onMount(() => {
    loadIncoming();
  });
</script>

<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
  
  <!-- Header -->
  <div>
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
      <Inbox class="w-3.5 h-3.5 text-brand-600" />
      <span>Inbox Pemilik & Pengurus Inventaris</span>
    </div>
    <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
      Permintaan Pinjam Masuk dari Warga
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary mt-1">
      Tinjau tetangga yang ingin meminjam alat milik Anda, berikan petunjuk pengambilan, dan konfirmasi kondisi barang saat dikembalikan.
    </p>
  </div>

  {#if loading}
    <div class="py-24 text-center">
      <RefreshCw class="w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" />
      <p class="text-xs font-semibold text-ink-secondary">Memuat permintaan masuk...</p>
    </div>
  {:else if requests.length === 0}
    <EmptyState
      title="Tidak Ada Permintaan Masuk"
      description="Saat ini belum ada tetangga yang mengajukan pinjaman untuk barang milik Anda."
    />
  {:else}
    <div class="space-y-4">
      {#each requests as req (req.id)}
        <div class="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-brand-300 transition-colors">
          
          <!-- Left: Requester & Item Info -->
          <div class="flex items-start gap-4">
            <img
              src={req.requester?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={req.requester?.full_name || 'Requester'}
              class="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/20 flex-shrink-0"
            />

            <div class="space-y-1.5 min-w-0">
              <div class="flex items-center gap-2">
                <StatusBadge status={req.status} size="sm" />
                <span class="text-xs font-bold text-ink-primary">
                  {req.requester?.full_name || 'Warga'}
                </span>
                <span class="text-xs text-ink-muted">mengajukan pinjaman</span>
              </div>

              <!-- Item Link -->
              <a href="/items/{req.item_id}" class="font-extrabold text-base text-brand-700 hover:underline block truncate">
                {req.item?.name || 'Barang Anda'}
              </a>

              <!-- Dates Info -->
              <div class="flex items-center gap-1.5 text-xs text-ink-secondary">
                <Calendar class="w-3.5 h-3.5 text-stone-400" />
                <span>
                  Periode: <strong>{req.start_date}</strong> s/d <strong>{req.end_date}</strong>
                </span>
              </div>

              <!-- Purpose Note -->
              {#if req.purpose}
                <div class="p-2.5 rounded-xl bg-surface-base text-xs text-ink-secondary border border-surface-border flex items-start gap-2 max-w-xl">
                  <MessageSquare class="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span class="italic leading-relaxed">"{req.purpose}"</span>
                </div>
              {/if}

              <!-- Pickup Instructions Preview -->
              {#if req.pickup_instructions}
                <div class="p-2.5 rounded-xl bg-amber-50/70 text-xs text-amber-900 border border-amber-200/80 flex items-start gap-2 max-w-xl">
                  <MapPin class="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Petunjuk Titik Temu:</strong> {req.pickup_instructions}</span>
                </div>
              {/if}

              <!-- Return Condition Verified Notice -->
              {#if req.return_condition}
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kondisi Saat Kembali: <strong>{req.return_condition}</strong></span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-surface-border self-end md:self-center">
            
            <!-- Chat & Coordination Button -->
            <button
              type="button"
              on:click={() => (chattingRequest = req)}
              class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-base hover:bg-stone-100 text-ink-primary border border-surface-border transition-colors flex items-center gap-1.5"
              title="Kirim pesan koordinasi"
            >
              <MessageSquare class="w-3.5 h-3.5 text-brand-600" />
              <span>Chat Warga</span>
            </button>

            {#if req.status === 'pending'}
              <button
                type="button"
                on:click={() => openApproveModal(req)}
                disabled={processingId === req.id}
                class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Setujui (Approve)</span>
              </button>

              <button
                type="button"
                on:click={() => handleReject(req.id)}
                disabled={processingId === req.id}
                class="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                Tolak
              </button>
            {:else if req.status === 'approved' || req.status === 'overdue'}
              <button
                type="button"
                on:click={() => (returningRequest = req)}
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>Konfirmasi Kembali & Cek Kondisi</span>
              </button>
            {:else if req.status === 'returned'}
              <span class="text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200">
                Selesai Dikembalikan
              </span>
            {:else if req.status === 'rejected'}
              <span class="text-xs text-rose-500 font-medium px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-200">
                Permintaan Ditolak
              </span>
            {/if}
          </div>

        </div>
      {/each}
    </div>
  {/if}

</div>

<!-- Approve With Instructions Modal -->
{#if approvingRequest}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl border border-surface-border max-w-md w-full p-6 space-y-5 shadow-xl">
      <div class="flex items-center justify-between pb-3 border-b border-surface-border">
        <div>
          <h3 class="font-bold text-base text-ink-primary">Setujui Peminjaman</h3>
          <p class="text-xs text-ink-secondary mt-0.5">Alat: {approvingRequest.item?.name}</p>
        </div>
        <button
          type="button"
          on:click={() => (approvingRequest = null)}
          class="p-1.5 rounded-full text-ink-muted hover:text-ink-primary hover:bg-surface-muted transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="space-y-3">
        <label for="pickup-instructions" class="block text-xs font-bold text-ink-primary">
          Petunjuk Titik Temu / Pengambilan (Opsional)
        </label>
        <textarea
          id="pickup-instructions"
          bind:value={pickupInstructionsInput}
          rows="3"
          placeholder="Contoh: Ambil di teras depan No. 12 sore ini jam 17:00, bel rumah bila sudah sampai."
          class="w-full text-xs p-3 rounded-xl border border-surface-border focus:border-brand-500 focus:outline-none bg-surface-base"
        ></textarea>
        <p class="text-[11px] text-ink-muted">
          Instruksi ini akan langsung muncul di halaman peminjam untuk mempermudah serah terima barang.
        </p>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
        <button
          type="button"
          on:click={() => (approvingRequest = null)}
          class="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-surface-muted"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={handleConfirmApprove}
          disabled={processingId === approvingRequest.id}
          class="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          {#if processingId === approvingRequest.id}
            <span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Memproses...</span>
          {:else}
            <Check class="w-3.5 h-3.5" />
            <span>Setujui Sekarang</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Return Condition Verification Modal -->
{#if returningRequest}
  <ConfirmReturnModal
    request={returningRequest}
    onClose={() => (returningRequest = null)}
    onSuccess={() => {
      returningRequest = null;
      loadIncoming();
    }}
  />
{/if}

<!-- Chat Coordination Modal -->
{#if chattingRequest}
  <BorrowChatModal
    request={chattingRequest}
    onClose={() => (chattingRequest = null)}
  />
{/if}

