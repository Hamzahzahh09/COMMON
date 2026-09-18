import { s as sanitize_props, a as spread_props, b as slot, h as fallback, c as store_get, d as attr, l as stringify, e as escape_html, i as attr_class, ah as clsx, u as unsubscribe_stores, f as bind_props } from "./index.js";
import { S as StatusBadge } from "./StatusBadge.js";
import { s as savedItems } from "./saved.js";
import { I as Icon, a as authState } from "./Icon.js";
import { B as Bookmark } from "./bookmark.js";
import { U as User, X } from "./x.js";
import { M as Map_pin } from "./map-pin.js";
import { A as Arrow_up_right } from "./arrow-up-right.js";
import "./client.js";
import { S as Sparkles } from "./sparkles.js";
import { C as Calendar } from "./calendar.js";
import { M as Message_square } from "./message-square.js";
function Circle_alert($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
    [
      "line",
      { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
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
function Landmark($$renderer, $$props) {
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
    ["line", { "x1": "3", "x2": "21", "y1": "22", "y2": "22" }],
    ["line", { "x1": "6", "x2": "6", "y1": "18", "y2": "11" }],
    ["line", { "x1": "10", "x2": "10", "y1": "18", "y2": "11" }],
    ["line", { "x1": "14", "x2": "14", "y1": "18", "y2": "11" }],
    ["line", { "x1": "18", "x2": "18", "y1": "18", "y2": "11" }],
    ["polygon", { "points": "12 2 20 7 4 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "landmark" },
    $$sanitized_props,
    {
      /**
       * @component @name Landmark
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMyIgeDI9IjIxIiB5MT0iMjIiIHkyPSIyMiIgLz4KICA8bGluZSB4MT0iNiIgeDI9IjYiIHkxPSIxOCIgeTI9IjExIiAvPgogIDxsaW5lIHgxPSIxMCIgeDI9IjEwIiB5MT0iMTgiIHkyPSIxMSIgLz4KICA8bGluZSB4MT0iMTQiIHgyPSIxNCIgeTE9IjE4IiB5Mj0iMTEiIC8+CiAgPGxpbmUgeDE9IjE4IiB4Mj0iMTgiIHkxPSIxOCIgeTI9IjExIiAvPgogIDxwb2x5Z29uIHBvaW50cz0iMTIgMiAyMCA3IDQgNyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/landmark
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
function ResourceCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let isSaved, isCommunityOwned;
    let item = $$props["item"];
    let onBorrow = fallback($$props["onBorrow"], void 0);
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80";
    isSaved = store_get($$store_subs ??= {}, "$savedItems", savedItems).some((i) => i.id === item.id);
    isCommunityOwned = item.ownership_type === "community";
    $$renderer2.push(`<div class="group bg-white rounded-2xl border border-surface-border overflow-hidden hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between h-full relative"><div><a${attr("href", `/items/${stringify(item.id)}`)} class="block relative aspect-[4/3] bg-stone-100 overflow-hidden"><img${attr("src", item.image_url || DEFAULT_IMAGE)}${attr("alt", item.name)} loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"/> <div class="absolute top-3 left-3 flex items-center gap-1.5">`);
    StatusBadge($$renderer2, { status: item.status, size: "sm" });
    $$renderer2.push(`<!----></div> <button type="button" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-ink-primary shadow-sm flex items-center justify-center transition-transform active:scale-90"${attr("title", isSaved ? "Hapus dari simpanan" : "Simpan barang")}${attr("aria-label", isSaved ? "Hapus dari simpanan" : "Simpan barang")}>`);
    Bookmark($$renderer2, {
      class: `w-4 h-4 transition-colors ${isSaved ? "fill-brand-600 text-brand-600" : "text-stone-500"}`
    });
    $$renderer2.push(`<!----></button> <div class="absolute bottom-3 left-3"><span class="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium tracking-wide">${escape_html(item.category)}</span></div></a> <div class="p-4 sm:p-5"><div class="flex items-center justify-between gap-2 mb-1.5">`);
    if (item.community) {
      $$renderer2.push(`<!--[0--><a${attr("href", `/c/${stringify(item.community.slug)}`)} class="text-[11px] font-semibold text-brand-700 hover:text-brand-800 tracking-tight truncate max-w-[150px]">${escape_html(item.community.name)}</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (isCommunityOwned) {
      $$renderer2.push(`<!--[0--><span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider flex-shrink-0">`);
      Landmark($$renderer2, { class: "w-2.5 h-2.5 text-emerald-600" });
      $$renderer2.push(`<!----> <span>Community</span></span>`);
    } else {
      $$renderer2.push(`<!--[-1--><span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold uppercase tracking-wider flex-shrink-0"><span>Personal</span></span>`);
    }
    $$renderer2.push(`<!--]--></div> <a${attr("href", `/items/${stringify(item.id)}`)} class="block"><h3 class="font-bold text-base text-ink-primary tracking-tight line-clamp-1 group-hover:text-brand-700 transition-colors">${escape_html(item.name)}</h3></a> <div class="text-[11px] text-ink-muted mt-1 flex items-center gap-1.5 font-medium"><span>${escape_html(item.condition || "Kondisi terawat")}</span> <span>•</span> <span${attr_class(clsx(item.status === "available" ? "text-brand-700 font-semibold" : "text-stone-500"))}>${escape_html(item.status === "available" ? "Tersedia sekarang" : "Sedang dipinjam")}</span></div> <p class="text-xs text-ink-secondary mt-2 line-clamp-2 leading-relaxed">${escape_html(item.description || "Alat inventaris bersama warga yang siap digunakan untuk kebutuhan rumah tangga atau lingkungan.")}</p> <div class="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-[11px] text-ink-secondary"><div class="flex items-center gap-1.5 truncate">`);
    if (isCommunityOwned) {
      $$renderer2.push(`<!--[0--><div class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-[9px]">🏛️</div> <span class="truncate text-ink-secondary font-medium">Aset Komunitas</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      if (item.owner?.avatar_url) {
        $$renderer2.push(`<!--[0--><img${attr("src", item.owner.avatar_url)}${attr("alt", item.owner.full_name)} class="w-4 h-4 rounded-full object-cover ring-1 ring-stone-200 flex-shrink-0"/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        User($$renderer2, { class: "w-3.5 h-3.5 text-stone-400 flex-shrink-0" });
      }
      $$renderer2.push(`<!--]--> <span class="truncate"><span class="text-ink-muted">Shared by</span> <strong class="font-medium text-ink-primary">${escape_html(item.owner?.full_name || "Warga")}</strong></span>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (item.location_hint) {
      $$renderer2.push(`<!--[0--><div class="flex items-center gap-1 flex-shrink-0 text-ink-muted"${attr("title", item.location_hint)}>`);
      Map_pin($$renderer2, { class: "w-3 h-3 text-stone-400" });
      $$renderer2.push(`<!----> <span class="truncate max-w-[80px]">${escape_html(item.location_hint)}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">`);
    if (item.status === "available") {
      $$renderer2.push(`<!--[0--><button type="button" class="w-full py-2.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"><span>Ajukan Pinjam</span> `);
      Arrow_up_right($$renderer2, { class: "w-3.5 h-3.5 stroke-[2]" });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push(`<!--[-1--><a${attr("href", `/items/${stringify(item.id)}`)} class="w-full py-2 px-3 rounded-xl bg-surface-muted hover:bg-stone-200 text-ink-secondary text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-center"><span>Lihat Detail Barang</span></a>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { item, onBorrow });
  });
}
function BorrowModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let isOwnItem, daysCount;
    let item = $$props["item"];
    let onClose = $$props["onClose"];
    let onSuccess = $$props["onSuccess"];
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultStart = tomorrow.toISOString().split("T")[0];
    const defaultEndObj = new Date(tomorrow);
    defaultEndObj.setDate(defaultEndObj.getDate() + 2);
    const defaultEnd = defaultEndObj.toISOString().split("T")[0];
    let startDate = defaultStart;
    let endDate = defaultEnd;
    let purpose = "";
    isOwnItem = item.owner_id === (store_get($$store_subs ??= {}, "$authState", authState).resident?.id || store_get($$store_subs ??= {}, "$authState", authState).user?.id);
    daysCount = (() => {
      try {
        const s = new Date(startDate);
        const e = new Date(endDate);
        const diff = Math.ceil((e.getTime() - s.getTime()) / (1e3 * 3600 * 24)) + 1;
        return diff > 0 ? diff : 0;
      } catch {
        return 0;
      }
    })();
    $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-in fade-in duration-200"><div class="bg-white rounded-3xl border border-surface-border max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"><button type="button" class="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-muted text-ink-muted transition-colors" aria-label="Tutup modal">`);
    X($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Sparkles($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> `);
    if (item.ownership_type === "community") {
      $$renderer2.push(`<!--[0-->🏛️ Pinjam Inventaris Komunitas`);
    } else {
      $$renderer2.push(`<!--[-1-->🏠 Pinjam dari Tetangga`);
    }
    $$renderer2.push(`<!--]--></div> <h2 class="text-xl font-bold text-ink-primary tracking-tight">Ajukan Pinjam ${escape_html(item.name)}</h2> <p class="text-xs text-ink-secondary mt-1">`);
    if (item.ownership_type === "community") {
      $$renderer2.push(`<!--[0-->Status: <strong class="text-emerald-800 font-semibold">Aset Komunitas (${escape_html(item.community?.name || "Komunitas")})</strong> • Ditinjau oleh Pengurus`);
    } else {
      $$renderer2.push(`<!--[-1-->Pemilik barang: <strong class="text-ink-primary font-semibold">${escape_html(item.owner?.full_name || "Warga Komunitas")}</strong> • Ditinjau oleh Pemilik Langsung`);
    }
    $$renderer2.push(`<!--]--></p></div> `);
    if (item.borrowing_rules) {
      $$renderer2.push(`<!--[0--><div class="p-3.5 rounded-2xl bg-earth-light border border-earth-sand/50 text-xs text-earth-deep leading-relaxed"><span class="font-bold text-ink-primary">Aturan Pemilik:</span> ${escape_html(item.borrowing_rules)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (isOwnItem) {
      $$renderer2.push(`<!--[0--><div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">`);
      Circle_alert($$renderer2, { class: "w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" });
      $$renderer2.push(`<!----> <span>Anda adalah pemilik barang ini. Anda tidak dapat mengajukan pinjam ke diri sendiri.</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form class="space-y-4"><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label class="block text-xs font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">`);
    Calendar($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> Tanggal Mulai *</label> <input type="date"${attr("value", startDate)} required="" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"/></div> <div><label class="block text-xs font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">`);
    Calendar($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> Tanggal Selesai *</label> <input type="date"${attr("value", endDate)} required="" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"/></div></div> `);
    if (daysCount > 0) {
      $$renderer2.push(`<!--[0--><div class="text-[11px] font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 flex items-center justify-between"><span>Durasi Peminjaman:</span> <span>${escape_html(daysCount)} Hari</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div><label class="block text-xs font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">`);
    Message_square($$renderer2, { class: "w-3.5 h-3.5 text-brand-600" });
    $$renderer2.push(`<!----> Rencana Penggunaan (Opsional)</label> <textarea rows="3" placeholder="Contoh: Untuk pasang rak dinding di ruang tamu, atau perbaikan pagar rumah..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted resize-none">`);
    const $$body = escape_html(purpose);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <p class="text-[10px] text-ink-muted mt-1">Pesan ini membantu pemilik mengetahui kebutuhan penggunaan barang.</p></div> <div class="pt-3 border-t border-surface-border flex items-center justify-end gap-3"><button type="button" class="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-surface-muted transition-colors">Batal</button> <button type="submit"${attr("disabled", isOwnItem, true)} class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2">`);
    {
      $$renderer2.push(`<!--[-1--><span>Kirim Permintaan Pinjam</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></form></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { item, onClose, onSuccess });
  });
}
export {
  BorrowModal as B,
  ResourceCard as R
};
