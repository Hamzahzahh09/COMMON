<script lang="ts">
  import { onMount } from 'svelte';
  import { createNeed } from '$lib/api/needs.api';
  import { getMyCommunities, type Community } from '$lib/api/communities.api';
  import { toast } from '$lib/stores/toast';
  import { X, Sparkles, AlertCircle, HeartHandshake } from 'lucide-svelte';

  export let initialCommunityId: string = '';
  export let onClose: () => void;
  export let onSuccess: () => void;

  let title = '';
  let description = '';
  let neededFrom = '';
  let neededUntil = '';
  let selectedCommunityId = initialCommunityId;
  let joinedCommunities: Community[] = [];
  let loadingCommunities = true;
  let submitting = false;
  let errorMsg = '';

  onMount(async () => {
    try {
      const res = await getMyCommunities();
      if (res.success && res.data) {
        joinedCommunities = res.data;
        if (!selectedCommunityId && joinedCommunities.length > 0) {
          selectedCommunityId = joinedCommunities[0].id;
        }
      }
    } catch {
      // Fallback
    } finally {
      loadingCommunities = false;
    }
  });

  async function handleSubmit() {
    errorMsg = '';

    if (!title.trim()) {
      errorMsg = 'Silakan sebutkan alat atau barang yang sedang dibutuhkan.';
      return;
    }

    if (!selectedCommunityId) {
      errorMsg = 'Silakan pilih komunitas tempat kebutuhan ini disampaikan.';
      return;
    }

    submitting = true;

    try {
      const res = await createNeed({
        community_id: selectedCommunityId,
        title: title.trim(),
        description: description.trim() || undefined,
        needed_from: neededFrom || undefined,
        needed_until: neededUntil || undefined,
      });

      if (!res.success) {
        errorMsg = res.error?.message || 'Gagal memposting kebutuhan.';
        submitting = false;
        return;
      }

      toast.success('Kebutuhan komunitas berhasil dipublikasikan!');
      onSuccess();
      onClose();
    } catch (err: any) {
      errorMsg = err.message || 'Terjadi kesalahan.';
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
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
        <HeartHandshake class="w-3.5 h-3.5 text-brand-500" />
        Papan Kebutuhan Warga
      </div>
      <h2 class="text-xl font-bold text-ink-primary tracking-tight">
        Sampaikan Kebutuhan Alat
      </h2>
      <p class="text-xs text-ink-secondary mt-1">
        Beri tahu tetangga alat apa yang sedang Anda cari sebelum memutuskan membeli baru.
      </p>
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
      <!-- Target Community -->
      <div>
        <label for="need-community" class="block text-xs font-bold text-ink-primary mb-1.5">
          Komunitas Dituju *
        </label>
        {#if loadingCommunities}
          <div class="text-xs text-ink-muted py-2">Memuat daftar komunitas...</div>
        {:else if joinedCommunities.length === 0}
          <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            Anda belum bergabung dengan komunitas apapun. Silakan gabung komunitas terlebih dahulu.
          </div>
        {:else}
          <select
            id="need-community"
            bind:value={selectedCommunityId}
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          >
            {#each joinedCommunities as comm}
              <option value={comm.id}>{comm.name} (c/{comm.slug})</option>
            {/each}
          </select>
        {/if}
      </div>

      <!-- Title -->
      <div>
        <label for="need-title" class="block text-xs font-bold text-ink-primary mb-1.5">
          Alat / Sumber Daya yang Dibutuhkan *
        </label>
        <input
          id="need-title"
          type="text"
          bind:value={title}
          required
          placeholder="Contoh: Butuh Mesin Pemotong Rumput untuk Kerja Bakti Hari Minggu"
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"
        />
      </div>

      <!-- Dates Needed -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label for="need-start-date" class="block text-xs font-bold text-ink-primary mb-1.5">Dibutuhkan Mulai</label>
          <input
            id="need-start-date"
            type="date"
            bind:value={neededFrom}
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          />
        </div>
        <div>
          <label for="need-end-date" class="block text-xs font-bold text-ink-primary mb-1.5">Hingga Tanggal</label>
          <input
            id="need-end-date"
            type="date"
            bind:value={neededUntil}
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label for="need-description" class="block text-xs font-bold text-ink-primary mb-1.5">
          Keterangan / Rencana Penggunaan
        </label>
        <textarea
          id="need-description"
          bind:value={description}
          rows="3"
          placeholder="Jelaskan kebutuhan Anda agar tetangga yang memiliki alat tersebut dapat meminjamkan..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted resize-none"
        ></textarea>
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
          disabled={submitting || joinedCommunities.length === 0}
          class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          {#if submitting}
            <span class="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Memposting...</span>
          {:else}
            <Sparkles class="w-4 h-4 stroke-[2]" />
            <span>Publikasikan Kebutuhan</span>
          {/if}
        </button>
      </div>
    </form>

  </div>
</div>
