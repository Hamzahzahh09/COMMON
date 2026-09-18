import { c as store_get, u as unsubscribe_stores, j as ensure_array_like, d as attr, e as escape_html, l as stringify } from "../../../chunks/index.js";
import { g as getIncomingRequests } from "../../../chunks/borrowing.api.js";
import { S as StatusBadge } from "../../../chunks/StatusBadge.js";
import { E as EmptyState } from "../../../chunks/EmptyState.js";
import { a as authState } from "../../../chunks/Icon.js";
import { I as Inbox } from "../../../chunks/inbox.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
import { C as Calendar } from "../../../chunks/calendar.js";
import { M as Message_square } from "../../../chunks/message-square.js";
import { M as Map_pin } from "../../../chunks/map-pin.js";
import { S as Shield_check } from "../../../chunks/shield-check.js";
import { C as Check } from "../../../chunks/check.js";
import { C as Circle_check } from "../../../chunks/circle-check.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let requests = [];
    let loading = true;
    let processingId = null;
    async function loadIncoming() {
      loading = true;
      try {
        const res = await getIncomingRequests();
        if (res.success && res.data) {
          requests = res.data;
        }
      } catch (err) {
        console.error("Failed to load incoming requests:", err);
      } finally {
        loading = false;
      }
    }
    let lastResidentId = "";
    if (store_get($$store_subs ??= {}, "$authState", authState).resident && store_get($$store_subs ??= {}, "$authState", authState).resident.id !== lastResidentId) {
      lastResidentId = store_get($$store_subs ??= {}, "$authState", authState).resident.id;
      loadIncoming();
    }
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">`);
    Inbox($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> <span>Inbox Pemilik &amp; Pengurus Inventaris</span></div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Permintaan Pinjam Masuk dari Warga</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Tinjau tetangga yang ingin meminjam alat milik Anda, berikan petunjuk pengambilan, dan konfirmasi kondisi barang saat dikembalikan.</p></div> `);
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="py-24 text-center">`);
      Refresh_cw($$renderer2, { class: "w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat permintaan masuk...</p></div>`);
    } else if (requests.length === 0) {
      $$renderer2.push("<!--[1-->");
      EmptyState($$renderer2, {
        title: "Tidak Ada Permintaan Masuk",
        description: "Saat ini belum ada tetangga yang mengajukan pinjaman untuk barang milik Anda."
      });
    } else {
      $$renderer2.push(`<!--[-1--><div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(requests);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let req = each_array[$$index];
        $$renderer2.push(`<div class="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-brand-300 transition-colors"><div class="flex items-start gap-4"><img${attr("src", req.requester?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")}${attr("alt", req.requester?.full_name || "Requester")} class="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/20 flex-shrink-0"/> <div class="space-y-1.5 min-w-0"><div class="flex items-center gap-2">`);
        StatusBadge($$renderer2, { status: req.status, size: "sm" });
        $$renderer2.push(`<!----> <span class="text-xs font-bold text-ink-primary">${escape_html(req.requester?.full_name || "Warga")}</span> <span class="text-xs text-ink-muted">mengajukan pinjaman</span></div> <a${attr("href", `/items/${stringify(req.item_id)}`)} class="font-extrabold text-base text-brand-700 hover:underline block truncate">${escape_html(req.item?.name || "Barang Anda")}</a> <div class="flex items-center gap-1.5 text-xs text-ink-secondary">`);
        Calendar($$renderer2, { class: "w-3.5 h-3.5 text-stone-400" });
        $$renderer2.push(`<!----> <span>Periode: <strong>${escape_html(req.start_date)}</strong> s/d <strong>${escape_html(req.end_date)}</strong></span></div> `);
        if (req.purpose) {
          $$renderer2.push(`<!--[0--><div class="p-2.5 rounded-xl bg-surface-base text-xs text-ink-secondary border border-surface-border flex items-start gap-2 max-w-xl">`);
          Message_square($$renderer2, { class: "w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" });
          $$renderer2.push(`<!----> <span class="italic leading-relaxed">"${escape_html(req.purpose)}"</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (req.pickup_instructions) {
          $$renderer2.push(`<!--[0--><div class="p-2.5 rounded-xl bg-amber-50/70 text-xs text-amber-900 border border-amber-200/80 flex items-start gap-2 max-w-xl">`);
          Map_pin($$renderer2, { class: "w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" });
          $$renderer2.push(`<!----> <span><strong>Petunjuk Titik Temu:</strong> ${escape_html(req.pickup_instructions)}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (req.return_condition) {
          $$renderer2.push(`<!--[0--><div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">`);
          Shield_check($$renderer2, { class: "w-3.5 h-3.5 text-emerald-600" });
          $$renderer2.push(`<!----> <span>Kondisi Saat Kembali: <strong>${escape_html(req.return_condition)}</strong></span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-surface-border self-end md:self-center"><button type="button" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-base hover:bg-stone-100 text-ink-primary border border-surface-border transition-colors flex items-center gap-1.5" title="Kirim pesan koordinasi">`);
        Message_square($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
        $$renderer2.push(`<!----> <span>Chat Warga</span></button> `);
        if (req.status === "pending") {
          $$renderer2.push(`<!--[0--><button type="button"${attr("disabled", processingId === req.id, true)} class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95">`);
          Check($$renderer2, { class: "w-3.5 h-3.5 stroke-[2.5]" });
          $$renderer2.push(`<!----> <span>Setujui (Approve)</span></button> <button type="button"${attr("disabled", processingId === req.id, true)} class="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors">Tolak</button>`);
        } else if (req.status === "approved" || req.status === "overdue") {
          $$renderer2.push(`<!--[1--><button type="button" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95">`);
          Circle_check($$renderer2, { class: "w-3.5 h-3.5" });
          $$renderer2.push(`<!----> <span>Konfirmasi Kembali &amp; Cek Kondisi</span></button>`);
        } else if (req.status === "returned") {
          $$renderer2.push(`<!--[2--><span class="text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200">Selesai Dikembalikan</span>`);
        } else if (req.status === "rejected") {
          $$renderer2.push(`<!--[3--><span class="text-xs text-rose-500 font-medium px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-200">Permintaan Ditolak</span>`);
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
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
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
