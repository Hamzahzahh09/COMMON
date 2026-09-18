<script lang="ts">
  export let status: 'available' | 'borrowed' | 'unavailable' | 'pending' | 'approved' | 'rejected' | 'returned' | 'cancelled' | 'overdue' | string = 'available';
  export let size: 'sm' | 'md' = 'sm';

  type BadgeConfig = {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
  };

  const CONFIGS: Record<string, BadgeConfig> = {
    available: {
      label: 'Tersedia',
      bg: 'bg-[#E8EFEA]',
      text: 'text-[#1E4432]',
      border: 'border-[#C8DCD0]',
      dot: 'bg-[#2F6B4F]',
    },
    borrowed: {
      label: 'Sedang Dipinjam',
      bg: 'bg-[#F5EFE6]',
      text: 'text-[#8C7A65]',
      border: 'border-[#D9CBB8]',
      dot: 'bg-[#C2B19B]',
    },
    unavailable: {
      label: 'Tidak Tersedia',
      bg: 'bg-stone-100',
      text: 'text-stone-600',
      border: 'border-stone-200',
      dot: 'bg-stone-400',
    },
    pending: {
      label: 'Menunggu Persetujuan',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    approved: {
      label: 'Disetujui',
      bg: 'bg-[#E8EFEA]',
      text: 'text-[#1E4432]',
      border: 'border-[#C8DCD0]',
      dot: 'bg-[#2F6B4F]',
    },
    returned: {
      label: 'Selesai Dikembalikan',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
    rejected: {
      label: 'Ditolak',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    cancelled: {
      label: 'Dibatalkan',
      bg: 'bg-stone-100',
      text: 'text-stone-500',
      border: 'border-stone-200',
      dot: 'bg-stone-400',
    },
    overdue: {
      label: 'Terlambat Kembali',
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-300',
      dot: 'bg-rose-600 animate-pulse',
    },
  };

  $: config = CONFIGS[status] || {
    label: status,
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200',
    dot: 'bg-stone-400',
  };
</script>

<span
  class="inline-flex items-center gap-1.5 font-medium border rounded-full
    {config.bg} {config.text} {config.border}
    {size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}"
>
  <span class="w-1.5 h-1.5 rounded-full {config.dot}"></span>
  {config.label}
</span>
