<script lang="ts">
  import { goto } from '$app/navigation';
  import { createCommunity } from '$lib/api/communities.api';
  import { toast } from '$lib/stores/toast';
  import { Users, Sparkles, AlertCircle, ArrowRight } from 'lucide-svelte';

  let name = '';
  let slug = '';
  let description = '';
  let location = '';
  let submitting = false;
  let errorMsg = '';
  let autoSlug = true;

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  $: if (autoSlug && name) {
    slug = slugify(name);
  }

  function handleManualSlugChange() {
    autoSlug = false;
    slug = slugify(slug);
  }

  async function handleSubmit() {
    errorMsg = '';

    if (!name.trim()) {
      errorMsg = 'Silakan masukkan nama komunitas.';
      return;
    }

    if (!slug.trim()) {
      errorMsg = 'Silakan tentukan slug/URL unik komunitas.';
      return;
    }

    submitting = true;

    try {
      const res = await createCommunity({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
      });

      if (!res.success) {
        errorMsg = res.error?.message || 'Gagal membuat komunitas.';
        submitting = false;
        return;
      }

      toast.success(`Komunitas "${name}" berhasil dibuat! Anda adalah admin.`);
      goto(`/c/${res.data?.slug || slug}`);
    } catch (err: any) {
      errorMsg = err.message || 'Terjadi kesalahan sistem.';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="max-w-xl mx-auto space-y-8 animate-in fade-in duration-200 py-4">
  
  <!-- Header -->
  <div>
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">
      <Users class="w-3.5 h-3.5 text-brand-500" />
      Ruang Berbagi Baru
    </div>
    <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">
      Buat Komunitas Baru
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary mt-1">
      Ciptakan ruang bersama untuk tetangga RT/RW, komplek perumahan, atau komunitas hobi Anda.
    </p>
  </div>

  <!-- Error Banner -->
  {#if errorMsg}
    <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
      <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
      <span>{errorMsg}</span>
    </div>
  {/if}

  <!-- Form Card -->
  <form on:submit|preventDefault={handleSubmit} class="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 space-y-5 shadow-sm">
    
    <!-- Community Name -->
    <div>
      <label for="community-name" class="block text-xs font-bold text-ink-primary mb-1.5">
        Nama Komunitas *
      </label>
      <input
        id="community-name"
        type="text"
        bind:value={name}
        required
        placeholder="Contoh: Jakarta Makers, Green Valley, RT 05 Commons..."
        class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"
      />
    </div>

    <!-- Slug & Live Preview -->
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <label for="community-slug" class="block text-xs font-bold text-ink-primary">
          Slug / URL Komunitas *
        </label>
        <span class="text-[11px] text-ink-muted">Huruf kecil, angka & strip (-)</span>
      </div>
      <input
        id="community-slug"
        type="text"
        bind:value={slug}
        on:input={handleManualSlugChange}
        required
        placeholder="jakarta-makers"
        class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base font-mono"
      />

      <!-- URL Preview Badge -->
      <div class="mt-2 text-[11px] text-ink-secondary bg-surface-muted px-3 py-1.5 rounded-lg border border-surface-border flex items-center gap-1.5">
        <span class="text-ink-muted">URL Pratinjau:</span>
        <code class="text-brand-700 font-semibold font-mono">common.app/c/{slug || 'nama-komunitas'}</code>
      </div>
    </div>

    <!-- Description -->
    <div>
      <label for="community-desc" class="block text-xs font-bold text-ink-primary mb-1.5">
        Deskripsi Komunitas
      </label>
      <textarea
        id="community-desc"
        bind:value={description}
        rows="3"
        placeholder="Jelaskan tujuan komunitas ini dan jenis alat/sumber daya apa yang akan dibagikan bersama..."
        class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted resize-none"
      ></textarea>
    </div>

    <!-- Location -->
    <div>
      <label for="community-loc" class="block text-xs font-bold text-ink-primary mb-1.5">
        Lokasi (Opsional)
      </label>
      <input
        id="community-loc"
        type="text"
        bind:value={location}
        placeholder="Contoh: Komp. Griya Harmoni, Jakarta Selatan"
        class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"
      />
    </div>

    <!-- Admin notice -->
    <div class="p-3.5 rounded-2xl bg-earth-light border border-earth-sand/50 text-[11px] text-earth-deep leading-relaxed">
      💡 <strong>Catatan:</strong> Sebagai pembuat, Anda akan otomatis menjadi Administrator dan anggota pertama dari komunitas ini.
    </div>

    <!-- Submit Button -->
    <div class="pt-2">
      <button
        type="submit"
        disabled={submitting}
        class="w-full py-3 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {#if submitting}
          <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Membuat Komunitas...</span>
        {:else}
          <span>Buat & Buka Komunitas</span>
          <ArrowRight class="w-4 h-4" />
        {/if}
      </button>
    </div>

  </form>

</div>
