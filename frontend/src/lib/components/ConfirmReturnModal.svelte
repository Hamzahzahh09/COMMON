<script lang="ts">
  import { returnItem, type BorrowingRequest } from '$lib/api/borrowing.api';
  import { toast } from '$lib/stores/toast';
  import { X, CheckCircle2, AlertCircle, HeartHandshake, Sparkles, ShieldCheck } from 'lucide-svelte';

  export let request: BorrowingRequest;
  export let onClose: () => void;
  export let onSuccess: () => void;

  let condition: 'pristine' | 'good' | 'fair' | 'needs_maintenance' = 'good';
  let notes = '';
  let submitting = false;
  let errorMsg = '';

  const CONDITIONS = [
    { value: 'pristine', label: 'Sempurna & Bersih', desc: 'Barang terawat sangat rapi, bersih, dan lengkap seperti baru.' },
    { value: 'good', label: 'Bagus & Berfungsi Normal', desc: 'Barang bekerja dengan baik tanpa cacat fungsional.' },
    { value: 'fair', label: 'Cukup Layak Pakai', desc: 'Terdapat bekas pemakaian wajar, namun tetap aman digunakan.' },
    { value: 'needs_maintenance', label: 'Perlu Perawatan / Pembersihan', desc: 'Perlu dicek kembali oleh pemilik sebelum dipinjamkan berikutnya.' },
  ];

  async function handleConfirmReturn() {
    submitting = true;
    errorMsg = '';

    try {
      const res = await returnItem(request.id, condition, notes.trim() || undefined);
      if (!res.success) {
        errorMsg = res.error?.message || 'Gagal mengonfirmasi pengembalian barang.';
        submitting = false;
        return;
      }

      toast.success('Pengembalian barang berhasil dikonfirmasi! Terima kasih telah menjaga inventaris bersama.');
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
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
        <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
        Konfirmasi Pengembalian
      </div>
      <h2 class="text-xl font-bold text-ink-primary tracking-tight">
        Verifikasi Kondisi Barang
      </h2>
      <p class="text-xs text-ink-secondary mt-1">
        Pastikan barang dikembalikan dalam kondisi aman dan siap digunakan kembali oleh warga lainnya.
      </p>
    </div>

    <!-- Item Preview Box -->
    <div class="p-4 rounded-2xl bg-surface-muted border border-surface-border flex items-center gap-3.5">
      <img
        src={request.item?.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=300'}
        alt={request.item?.name || 'Item'}
        class="w-12 h-12 rounded-xl object-cover ring-1 ring-surface-border flex-shrink-0"
      />
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-ink-primary truncate">
          {request.item?.name || 'Barang Inventaris'}
        </h4>
        <p class="text-[11px] text-ink-secondary truncate">
          Masa pinjam: {request.start_date} s/d {request.end_date}
        </p>
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
    <form on:submit|preventDefault={handleConfirmReturn} class="space-y-4">
      
      <!-- Condition Selector -->
      <div>
        <span class="block text-xs font-bold text-ink-primary mb-2">
          Kondisi Barang Saat Dikembalikan *
        </span>
        <div class="space-y-2">
          {#each CONDITIONS as cond}
            <label
              class="flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all
                {condition === cond.value ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10' : 'border-surface-border hover:bg-surface-muted'}"
            >
              <input
                type="radio"
                name="return_condition"
                value={cond.value}
                bind:group={condition}
                class="mt-1 text-brand-600 focus:ring-brand-500"
              />
              <div class="text-xs">
                <div class="font-bold text-ink-primary">{cond.label}</div>
                <div class="text-[11px] text-ink-secondary mt-0.5 leading-snug">{cond.desc}</div>
              </div>
            </label>
          {/each}
        </div>
      </div>

      <!-- Notes / Thank You Message -->
      <div>
        <label for="return-notes" class="block text-xs font-bold text-ink-primary mb-1.5">
          Catatan Tambahan & Ucapan Terima Kasih (Opsional)
        </label>
        <textarea
          id="return-notes"
          bind:value={notes}
          rows="2"
          placeholder="Barang sangat membantu untuk acara kami, sudah dibersihkan dan kelengkapan lengkap. Terima kasih banyak tetangga!"
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
          class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>{submitting ? 'Menyimpan...' : 'Konfirmasi Pengembalian'}</span>
        </button>
      </div>

    </form>
  </div>
</div>
