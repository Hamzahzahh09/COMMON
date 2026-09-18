<script lang="ts">
  import { onMount } from 'svelte';
  import { createNeedOffer } from '$lib/api/need-offers.api';
  import { getItems, type Item } from '$lib/api/items.api';
  import { authState } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import { X, Sparkles, AlertCircle, Package, ArrowRight, Check } from 'lucide-svelte';

  export let need: any;
  export let onClose: () => void;
  export let onSuccess: () => void;

  let myItems: Item[] = [];
  let selectedItemId: string = '';
  let message = '';
  let loadingItems = true;
  let submitting = false;
  let errorMsg = '';

  onMount(async () => {
    try {
      const currentUserId = $authState.resident?.id || $authState.user?.id;
      if (!currentUserId) return;

      const res = await getItems({
        community_id: need.community_id,
        owner_id: currentUserId,
      });

      if (res.success && res.data) {
        myItems = res.data;
        if (myItems.length > 0) {
          selectedItemId = myItems[0].id;
        }
      }
    } catch {
      // Ignored
    } finally {
      loadingItems = false;
    }
  });

  async function handleSubmit() {
    errorMsg = '';

    if (!message.trim()) {
      errorMsg = 'Silakan tulis pesan penawaran bantuan atau petunjuk pengambilan.';
      return;
    }

    submitting = true;

    try {
      const res = await createNeedOffer(need.id, {
        item_id: selectedItemId || undefined,
        message: message.trim(),
      });

      if (!res.success) {
        errorMsg = res.error?.message || 'Gagal mengirimkan penawaran.';
        submitting = false;
        return;
      }

      toast.success('Penawaran "I HAVE" berhasil dikirimkan ke pemohon!');
      onSuccess();
      onClose();
    } catch (err: any) {
      errorMsg = err.message || 'Terjadi kesalahan sistem.';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-in fade-in duration-200">
  <div class="bg-white rounded-3xl border border-surface-border max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
    
    <!-- Close Button -->
    <button
      type="button"
      on:click={onClose}
      class="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-muted text-ink-muted transition-colors"
      aria-label="Tutup modal"
    >
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Header -->
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
        <Sparkles class="w-3.5 h-3.5 text-amber-600" />
        I HAVE — Tawarkan Alat Anda
      </div>
      <h2 class="text-xl font-bold text-ink-primary tracking-tight">
        Bantu Kebutuhan Tetangga
      </h2>
      <p class="text-xs text-ink-secondary mt-1">
        Tawarkan alat yang Anda miliki untuk membantu tetangga yang sedang membutuhkan.
      </p>
    </div>

    <!-- Need Preview Box -->
    <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
      <div class="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
        Kebutuhan Warga:
      </div>
      <div class="font-bold text-sm text-ink-primary">
        {need.title}
      </div>
      {#if need.description}
        <p class="text-xs text-ink-secondary leading-relaxed">
          {need.description}
        </p>
      {/if}
      <div class="text-[11px] text-ink-muted flex items-center gap-3 pt-1 border-t border-amber-200/50 font-medium">
        <span>Pemohon: <strong>{need.creator?.full_name || 'Warga'}</strong></span>
        {#if need.needed_from || need.needed_until}
          <span>•</span>
          <span>Target: <strong>{need.needed_from || 'Fleksibel'} s/d {need.needed_until || 'Selesai'}</strong></span>
        {/if}
      </div>
    </div>

    <!-- Error Banner -->
    {#if errorMsg}
      <div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
        <span>{errorMsg}</span>
      </div>
    {/if}

    <!-- Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      
      <!-- Select Item From User Inventory -->
      <div>
        <label for="offer-item-select" class="block text-xs font-bold text-ink-primary mb-1.5">
          Pilih Barang yang Ditawarkan (Opsional)
        </label>

        {#if loadingItems}
          <div class="text-xs text-ink-muted py-2">Memuat daftar barang Anda...</div>
        {:else if myItems.length > 0}
          <select
            id="offer-item-select"
            bind:value={selectedItemId}
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          >
            <option value="">-- Tawarkan bantuan tanpa menghubungkan katalog barang --</option>
            {#each myItems as item}
              <option value={item.id}>
                {item.name} ({item.condition || 'Kondisi Baik'}) • Status: {item.status}
              </option>
            {/each}
          </select>
          <p class="text-[11px] text-ink-muted mt-1">
            Jika pemohon menyetujui, permintaan pinjam otomatis terbuat untuk barang ini.
          </p>
        {:else}
          <div class="p-3 rounded-xl bg-surface-muted text-ink-secondary text-xs">
            Anda belum mendaftarkan barang di komunitas ini, tapi tetap bisa menawarkan bantuan langsung melalui pesan di bawah.
          </div>
        {/if}
      </div>

      <!-- Offer Message & Coordinate -->
      <div>
        <label for="offer-message" class="block text-xs font-bold text-ink-primary mb-1.5">
          Pesan Penawaran & Petunjuk Pengambilan *
        </label>
        <textarea
          id="offer-message"
          bind:value={message}
          required
          rows="3"
          placeholder="Halo tetangga, saya punya alat ini siap pakai lengkap. Bisa diambil di rumah saya RT 05 atau kabari jika ingin diantar."
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"
        ></textarea>
      </div>

      <!-- Submit Buttons -->
      <div class="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          on:click={onClose}
          disabled={submitting}
          class="px-4 py-2.5 rounded-xl border border-surface-border hover:bg-surface-muted text-ink-secondary font-semibold text-xs transition-colors"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={submitting}
          class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
        >
          {#if submitting}
            <span>Mengirimkan Penawaran...</span>
          {:else}
            <span>Kirim Penawaran "I HAVE"</span>
            <ArrowRight class="w-3.5 h-3.5 ml-0.5" />
          {/if}
        </button>
      </div>

    </form>
  </div>
</div>
