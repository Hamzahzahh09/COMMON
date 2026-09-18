<script lang="ts">
  import { apiRequest } from '../api';
  import { activeCommunity } from '../stores/auth';
  import { toast } from '../stores/toast';
  import { X, Plus, AlertCircle, Sparkles } from 'lucide-svelte';

  export let isOpen = false;
  export let onClose: () => void = () => {};
  export let onSuccess: () => void = () => {};

  let name = '';
  let category = 'Tools';
  let condition = 'Excellent';
  let locationHint = '';
  let borrowingRules = '';
  let description = '';
  let imageUrl = '';
  let submitting = false;
  let errorMsg = '';

  const CATEGORIES = ['Tools', 'Home', 'Events', 'Outdoor', 'Electronics'];

  async function handleSubmit() {
    if (!name.trim()) {
      errorMsg = 'Nama barang wajib diisi.';
      return;
    }

    submitting = true;
    errorMsg = '';

    const res = await apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify({
        community_id: activeCommunity.id,
        name: name.trim(),
        category,
        condition,
        description: description.trim() || undefined,
        location_hint: locationHint.trim() || undefined,
        borrowing_rules: borrowingRules.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
      }),
    });

    submitting = false;

    if (!res.success) {
      errorMsg = res.error?.message || 'Gagal menambahkan barang.';
      toast.error(errorMsg);
      return;
    }

    toast.success('Barang berhasil dibagikan ke komunitas!');
    name = '';
    description = '';
    locationHint = '';
    borrowingRules = '';
    imageUrl = '';
    onSuccess();
    onClose();
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
      
      <!-- Header -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm">
            ✨
          </div>
          <div>
            <h2 class="font-bold text-base text-slate-900 leading-tight">Bagikan Barang ke Warga</h2>
            <p class="text-xs text-slate-500">{activeCommunity.name}</p>
          </div>
        </div>
        <button
          type="button"
          on:click={onClose}
          class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form Content -->
      <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-4 overflow-y-auto flex-1">
        
        {#if errorMsg}
          <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        {/if}

        <!-- Name -->
        <div>
          <label for="add-item-name" class="block text-xs font-bold text-slate-700 mb-1.5">Nama Barang *</label>
          <input
            id="add-item-name"
            type="text"
            bind:value={name}
            placeholder="Contoh: Bor Listrik Bosch / Tangga Lipat Aluminium"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs font-medium text-slate-800"
            required
          />
        </div>

        <!-- Category & Condition -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="add-item-category" class="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
            <select
              id="add-item-category"
              bind:value={category}
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs font-medium text-slate-800 bg-white"
            >
              {#each CATEGORIES as cat}
                <option value={cat}>{cat}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="add-item-condition" class="block text-xs font-bold text-slate-700 mb-1.5">Kondisi</label>
            <select
              id="add-item-condition"
              bind:value={condition}
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs font-medium text-slate-800 bg-white"
            >
              <option value="Excellent">Sangat Baik (Mulus)</option>
              <option value="Good">Baik (Berfungsi Normal)</option>
              <option value="Fair">Cukup (Ada tanda pakai)</option>
            </select>
          </div>
        </div>

        <!-- Location Hint -->
        <div>
          <label for="add-item-location" class="block text-xs font-bold text-slate-700 mb-1.5">Petunjuk Lokasi Pengambilan</label>
          <input
            id="add-item-location"
            type="text"
            bind:value={locationHint}
            placeholder="Contoh: Rumah Blok B3 No. 7 / Pos Satpam RT"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs font-medium text-slate-800"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="add-item-desc" class="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi / Kelengkapan</label>
          <textarea
            id="add-item-desc"
            bind:value={description}
            rows="2"
            placeholder="Contoh: Termasuk set mata bor dan kotak penyimpanan..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs text-slate-800 resize-none"
          ></textarea>
        </div>

        <!-- Borrowing Rules -->
        <div>
          <label for="add-item-rules" class="block text-xs font-bold text-slate-700 mb-1.5">Aturan Peminjaman</label>
          <input
            id="add-item-rules"
            type="text"
            bind:value={borrowingRules}
            placeholder="Contoh: Harap dibersihkan sebelum dikembalikan, jangan kena air hujan"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs font-medium text-slate-800"
          />
        </div>

        <!-- Image URL -->
        <div>
          <label for="add-item-image" class="block text-xs font-bold text-slate-700 mb-1.5">URL Foto Barang (Opsional)</label>
          <input
            id="add-item-image"
            type="url"
            bind:value={imageUrl}
            placeholder="https://images.unsplash.com/..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-xs font-medium text-slate-800"
          />
        </div>

        <!-- Buttons -->
        <div class="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            on:click={onClose}
            class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm hover:shadow-brand-500/20 active:scale-95 flex items-center gap-1.5"
          >
            {#if submitting}
              <span>Menyimpan...</span>
            {:else}
              <Plus class="w-3.5 h-3.5" />
              <span>Bagikan Sekarang</span>
            {/if}
          </button>
        </div>

      </form>

    </div>
  </div>
{/if}
