<script lang="ts">
  import { onMount } from 'svelte';
  import { createItem } from '$lib/api/items.api';
  import { getMyCommunities, type Community } from '$lib/api/communities.api';
  import { toast } from '$lib/stores/toast';
  import { authState } from '$lib/stores/auth';
  import { X, Plus, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-svelte';

  export let onClose: () => void;
  export let onSuccess: (itemId?: string) => void;

  let name = '';
  let category = 'Tools';
  let condition = 'Sangat Bagus';
  let locationHint = '';
  let description = '';
  let borrowingRules = 'Harap dikembalikan dalam keadaan bersih dan lengkap.';
  let imageUrl = '';
  let ownershipType: 'personal' | 'community' = 'personal';
  let selectedCommunityId = '';
  let joinedCommunities: Community[] = [];
  let loadingCommunities = true;
  let submitting = false;
  let errorMsg = '';

  const CATEGORIES = ['Tools', 'Home', 'Events', 'Outdoor', 'Electronics'];
  const CONDITIONS = ['Seperti Baru', 'Sangat Bagus', 'Bagus', 'Cukup Layak'];

  // Curated helpful placeholder image per category
  const SAMPLE_IMAGES: Record<string, string> = {
    Tools: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80',
    Home: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    Events: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
    Outdoor: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80',
    Electronics: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  };

  onMount(async () => {
    try {
      const res = await getMyCommunities();
      if (res.success && res.data) {
        joinedCommunities = res.data;
        if (joinedCommunities.length > 0) {
          selectedCommunityId = joinedCommunities[0].id;
        }
      }
    } catch {
      // Fallback
    } finally {
      loadingCommunities = false;
    }
  });

  function useCategoryPlaceholder() {
    imageUrl = SAMPLE_IMAGES[category] || SAMPLE_IMAGES.Tools;
  }

  async function handleSubmit() {
    errorMsg = '';

    if (!name.trim()) {
      errorMsg = 'Silakan masukkan nama barang.';
      return;
    }

    if (!selectedCommunityId) {
      errorMsg = 'Silakan pilih komunitas tempat barang ini akan dibagikan.';
      return;
    }

    submitting = true;

    try {
      const finalImage = imageUrl.trim() || SAMPLE_IMAGES[category] || SAMPLE_IMAGES.Tools;

      const res = await createItem({
        community_id: selectedCommunityId,
        name: name.trim(),
        category,
        condition,
        ownership_type: ownershipType,
        location_hint: locationHint.trim() || undefined,
        description: description.trim() || undefined,
        borrowing_rules: borrowingRules.trim() || undefined,
        image_url: finalImage,
      });

      if (!res.success) {
        errorMsg = res.error?.message || 'Gagal menambahkan barang.';
        submitting = false;
        return;
      }

      toast.success(`Barang "${name}" berhasil didaftarkan!`);
      onSuccess(res.data?.id);
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
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
        <Sparkles class="w-3.5 h-3.5 text-brand-500" />
        Inventaris Bersama
      </div>
      <h2 class="text-xl font-bold text-ink-primary tracking-tight">
        Bagikan Barang ke Komunitas
      </h2>
      <p class="text-xs text-ink-secondary mt-1">
        Jadikan alat yang jarang Anda pakai bermanfaat untuk tetangga sekitar.
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
        <label for="share-community" class="block text-xs font-bold text-ink-primary mb-1.5">
          Pilih Komunitas *
        </label>
        {#if loadingCommunities}
          <div class="text-xs text-ink-muted py-2">Memuat daftar komunitas Anda...</div>
        {:else if joinedCommunities.length === 0}
          <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            Anda belum bergabung dengan komunitas apapun. Silakan bergabung dengan komunitas terlebih dahulu untuk membagikan barang.
          </div>
        {:else}
          <select
            id="share-community"
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

      <!-- Ownership Model Selection (Section 5) -->
      <div>
        <span class="block text-xs font-bold text-ink-primary mb-1.5">
          Model Kepemilikan Barang *
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            on:click={() => (ownershipType = 'personal')}
            class="p-3 rounded-2xl border text-left transition-all {ownershipType === 'personal' ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10' : 'border-surface-border hover:bg-surface-muted'}"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-sm">🏠</span>
              <span class="text-xs font-bold text-ink-primary">Personal Resource</span>
            </div>
            <p class="text-[11px] text-ink-secondary mt-1 leading-snug">
              Milik pribadi Anda. Setiap permintaan pinjam ditinjau dan disetujui oleh Anda sendiri.
            </p>
          </button>

          <button
            type="button"
            on:click={() => (ownershipType = 'community')}
            class="p-3 rounded-2xl border text-left transition-all {ownershipType === 'community' ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/10' : 'border-surface-border hover:bg-surface-muted'}"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-sm">🏛️</span>
              <span class="text-xs font-bold text-ink-primary">Community Resource</span>
            </div>
            <p class="text-[11px] text-ink-secondary mt-1 leading-snug">
              Aset bersama komunitas. Permintaan pinjam dapat disetujui bersama oleh admin komunitas.
            </p>
          </button>
        </div>
      </div>

      <!-- Item Name -->
      <div>
        <label for="share-name" class="block text-xs font-bold text-ink-primary mb-1.5">Nama Barang *</label>
        <input
          id="share-name"
          type="text"
          bind:value={name}
          required
          placeholder="Contoh: Bor Listrik Bosch 650W, Tangga Lipat 4M..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"
        />
      </div>

      <!-- Category & Condition -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label for="share-category" class="block text-xs font-bold text-ink-primary mb-1.5">Kategori</label>
          <select
            id="share-category"
            bind:value={category}
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          >
            {#each CATEGORIES as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="share-condition" class="block text-xs font-bold text-ink-primary mb-1.5">Kondisi</label>
          <select
            id="share-condition"
            bind:value={condition}
            class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
          >
            {#each CONDITIONS as cond}
              <option value={cond}>{cond}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Location Hint -->
      <div>
        <label for="share-location" class="block text-xs font-bold text-ink-primary mb-1.5">Petunjuk Lokasi Pengambilan</label>
        <input
          id="share-location"
          type="text"
          bind:value={locationHint}
          placeholder="Contoh: Blok B3 No. 7 atau Pos Satpam Utama"
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"
        />
      </div>

      <!-- Description -->
      <div>
        <label for="share-description" class="block text-xs font-bold text-ink-primary mb-1.5">Deskripsi / Kelengkapan</label>
        <textarea
          id="share-description"
          bind:value={description}
          rows="2"
          placeholder="Deskripsikan fungsi barang, kelengkapan mata bor/kabel, dll..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted resize-none"
        ></textarea>
      </div>

      <!-- Borrowing Rules -->
      <div>
        <label for="share-rules" class="block text-xs font-bold text-ink-primary mb-1.5">Aturan Peminjaman</label>
        <input
          id="share-rules"
          type="text"
          bind:value={borrowingRules}
          placeholder="Contoh: Maksimal 3 hari, bersihkan setelah dipakai..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
        />
      </div>

      <!-- Image URL & Quick sample button -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label for="share-image" class="block text-xs font-bold text-ink-primary">URL Foto Barang (Opsional)</label>
          <button
            type="button"
            on:click={useCategoryPlaceholder}
            class="text-[11px] text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            <ImageIcon class="w-3 h-3" />
            Gunakan Foto Contoh
          </button>
        </div>
        <input
          id="share-image"
          type="url"
          bind:value={imageUrl}
          placeholder="https://images.unsplash.com/..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"
        />
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
            <span>Menyimpan...</span>
          {:else}
            <Plus class="w-4 h-4 stroke-[2.5]" />
            <span>Bagikan Sekarang</span>
          {/if}
        </button>
      </div>
    </form>

  </div>
</div>
