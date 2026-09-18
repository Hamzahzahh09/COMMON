import { s as sanitize_props, a as spread_props, b as slot, c as store_get, e as escape_html, i as attr_class, u as unsubscribe_stores, j as ensure_array_like, d as attr } from "../../../chunks/index.js";
import { a as apiRequest } from "../../../chunks/client.js";
import { I as Icon, a as authState } from "../../../chunks/Icon.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
import { I as Inbox } from "../../../chunks/inbox.js";
import { B as Boxes } from "../../../chunks/boxes.js";
import { U as User, X } from "../../../chunks/x.js";
import { C as Calendar } from "../../../chunks/calendar.js";
import { C as Check } from "../../../chunks/check.js";
import { R as Rotate_ccw } from "../../../chunks/rotate-ccw.js";
function Package_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.475.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "m16 16 2 2 4-4" }],
    [
      "path",
      {
        "d": "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
      }
    ],
    ["path", { "d": "m7.5 4.27 9 5.15" }],
    ["polyline", { "points": "3.29 7 12 12 20.71 7" }],
    ["line", { "x1": "12", "x2": "12", "y1": "22", "y2": "12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "package-check" },
    $$sanitized_props,
    {
      /**
       * @component @name PackageCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTYgMiAyIDQtNCIgLz4KICA8cGF0aCBkPSJNMjEgMTBWOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDItMS4xNCIgLz4KICA8cGF0aCBkPSJtNy41IDQuMjcgOSA1LjE1IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMjIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/package-check
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let incomingRequests = [];
    let myBorrows = [];
    let myItems = [];
    let loading = true;
    let processingId = null;
    let lastResidentId = "";
    async function loadDashboardData() {
      loading = true;
      try {
        const currentResidentId = store_get($$store_subs ??= {}, "$authState", authState).resident?.id || store_get($$store_subs ??= {}, "$authState", authState).user?.id || "";
        const [incomingRes, myBorrowsRes, itemsRes] = await Promise.all([
          apiRequest("/borrowing-requests/incoming"),
          apiRequest("/borrowing-requests/me"),
          apiRequest(`/items?owner_id=${currentResidentId}`)
        ]);
        if (incomingRes.success) {
          incomingRequests = incomingRes.data || [];
        }
        if (myBorrowsRes.success) {
          myBorrows = myBorrowsRes.data || [];
        }
        if (itemsRes.success) {
          myItems = (itemsRes.data || []).filter((i) => i.owner_id === currentResidentId);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        loading = false;
      }
    }
    if (store_get($$store_subs ??= {}, "$authState", authState).resident && store_get($$store_subs ??= {}, "$authState", authState).resident.id !== lastResidentId) {
      lastResidentId = store_get($$store_subs ??= {}, "$authState", authState).resident.id;
      loadDashboardData();
    }
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Warga</h1> <p class="text-xs sm:text-sm text-slate-500 mt-1">Kelola persetujuan pinjaman barang dan pantau barang yang Anda gunakan sebagai <span class="font-bold text-slate-700">${escape_html(store_get($$store_subs ??= {}, "$authState", authState).resident?.name)}</span>.</p></div> <button type="button" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto">`);
    Refresh_cw($$renderer2, { class: `w-3.5 h-3.5 ${loading ? "animate-spin" : ""}` });
    $$renderer2.push(`<!----> Segarkan</button></div> <div class="border-b border-slate-200 flex items-center gap-2 sm:gap-6 overflow-x-auto"><button type="button"${attr_class(`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${"border-brand-600 text-brand-700"}`)}>`);
    Inbox($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Permintaan Masuk</span> `);
    if (incomingRequests.filter((r) => r.status === "pending").length > 0) {
      $$renderer2.push(`<!--[0--><span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-600 text-white">${escape_html(incomingRequests.filter((r) => r.status === "pending").length)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> <button type="button"${attr_class(`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${"border-transparent text-slate-500 hover:text-slate-800"}`)}>`);
    Package_check($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Pinjaman Saya</span> `);
    if (myBorrows.filter((r) => r.status === "approved").length > 0) {
      $$renderer2.push(`<!--[0--><span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">${escape_html(myBorrows.filter((r) => r.status === "approved").length)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> <button type="button"${attr_class(`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${"border-transparent text-slate-500 hover:text-slate-800"}`)}>`);
    Boxes($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Barang Milik Saya (${escape_html(myItems.length)})</span></button></div> `);
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="py-20 text-center">`);
      Refresh_cw($$renderer2, { class: "w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-sm font-semibold text-slate-600">Memuat data dashboard...</p></div>`);
    } else {
      $$renderer2.push("<!--[1-->");
      if (incomingRequests.length === 0) {
        $$renderer2.push(`<!--[0--><div class="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">`);
        Inbox($$renderer2, { class: "w-12 h-12 text-slate-300 mx-auto mb-3" });
        $$renderer2.push(`<!----> <h3 class="font-bold text-base text-slate-900">Tidak Ada Permintaan Masuk</h3> <p class="text-xs text-slate-500 mt-1">Belum ada tetangga yang meminta pinjam barang milik Anda saat ini.</p></div>`);
      } else {
        $$renderer2.push(`<!--[-1--><div class="space-y-4"><!--[-->`);
        const each_array = ensure_array_like(incomingRequests);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let req = each_array[$$index];
          $$renderer2.push(`<div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div class="flex items-start gap-4 flex-1"><img${attr("src", req.item?.image_url || "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=300")}${attr("alt", req.item?.name)} class="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"/> <div><div class="flex items-center gap-2"><h4 class="font-bold text-sm text-slate-900">${escape_html(req.item?.name)}</h4> <span${attr_class(`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === "pending" ? "bg-amber-50 text-amber-800 border border-amber-200" : ""} ${req.status === "approved" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : ""} ${req.status === "returned" ? "bg-slate-100 text-slate-700" : ""} ${req.status === "rejected" ? "bg-rose-50 text-rose-800" : ""} ${req.status === "overdue" ? "bg-red-100 text-red-800 font-black" : ""}`)}>${escape_html(req.status === "pending" ? "Menunggu Persetujuan" : req.status)}</span></div> <div class="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-3"><span class="flex items-center gap-1 font-medium text-slate-800">`);
          User($$renderer2, { class: "w-3.5 h-3.5 text-slate-400" });
          $$renderer2.push(`<!----> Peminjam: ${escape_html(req.requester?.full_name)}</span> <span class="flex items-center gap-1 text-slate-500">`);
          Calendar($$renderer2, { class: "w-3.5 h-3.5 text-slate-400" });
          $$renderer2.push(`<!----> ${escape_html(req.start_date)} s/d ${escape_html(req.end_date)}</span></div> <div class="mt-2 text-xs bg-slate-50 rounded-lg p-2.5 text-slate-700 border border-slate-100"><strong class="font-semibold text-slate-900">Keperluan:</strong> "${escape_html(req.purpose)}"</div></div></div> <div class="flex items-center gap-2 self-end md:self-center">`);
          if (req.status === "pending") {
            $$renderer2.push(`<!--[0--><button type="button"${attr("disabled", processingId === req.id, true)} class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95">`);
            Check($$renderer2, { class: "w-3.5 h-3.5 stroke-[3]" });
            $$renderer2.push(`<!----> <span>Setujui</span></button> <button type="button"${attr("disabled", processingId === req.id, true)} class="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors">`);
            X($$renderer2, { class: "w-3.5 h-3.5" });
            $$renderer2.push(`<!----> <span>Tolak</span></button>`);
          } else if (req.status === "approved" || req.status === "overdue") {
            $$renderer2.push(`<!--[1--><button type="button"${attr("disabled", processingId === req.id, true)} class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5">`);
            Rotate_ccw($$renderer2, { class: "w-3.5 h-3.5" });
            $$renderer2.push(`<!----> <span>Konfirmasi Pengembalian</span></button>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
