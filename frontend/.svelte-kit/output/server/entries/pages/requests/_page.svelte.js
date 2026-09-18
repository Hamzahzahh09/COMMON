import { c as store_get, j as ensure_array_like, i as attr_class, e as escape_html, u as unsubscribe_stores, d as attr, l as stringify } from "../../../chunks/index.js";
import { a as getMyRequests } from "../../../chunks/borrowing.api.js";
import { S as StatusBadge } from "../../../chunks/StatusBadge.js";
import { E as EmptyState } from "../../../chunks/EmptyState.js";
import { a as authState } from "../../../chunks/Icon.js";
import { C as Clock } from "../../../chunks/clock.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
import { C as Calendar } from "../../../chunks/calendar.js";
import { M as Map_pin } from "../../../chunks/map-pin.js";
import { S as Shield_check } from "../../../chunks/shield-check.js";
import { M as Message_square } from "../../../chunks/message-square.js";
import { R as Rotate_ccw } from "../../../chunks/rotate-ccw.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let filteredRequests;
    let requests = [];
    let loading = true;
    let activeTab = "all";
    let processingId = null;
    async function loadRequests() {
      loading = true;
      try {
        const res = await getMyRequests();
        if (res.success && res.data) {
          requests = res.data;
        }
      } catch (err) {
        console.error("Failed to load borrowing requests:", err);
      } finally {
        loading = false;
      }
    }
    let lastResidentId = "";
    filteredRequests = requests.filter((r) => {
      return true;
    });
    if (store_get($$store_subs ??= {}, "$authState", authState).resident && store_get($$store_subs ??= {}, "$authState", authState).resident.id !== lastResidentId) {
      lastResidentId = store_get($$store_subs ??= {}, "$authState", authState).resident.id;
      loadRequests();
    }
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">`);
    Clock($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> <span>Riwayat Peminjaman Warga</span></div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Permohonan Pinjam Saya</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Pantau status permohonan, koordinasikan serah terima dengan pemilik, dan konfirmasikan pengembalian barang.</p></div> <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"><!--[-->`);
    const each_array = ensure_array_like([
      { id: "all", label: "Semua" },
      { id: "pending", label: "Menunggu (Pending)" },
      { id: "approved", label: "Disetujui / Aktif" },
      { id: "returned", label: "Selesai Dikembalikan" },
      { id: "rejected", label: "Ditolak" }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button type="button"${attr_class(`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-brand-500 text-white font-bold shadow-sm" : "bg-white border border-surface-border text-ink-secondary hover:bg-stone-50"}`)}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="py-24 text-center">`);
      Refresh_cw($$renderer2, { class: "w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat daftar permohonan pinjam...</p></div>`);
    } else if (filteredRequests.length === 0) {
      $$renderer2.push("<!--[1-->");
      EmptyState($$renderer2, {
        title: "Belum Ada Permohonan Pinjam",
        description: "Anda belum mengajukan peminjaman barang di kategori ini. Jelajahi katalog alat di sekitar Anda.",
        actionText: "Jelajahi Katalog Barang",
        actionHref: "/discover"
      });
    } else {
      $$renderer2.push(`<!--[-1--><div class="space-y-4"><!--[-->`);
      const each_array_1 = ensure_array_like(filteredRequests);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let req = each_array_1[$$index_1];
        $$renderer2.push(`<div class="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-brand-300 transition-colors"><div class="flex items-start gap-4"><img${attr("src", req.item?.image_url || "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200")}${attr("alt", req.item?.name || "Item")} class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100 flex-shrink-0 border border-surface-border"/> <div class="space-y-1.5 min-w-0"><div class="flex items-center gap-2">`);
        StatusBadge($$renderer2, { status: req.status, size: "sm" });
        $$renderer2.push(`<!----> `);
        if (req.item?.category) {
          $$renderer2.push(`<!--[0--><span class="text-[10px] text-ink-muted bg-surface-muted px-2 py-0.5 rounded">${escape_html(req.item.category)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <a${attr("href", `/items/${stringify(req.item_id)}`)} class="block font-bold text-base text-ink-primary hover:text-brand-700 transition-colors truncate">${escape_html(req.item?.name || "Barang Komunitas")}</a> <div class="flex items-center gap-1.5 text-xs text-ink-secondary">`);
        Calendar($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
        $$renderer2.push(`<!----> <span>Periode: <strong>${escape_html(req.start_date)}</strong> s/d <strong>${escape_html(req.end_date)}</strong></span></div> `);
        if (req.pickup_instructions) {
          $$renderer2.push(`<!--[0--><div class="p-2.5 rounded-xl bg-amber-50/80 text-xs text-amber-900 border border-amber-200 flex items-start gap-2 max-w-xl">`);
          Map_pin($$renderer2, { class: "w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" });
          $$renderer2.push(`<!----> <span><strong>Petunjuk Pengambilan dari Pemilik:</strong> ${escape_html(req.pickup_instructions)}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (req.purpose) {
          $$renderer2.push(`<!--[0--><p class="text-xs text-ink-muted line-clamp-1 italic">Tujuan: "${escape_html(req.purpose)}"</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (req.return_condition) {
          $$renderer2.push(`<!--[0--><div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">`);
          Shield_check($$renderer2, { class: "w-3.5 h-3.5 text-emerald-600" });
          $$renderer2.push(`<!----> <span>Kondisi Dikembalikan: <strong>${escape_html(req.return_condition)}</strong></span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="flex flex-wrap items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-surface-border self-end md:self-center"><button type="button" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-base hover:bg-stone-100 text-ink-primary border border-surface-border transition-colors flex items-center gap-1.5" title="Kirim pesan koordinasi ke pemilik">`);
        Message_square($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
        $$renderer2.push(`<!----> <span>Koordinasi / Chat</span></button> `);
        if (req.status === "approved" || req.status === "overdue") {
          $$renderer2.push(`<!--[0--><button type="button"${attr("disabled", processingId === req.id, true)} class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95">`);
          Rotate_ccw($$renderer2, { class: "w-3.5 h-3.5" });
          $$renderer2.push(`<!----> <span>Kembalikan Barang</span></button>`);
        } else if (req.status === "pending") {
          $$renderer2.push(`<!--[1--><button type="button"${attr("disabled", processingId === req.id, true)} class="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors">Batalkan</button>`);
        } else if (req.status === "returned") {
          $$renderer2.push(`<!--[2--><span class="text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200">Telah Dikembalikan</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
