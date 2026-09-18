<script lang="ts">
  import { onMount } from 'svelte';
  import { apiRequest } from '$lib/api';
  import { authState } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import {
    Inbox,
    PackageCheck,
    Boxes,
    Check,
    X,
    RotateCcw,
    Calendar,
    Clock,
    AlertCircle,
    User,
    RefreshCw,
  } from 'lucide-svelte';

  let activeTab: 'incoming' | 'my-borrows' | 'my-items' = 'incoming';
  let incomingRequests: any[] = [];
  let myBorrows: any[] = [];
  let myItems: any[] = [];
  let loading = true;
  let processingId: string | null = null;
  let lastResidentId = '';

  async function loadDashboardData() {
    loading = true;
    try {
      const currentResidentId = $authState.resident?.id || $authState.user?.id || '';
      const [incomingRes, myBorrowsRes, itemsRes] = await Promise.all([
        apiRequest('/borrowing-requests/incoming'),
        apiRequest('/borrowing-requests/me'),
        apiRequest(`/items?owner_id=${currentResidentId}`),
      ]);

      if (incomingRes.success) {
        incomingRequests = incomingRes.data || [];
      }
      if (myBorrowsRes.success) {
        myBorrows = myBorrowsRes.data || [];
      }
      if (itemsRes.success) {
        myItems = (itemsRes.data || []).filter(
          (i: any) => i.owner_id === currentResidentId
        );
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      loading = false;
    }
  }

  // Load once and reload only when resident actually changes
  $: if ($authState.resident && $authState.resident.id !== lastResidentId) {
    lastResidentId = $authState.resident.id;
    loadDashboardData();
  }


  async function handleApprove(requestId: string) {
    processingId = requestId;
    const res = await apiRequest(`/borrowing-requests/${requestId}/approve`, {
      method: 'POST',
    });
    processingId = null;

    if (!res.success) {
      toast.error(res.error?.message || 'Gagal menyetujui permintaan.');
      return;
    }

    toast.success('Permintaan pinjam disetujui! Status barang diubah menjadi "Dipinjam".');
    loadDashboardData();
  }

  async function handleReject(requestId: string) {
    const reason = prompt('Masukkan alasan penolakan (opsional):') || '';
    processingId = requestId;
    const res = await apiRequest(`/borrowing-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason.trim() || undefined }),
    });
    processingId = null;

    if (!res.success) {
      toast.error(res.error?.message || 'Gagal menolak permintaan.');
      return;
    }

    toast.info('Permintaan pinjam ditolak.');
    loadDashboardData();
  }

  async function handleCancel(requestId: string) {
    if (!confirm('Yakin ingin membatalkan permintaan pinjam ini?')) return;

    processingId = requestId;
    const res = await apiRequest(`/borrowing-requests/${requestId}/cancel`, {
      method: 'POST',
    });
    processingId = null;

    if (!res.success) {
      toast.error(res.error?.message || 'Gagal membatalkan permintaan.');
      return;
    }

    toast.info('Permintaan pinjam dibatalkan.');
    loadDashboardData();
  }

  async function handleReturn(requestId: string) {
    if (!confirm('Konfirmasi pengembalian barang ini ke pemiliknya?')) return;

    processingId = requestId;
    const res = await apiRequest(`/borrowing-requests/${requestId}/return`, {
      method: 'POST',
    });
    processingId = null;

    if (!res.success) {
      toast.error(res.error?.message || 'Gagal mengembalikan barang.');
      return;
    }

    toast.success('Barang berhasil dikembalikan! Status barang kini "Tersedia" kembali.');
    loadDashboardData();
  }
</script>

<div class="space-y-8 animate-in fade-in duration-200">
  
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Dashboard Warga
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">
        Kelola persetujuan pinjaman barang dan pantau barang yang Anda gunakan sebagai <span class="font-bold text-slate-700">{$authState.resident?.name}</span>.
      </p>
    </div>

    <button
      type="button"
      on:click={loadDashboardData}
      class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto"
    >
      <RefreshCw class="w-3.5 h-3.5 {loading ? 'animate-spin' : ''}" />
      Segarkan
    </button>
  </div>

  <!-- Tabs Navigation -->
  <div class="border-b border-slate-200 flex items-center gap-2 sm:gap-6 overflow-x-auto">
    <button
      type="button"
      on:click={() => (activeTab = 'incoming')}
      class="pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap
        {activeTab === 'incoming'
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-slate-500 hover:text-slate-800'}"
    >
      <Inbox class="w-4 h-4" />
      <span>Permintaan Masuk</span>
      {#if incomingRequests.filter((r) => r.status === 'pending').length > 0}
        <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-600 text-white">
          {incomingRequests.filter((r) => r.status === 'pending').length}
        </span>
      {/if}
    </button>

    <button
      type="button"
      on:click={() => (activeTab = 'my-borrows')}
      class="pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap
        {activeTab === 'my-borrows'
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-slate-500 hover:text-slate-800'}"
    >
      <PackageCheck class="w-4 h-4" />
      <span>Pinjaman Saya</span>
      {#if myBorrows.filter((r) => r.status === 'approved').length > 0}
        <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
          {myBorrows.filter((r) => r.status === 'approved').length}
        </span>
      {/if}
    </button>

    <button
      type="button"
      on:click={() => (activeTab = 'my-items')}
      class="pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap
        {activeTab === 'my-items'
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-slate-500 hover:text-slate-800'}"
    >
      <Boxes class="w-4 h-4" />
      <span>Barang Milik Saya ({myItems.length})</span>
    </button>
  </div>

  <!-- Tab Content -->
  {#if loading}
    <div class="py-20 text-center">
      <RefreshCw class="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
      <p class="text-sm font-semibold text-slate-600">Memuat data dashboard...</p>
    </div>

  <!-- 1. TAB: PERMINTAAN MASUK (INCOMING) -->
  {:else if activeTab === 'incoming'}
    {#if incomingRequests.length === 0}
      <div class="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
        <Inbox class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 class="font-bold text-base text-slate-900">Tidak Ada Permintaan Masuk</h3>
        <p class="text-xs text-slate-500 mt-1">
          Belum ada tetangga yang meminta pinjam barang milik Anda saat ini.
        </p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each incomingRequests as req (req.id)}
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <!-- Left Info -->
            <div class="flex items-start gap-4 flex-1">
              <img
                src={req.item?.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=300'}
                alt={req.item?.name}
                class="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
              />
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-sm text-slate-900">{req.item?.name}</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                    {req.status === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' : ''}
                    {req.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : ''}
                    {req.status === 'returned' ? 'bg-slate-100 text-slate-700' : ''}
                    {req.status === 'rejected' ? 'bg-rose-50 text-rose-800' : ''}
                    {req.status === 'overdue' ? 'bg-red-100 text-red-800 font-black' : ''}">
                    {req.status === 'pending' ? 'Menunggu Persetujuan' : req.status}
                  </span>
                </div>

                <div class="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span class="flex items-center gap-1 font-medium text-slate-800">
                    <User class="w-3.5 h-3.5 text-slate-400" />
                    Peminjam: {req.requester?.full_name}
                  </span>
                  <span class="flex items-center gap-1 text-slate-500">
                    <Calendar class="w-3.5 h-3.5 text-slate-400" />
                    {req.start_date} s/d {req.end_date}
                  </span>
                </div>

                <div class="mt-2 text-xs bg-slate-50 rounded-lg p-2.5 text-slate-700 border border-slate-100">
                  <strong class="font-semibold text-slate-900">Keperluan:</strong> "{req.purpose}"
                </div>
              </div>
            </div>

            <!-- Action Buttons for Owner -->
            <div class="flex items-center gap-2 self-end md:self-center">
              {#if req.status === 'pending'}
                <button
                  type="button"
                  disabled={processingId === req.id}
                  on:click={() => handleApprove(req.id)}
                  class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Check class="w-3.5 h-3.5 stroke-[3]" />
                  <span>Setujui</span>
                </button>
                <button
                  type="button"
                  disabled={processingId === req.id}
                  on:click={() => handleReject(req.id)}
                  class="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  <X class="w-3.5 h-3.5" />
                  <span>Tolak</span>
                </button>
              {:else if req.status === 'approved' || req.status === 'overdue'}
                <button
                  type="button"
                  disabled={processingId === req.id}
                  on:click={() => handleReturn(req.id)}
                  class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw class="w-3.5 h-3.5" />
                  <span>Konfirmasi Pengembalian</span>
                </button>
              {/if}
            </div>

          </div>
        {/each}
      </div>
    {/if}

  <!-- 2. TAB: PINJAMAN SAYA (MY BORROWS) -->
  {:else if activeTab === 'my-borrows'}
    {#if myBorrows.length === 0}
      <div class="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
        <PackageCheck class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 class="font-bold text-base text-slate-900">Belum Ada Pinjaman</h3>
        <p class="text-xs text-slate-500 mt-1">
          Anda belum meminjam barang apapun dari tetangga RT 05.
        </p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each myBorrows as req (req.id)}
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div class="flex items-start gap-4 flex-1">
              <img
                src={req.item?.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=300'}
                alt={req.item?.name}
                class="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
              />
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-sm text-slate-900">{req.item?.name}</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                    {req.status === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' : ''}
                    {req.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : ''}
                    {req.status === 'returned' ? 'bg-slate-100 text-slate-700' : ''}
                    {req.status === 'overdue' ? 'bg-red-100 text-red-800 font-black' : ''}">
                    {req.status === 'pending' ? 'Menunggu Persetujuan' : req.status === 'approved' ? 'Sedang Dipinjam' : req.status}
                  </span>
                </div>

                <div class="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span class="font-medium text-slate-700">
                    Pemilik: {req.item?.owner?.full_name || 'Tetangga'}
                  </span>
                  <span class="text-slate-500">
                    Periode: {req.start_date} s/d {req.end_date}
                  </span>
                </div>

                <p class="mt-1.5 text-xs text-slate-500">
                  Keperluan: "{req.purpose}"
                </p>
              </div>
            </div>

            <!-- Actions for Borrower -->
            <div class="self-end md:self-center">
              {#if req.status === 'approved' || req.status === 'overdue'}
                <button
                  type="button"
                  disabled={processingId === req.id}
                  on:click={() => handleReturn(req.id)}
                  class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <RotateCcw class="w-3.5 h-3.5" />
                  <span>Kembalikan Barang</span>
                </button>
              {:else if req.status === 'pending'}
                <button
                  type="button"
                  disabled={processingId === req.id}
                  on:click={() => handleCancel(req.id)}
                  class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Batalkan Permintaan
                </button>
              {/if}
            </div>

          </div>
        {/each}
      </div>
    {/if}

  <!-- 3. TAB: BARANG SAYA (MY ITEMS) -->
  {:else if activeTab === 'my-items'}
    {#if myItems.length === 0}
      <div class="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
        <Boxes class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 class="font-bold text-base text-slate-900">Belum Ada Barang Dibagikan</h3>
        <p class="text-xs text-slate-500 mt-1">
          Anda belum mendaftarkan barang untuk dibagikan ke tetangga.
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each myItems as it (it.id)}
          <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex gap-3.5 items-center">
            <img
              src={it.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=300'}
              alt={it.name}
              class="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-100 flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-xs text-slate-900 truncate">{it.name}</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">{it.category}</p>
              <div class="mt-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full
                  {it.status === 'available' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}">
                  {it.status === 'available' ? 'Tersedia' : 'Sedang Dipinjam'}
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}

</div>
