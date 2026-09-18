import { s as sanitize_props, a as spread_props, b as slot, c as store_get, k as head, d as attr, e as escape_html, j as ensure_array_like, i as attr_class, u as unsubscribe_stores, l as stringify } from "../../../chunks/index.js";
import { I as Icon, a as authState, D as DEMO_RESIDENTS } from "../../../chunks/Icon.js";
import { c as getMyCommunities } from "../../../chunks/communities.api.js";
import { g as getItems } from "../../../chunks/items.api.js";
import { a as getMyRequests, g as getIncomingRequests } from "../../../chunks/borrowing.api.js";
import { S as StatusBadge } from "../../../chunks/StatusBadge.js";
import { E as EmptyState } from "../../../chunks/EmptyState.js";
import { S as Shield } from "../../../chunks/shield.js";
import { S as Sparkles } from "../../../chunks/sparkles.js";
import { P as Package } from "../../../chunks/package.js";
import { U as Users } from "../../../chunks/users.js";
import { C as Clock } from "../../../chunks/clock.js";
import { I as Inbox } from "../../../chunks/inbox.js";
import { A as Arrow_up_right } from "../../../chunks/arrow-up-right.js";
function External_link($$renderer, $$props) {
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
    ["path", { "d": "M15 3h6v6" }],
    ["path", { "d": "M10 14 21 3" }],
    [
      "path",
      {
        "d": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "external-link" },
    $$sanitized_props,
    {
      /**
       * @component @name ExternalLink
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgM2g2djYiIC8+CiAgPHBhdGggZD0iTTEwIDE0IDIxIDMiIC8+CiAgPHBhdGggZD0iTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/external-link
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
function Log_out($$renderer, $$props) {
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
    ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
    ["polyline", { "points": "16 17 21 12 16 7" }],
    ["line", { "x1": "21", "x2": "9", "y1": "12", "y2": "12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "log-out" },
    $$sanitized_props,
    {
      /**
       * @component @name LogOut
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjEgMTIgMTYgNyIgLz4KICA8bGluZSB4MT0iMjEiIHgyPSI5IiB5MT0iMTIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/log-out
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
    let joinedCommunities = [];
    let myItems = [];
    let myBorrowsCount = 0;
    let incomingCount = 0;
    let loading = true;
    let switchingResident = false;
    async function loadProfileData() {
      loading = true;
      try {
        const [commRes, itemsRes, borrowsRes, incomingRes] = await Promise.all([
          getMyCommunities(),
          getItems(),
          getMyRequests(),
          getIncomingRequests()
        ]);
        if (commRes.success && commRes.data) {
          joinedCommunities = commRes.data;
        }
        if (itemsRes.success && itemsRes.data) {
          const currentUserId = store_get($$store_subs ??= {}, "$authState", authState).resident?.id || store_get($$store_subs ??= {}, "$authState", authState).user?.id;
          myItems = itemsRes.data.filter((i) => i.owner_id === currentUserId);
        }
        if (borrowsRes.success && borrowsRes.data) {
          myBorrowsCount = borrowsRes.data.length;
        }
        if (incomingRes.success && incomingRes.data) {
          incomingCount = incomingRes.data.length;
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        loading = false;
      }
    }
    let lastResidentId = "";
    if (store_get($$store_subs ??= {}, "$authState", authState).resident && store_get($$store_subs ??= {}, "$authState", authState).resident.id !== lastResidentId) {
      lastResidentId = store_get($$store_subs ??= {}, "$authState", authState).resident.id;
      loadProfileData();
    }
    head("maq4gq", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Profil Warga — COMMON</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-[#F7F6F2] py-8 md:py-12"><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"><div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 shadow-sm"><div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"><div class="flex items-center gap-5"><div class="relative"><img${attr("src", store_get($$store_subs ??= {}, "$authState", authState).resident?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")}${attr("alt", store_get($$store_subs ??= {}, "$authState", authState).resident?.name || "Warga")} class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#F7F6F2] shadow-sm"/> <span class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" title="Aktif"></span></div> <div><div class="flex items-center gap-2 flex-wrap"><h1 class="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1A]">${escape_html(store_get($$store_subs ??= {}, "$authState", authState).resident?.name || "Warga Komunitas")}</h1> <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">`);
    Shield($$renderer2, { class: "w-3 h-3 text-emerald-600" });
    $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$authState", authState).resident?.role || "Warga Terverifikasi")}</span></div> <p class="text-sm text-[#736B5E] mt-1">${escape_html(store_get($$store_subs ??= {}, "$authState", authState).resident?.email || store_get($$store_subs ??= {}, "$authState", authState).user?.email || "email@commons.id")}</p> <p class="text-sm font-medium text-[#2F6B4F] mt-1.5 flex items-center gap-1.5">`);
    Sparkles($$renderer2, { class: "w-4 h-4 text-emerald-600" });
    $$renderer2.push(`<!----> ${escape_html(store_get($$store_subs ??= {}, "$authState", authState).resident?.desc || "Warga Komunitas RT 05")}</p></div></div> <div class="flex items-center gap-3 w-full sm:w-auto"><button class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-white text-sm font-medium text-[#736B5E] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors">`);
    Log_out($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Keluar</button></div></div> <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E5E0D8]"><div class="bg-[#F7F6F2] rounded-xl p-4"><div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">`);
    Package($$renderer2, { class: "w-4 h-4 text-[#2F6B4F]" });
    $$renderer2.push(`<!----> Barang Dibagikan</div> <div class="font-serif text-2xl font-bold text-[#1C1C1A]">${escape_html(myItems.length)}</div></div> <div class="bg-[#F7F6F2] rounded-xl p-4"><div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">`);
    Users($$renderer2, { class: "w-4 h-4 text-[#2F6B4F]" });
    $$renderer2.push(`<!----> Komunitas Diikuti</div> <div class="font-serif text-2xl font-bold text-[#1C1C1A]">${escape_html(joinedCommunities.length)}</div></div> <div class="bg-[#F7F6F2] rounded-xl p-4"><div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">`);
    Clock($$renderer2, { class: "w-4 h-4 text-[#2F6B4F]" });
    $$renderer2.push(`<!----> Dipinjam Saya</div> <div class="font-serif text-2xl font-bold text-[#1C1C1A]">${escape_html(myBorrowsCount)}</div></div> <div class="bg-[#F7F6F2] rounded-xl p-4"><div class="flex items-center gap-2 text-[#736B5E] text-xs font-medium uppercase tracking-wider mb-1">`);
    Inbox($$renderer2, { class: "w-4 h-4 text-[#2F6B4F]" });
    $$renderer2.push(`<!----> Permintaan Masuk</div> <div class="font-serif text-2xl font-bold text-[#1C1C1A]">${escape_html(incomingCount)}</div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm"><div class="flex items-center justify-between mb-5"><div><h2 class="font-serif text-lg font-bold text-[#1C1C1A] flex items-center gap-2">`);
    Package($$renderer2, { class: "w-5 h-5 text-[#2F6B4F]" });
    $$renderer2.push(`<!----> Barang yang Saya Bagikan (${escape_html(myItems.length)})</h2> <p class="text-xs text-[#736B5E] mt-0.5">Sumber daya fisik yang Anda sediakan untuk tetangga.</p></div> <a href="/discover" class="text-xs font-semibold text-[#2F6B4F] hover:underline flex items-center gap-1">Lihat Semua `);
    Arrow_up_right($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----></a></div> `);
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(Array(3));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$renderer2.push(`<div class="h-16 bg-[#F7F6F2] animate-pulse rounded-xl"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else if (myItems.length === 0) {
      $$renderer2.push("<!--[1-->");
      EmptyState($$renderer2, {
        title: "Belum ada barang dibagikan",
        description: "Anda belum mendaftarkan barang untuk dipinjamkan ke tetangga. Klik tombol Bagikan Barang di navigasi atas untuk mulai!"
      });
    } else {
      $$renderer2.push(`<!--[-1--><div class="divide-y divide-[#E5E0D8]"><!--[-->`);
      const each_array_1 = ensure_array_like(myItems);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        $$renderer2.push(`<div class="py-3.5 flex items-center justify-between gap-4"><div class="flex items-center gap-3 min-w-0">`);
        if (item.image_url) {
          $$renderer2.push(`<!--[0--><img${attr("src", item.image_url)}${attr("alt", item.name)} class="w-12 h-12 rounded-lg object-cover bg-[#F7F6F2] flex-shrink-0"/>`);
        } else {
          $$renderer2.push(`<!--[-1--><div class="w-12 h-12 rounded-lg bg-[#E5E0D8] flex items-center justify-center text-[#736B5E] flex-shrink-0">`);
          Package($$renderer2, { class: "w-5 h-5" });
          $$renderer2.push(`<!----></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="min-w-0"><a${attr("href", `/items/${stringify(item.id)}`)} class="text-sm font-bold text-[#1C1C1A] hover:text-[#2F6B4F] transition-colors truncate block">${escape_html(item.name)}</a> <p class="text-xs text-[#736B5E] truncate">Kategori: ${escape_html(item.category || "Alat")} • ${escape_html(item.location_hint || "RT 05")}</p></div></div> <div class="flex items-center gap-3 flex-shrink-0">`);
        StatusBadge($$renderer2, { status: item.status });
        $$renderer2.push(`<!----> <a${attr("href", `/items/${stringify(item.id)}`)} class="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E5E0D8] hover:bg-[#F7F6F2] text-[#1C1C1A] transition-colors">Detail</a></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm"><div class="flex items-center justify-between mb-5"><div><h2 class="font-serif text-lg font-bold text-[#1C1C1A] flex items-center gap-2">`);
    Users($$renderer2, { class: "w-5 h-5 text-[#2F6B4F]" });
    $$renderer2.push(`<!----> Komunitas Diikuti (${escape_html(joinedCommunities.length)})</h2> <p class="text-xs text-[#736B5E] mt-0.5">Komunitas lingkungan tempat Anda aktif meminjam dan berbagi.</p></div> <a href="/communities" class="text-xs font-semibold text-[#2F6B4F] hover:underline flex items-center gap-1">Jelajahi Direktori `);
    Arrow_up_right($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----></a></div> `);
    if (loading) {
      $$renderer2.push(`<!--[0--><div class="space-y-3"><!--[-->`);
      const each_array_2 = ensure_array_like(Array(2));
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        each_array_2[$$index_2];
        $$renderer2.push(`<div class="h-16 bg-[#F7F6F2] animate-pulse rounded-xl"></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else if (joinedCommunities.length === 0) {
      $$renderer2.push("<!--[1-->");
      EmptyState($$renderer2, {
        title: "Belum bergabung dengan komunitas",
        description: "Jelajahi komunitas di sekitar Anda dan klik Gabung untuk mulai berbagi akses.",
        actionText: "Temukan Komunitas",
        actionHref: "/communities"
      });
    } else {
      $$renderer2.push(`<!--[-1--><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><!--[-->`);
      const each_array_3 = ensure_array_like(joinedCommunities);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let comm = each_array_3[$$index_3];
        $$renderer2.push(`<div class="p-4 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] flex flex-col justify-between hover:border-[#2F6B4F] transition-all"><div><div class="flex items-center justify-between gap-2 mb-2"><span class="text-xs font-mono font-bold text-[#2F6B4F]">c/${escape_html(comm.slug)}</span> <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Anggota</span></div> <h3 class="text-sm font-bold text-[#1C1C1A] line-clamp-1">${escape_html(comm.name)}</h3> <p class="text-xs text-[#736B5E] mt-1 line-clamp-2">${escape_html(comm.description || "Komunitas berbagi warga terpercaya.")}</p></div> <div class="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs"><span class="text-[#736B5E]">${escape_html(comm.member_count || 1)} Warga</span> <a${attr("href", `/c/${stringify(comm.slug)}`)} class="font-semibold text-[#2F6B4F] hover:underline inline-flex items-center gap-1">Buka Hub `);
        External_link($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----></a></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="space-y-6"><div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm sticky top-24"><div class="flex items-center gap-2 mb-2">`);
    Sparkles($$renderer2, { class: "w-5 h-5 text-emerald-600" });
    $$renderer2.push(`<!----> <h3 class="font-serif text-base font-bold text-[#1C1C1A]">Simulasi Identitas Warga</h3></div> <p class="text-xs text-[#736B5E] mb-5 leading-relaxed">COMMON dirancang untuk multi-warga. Klik salah satu tetangga di bawah untuk beralih perspektif secara instan:</p> <div class="space-y-2.5 max-h-[500px] overflow-y-auto pr-1"><!--[-->`);
    const each_array_4 = ensure_array_like(DEMO_RESIDENTS);
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let resident = each_array_4[$$index_4];
      const isCurrent = store_get($$store_subs ??= {}, "$authState", authState).resident?.id === resident.id;
      $$renderer2.push(`<button type="button"${attr("disabled", switchingResident, true)}${attr_class(`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${isCurrent ? "border-[#2F6B4F] bg-[#2F6B4F]/5 ring-1 ring-[#2F6B4F]" : "border-[#E5E0D8] bg-white hover:bg-[#F7F6F2]"}`)}><img${attr("src", resident.avatar)}${attr("alt", resident.name)} class="w-10 h-10 rounded-full object-cover flex-shrink-0"/> <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-1"><span class="text-xs font-bold text-[#1C1C1A] truncate">${escape_html(resident.name)}</span> `);
      if (isCurrent) {
        $$renderer2.push(`<!--[0--><span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2F6B4F] text-white">Aktif</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <p class="text-[11px] text-[#736B5E] truncate">${escape_html(resident.desc)}</p></div></button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-6 pt-4 border-t border-[#E5E0D8] text-[11px] text-[#736B5E] text-center">💡 Setiap profil memiliki inventaris barang dan permintaan peminjaman yang berbeda.</div></div></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
