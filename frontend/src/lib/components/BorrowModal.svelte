<script lang="ts">
  import type { Item } from '$lib/api/items.api';
  import { requestBorrow } from '$lib/api/borrowing.api';
  import { toast } from '$lib/stores/toast';
  import { authState } from '$lib/stores/auth';
  import { X, Calendar, MessageSquare, AlertCircle, Sparkles } from 'lucide-svelte';

  export let item: Item;
  export let onClose: () => void;
  export let onSuccess: () => void;

  // Defaults: tomorrow to 3 days later
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];

  const defaultEndObj = new Date(tomorrow);
  defaultEndObj.setDate(defaultEndObj.getDate() + 2);
  const defaultEnd = defaultEndObj.toISOString().split('T')[0];

  let startDate = defaultStart;
  let endDate = defaultEnd;
  let purpose = '';
  let submitting = false;
  let errorMsg = '';

  $: isOwnItem = item.owner_id === ($authState.resident?.id || $authState.user?.id);

  // Calculate day difference
  $: daysCount = (() => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  })();

  async function handleSubmit() {
    errorMsg = '';

    if (!startDate || !endDate) {
      errorMsg = 'Silakan pilih tanggal mulai dan selesai pinjam.';
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      errorMsg = 'Tanggal mulai tidak boleh melebihi tanggal selesai pinjam.';
      return;
    }

    if (isOwnItem) {
      errorMsg = 'Anda tidak dapat meminjam barang yang Anda miliki sendiri.';
      return;
    }

    submitting = true;

    try {
      const res = await requestBorrow({
        item_id: item.id,
        start_date: startDate,
        end_date: endDate,
        purpose: purpose.trim() || undefined,
      });

      if (!res.success) {
        errorMsg = res.error?.message || 'Gagal mengajukan pinjaman.';
        submitting = false;
        return;
      }

      toast.success(
        item.ownership_type === 'community'
          ? `Permintaan pinjam untuk "${item.name}" berhasil dikirim ke pengurus komunitas!`
          : `Permintaan pinjam untuk "${item.name}" berhasil dikirim ke pemilik!`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      errorMsg = err.message || 'Terjadi kesalahan saat mengajukan pinjaman.';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-in fade-in duration-200">
  <div class="bg-white rounded-3xl border border-surface-border max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
    
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
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
        <Sparkles class="w-3.5 h-3.5 text-brand-500" />
        {#if item.ownership_type === 'community'}
          🏛️ Pinjam Inventaris Komunitas
        {:else}
          🏠 Pinjam dari Tetangga
        {/if}
      </div>
      <h2 class="text-xl font-bold text-ink-primary tracking-tight">
        Ajukan Pinjam {item.name}
      </h2>
      <p class="text-xs text-ink-secondary mt-1">
        {#if item.ownership_type === 'community'}
          Status: <strong class="text-emerald-800 font-semibold">Aset Komunitas ({item.community?.name || 'Komunitas'})</strong> • Ditinjau oleh Pengurus
        {:else}
          Pemilik barang: <strong class="text-ink-primary font-semibold">{item.owner?.full_name || 'Warga Komunitas'}</strong> • Ditinjau oleh Pemilik Langsung
        {/if}
      </p>
    </div>

    <!-- Borrowing Rules Notice -->
    {#if item.borrowing_rules}
      <div class="p-3.5 rounded-2xl bg-earth-light border border-earth-sand/50 text-xs text-earth-deep leading-relaxed">
        <span class="font-bold text-ink-primary">Aturan Pemilik:</span> {item.borrowing_rules}
      </div>
    {/if}

    <!-- Self-borrowing warning -->
    {#if isOwnItem}
      <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
        <span>Anda adalah pemilik barang ini. Anda tidak dapat mengajukan pinjam ke diri sendiri.</span>
      </div>
    {/if}

    <!-- Error Banner -->
    {#if errorMsg}
      <div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
        <span>{errorMsg}</span>
      </div>
    {/if}

    <!-- Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <!-- Dates -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5 text-brand-600" />
            Tanggal Mulai *
          </label>
          <input
            type="date"
            bind:value={startDate}
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5 text-brand-600" />
            Tanggal Selesai *
          </label>
          <input
            type="date"
            bind:value={endDate}
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          />
        </div>
      </div>

      <!-- Duration Summary -->
      {#if daysCount > 0}
        <div class="text-[11px] font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 flex items-center justify-between">
          <span>Durasi Peminjaman:</span>
          <span>{daysCount} Hari</span>
        </div>
      {/if}

      <!-- Purpose / Note to owner -->
      <div>
        <label class="block text-xs font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">
          <MessageSquare class="w-3.5 h-3.5 text-brand-600" />
          Rencana Penggunaan (Opsional)
        </label>
        <textarea
          bind:value={purpose}
          rows="3"
          placeholder="Contoh: Untuk pasang rak dinding di ruang tamu, atau perbaikan pagar rumah..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted resize-none"
        ></textarea>
        <p class="text-[10px] text-ink-muted mt-1">
          Pesan ini membantu pemilik mengetahui kebutuhan penggunaan barang.
        </p>
      </div>

      <!-- Submit Actions -->
      <div class="pt-3 border-t border-surface-border flex items-center justify-end gap-3">
        <button
          type="button"
          on:click={onClose}
          class="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-surface-muted transition-colors"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={submitting || isOwnItem}
          class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          {#if submitting}
            <span class="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Mengirim...</span>
          {:else}
            <span>Kirim Permintaan Pinjam</span>
          {/if}
        </button>
      </div>
    </form>

  </div>
</div>
