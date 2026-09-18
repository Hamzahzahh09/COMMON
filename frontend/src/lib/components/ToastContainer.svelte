<script lang="ts">
  import { toast } from '../stores/toast';
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
  {#each $toast as t (t.id)}
    <div
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-200 transform translate-y-0
        {t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : ''}
        {t.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' : ''}
        {t.type === 'info' ? 'bg-slate-900 border-slate-800 text-white' : ''}"
    >
      <div class="flex-1 font-medium">{t.message}</div>
      <button
        type="button"
        on:click={() => toast.dismiss(t.id)}
        class="opacity-60 hover:opacity-100 transition-opacity ml-2 text-base font-bold leading-none"
      >
        &times;
      </button>
    </div>
  {/each}
</div>
