import { s as sanitize_props, a as spread_props, b as slot, k as head, j as ensure_array_like, e as escape_html, d as attr } from "../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { I as Icon } from "../../chunks/Icon.js";
import "../../chunks/client.js";
import "../../chunks/saved.js";
import { S as Sparkles } from "../../chunks/sparkles.js";
import { C as Compass } from "../../chunks/compass.js";
import { A as Arrow_right } from "../../chunks/arrow-right.js";
import { B as Boxes } from "../../chunks/boxes.js";
import { H as Heart_handshake } from "../../chunks/heart-handshake.js";
import { C as Calendar } from "../../chunks/calendar.js";
import { C as Circle_check } from "../../chunks/circle-check.js";
import { R as Refresh_cw } from "../../chunks/refresh-cw.js";
import { C as Clock } from "../../chunks/clock.js";
import { P as Package } from "../../chunks/package.js";
import { U as Users } from "../../chunks/users.js";
import { S as Shield } from "../../chunks/shield.js";
function Dollar_sign($$renderer, $$props) {
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
    ["line", { "x1": "12", "x2": "12", "y1": "2", "y2": "22" }],
    [
      "path",
      { "d": "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "dollar-sign" },
    $$sanitized_props,
    {
      /**
       * @component @name DollarSign
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjIiIHkyPSIyMiIgLz4KICA8cGF0aCBkPSJNMTcgNUg5LjVhMy41IDMuNSAwIDAgMCAwIDdoNWEzLjUgMy41IDAgMCAxIDAgN0g2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/dollar-sign
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
function Hand_helping($$renderer, $$props) {
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
    [
      "path",
      { "d": "M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" }
    ],
    [
      "path",
      {
        "d": "m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"
      }
    ],
    ["path", { "d": "m2 13 6 6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "hand-helping" },
    $$sanitized_props,
    {
      /**
       * @component @name HandHelping
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMTJoMmEyIDIgMCAxIDAgMC00aC0zYy0uNiAwLTEuMS4yLTEuNC42TDMgMTQiIC8+CiAgPHBhdGggZD0ibTcgMTggMS42LTEuNGMuMy0uNC44LS42IDEuNC0uNmg0YzEuMSAwIDIuMS0uNCAyLjgtMS4ybDQuNi00LjRhMiAyIDAgMCAwLTIuNzUtMi45MWwtNC4yIDMuOSIgLz4KICA8cGF0aCBkPSJtMiAxMyA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/hand-helping
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
function Repeat($$renderer, $$props) {
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
    ["path", { "d": "m17 2 4 4-4 4" }],
    ["path", { "d": "M3 11v-1a4 4 0 0 1 4-4h14" }],
    ["path", { "d": "m7 22-4-4 4-4" }],
    ["path", { "d": "M21 13v1a4 4 0 0 1-4 4H3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "repeat" },
    $$sanitized_props,
    {
      /**
       * @component @name Repeat
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTcgMiA0IDQtNCA0IiAvPgogIDxwYXRoIGQ9Ik0zIDExdi0xYTQgNCAwIDAgMSA0LTRoMTQiIC8+CiAgPHBhdGggZD0ibTcgMjItNC00IDQtNCIgLz4KICA8cGF0aCBkPSJNMjEgMTN2MWE0IDQgMCAwIDEtNCA0SDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/repeat
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
    let recentActivities = [];
    function formatRelativeTime(dateString) {
      if (!dateString) return "Baru-baru ini";
      try {
        const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1e3);
        if (diff < 60) return "Baru saja";
        if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} menit lalu`;
        if (diff < 86400) return `${Math.max(1, Math.floor(diff / 3600))} jam lalu`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
        return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      } catch {
        return "Baru-baru ini";
      }
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>COMMON — Shared Infrastructure for Real Communities</title>`);
      });
      $$renderer3.push(`<meta name="description" content="COMMON helps communities share resources, borrow what they need, and access more without unnecessary ownership."/>`);
    });
    $$renderer2.push(`<div class="space-y-16 sm:space-y-24"><section class="relative pt-6 sm:pt-12 pb-6 sm:pb-12 text-center max-w-4xl mx-auto"><div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFEA] text-[#1E4432] border border-[#C8DCD0] text-xs font-bold mb-6">`);
    Sparkles($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Shared infrastructure for real communities.</div>  <h1 class="text-4xl sm:text-6xl font-extrabold text-ink-primary tracking-tight leading-[1.14]">Share more.<br/> Own less.<br/> <span class="text-brand-500">Access together.</span></h1> <p class="mt-6 text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl mx-auto font-normal">A community-powered way to access the things you need without everyone needing to own them.</p> <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"><a href="/discover" class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-900/10 transition-all active:scale-95 flex items-center justify-center gap-2">`);
    Compass($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Discover resources</span> `);
    Arrow_right($$renderer2, { class: "w-4 h-4 ml-0.5" });
    $$renderer2.push(`<!----></a> <a href="/login" class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-surface-muted text-ink-primary font-bold text-sm border border-surface-border transition-all active:scale-95 flex items-center justify-center gap-2"><span>Join COMMON</span></a></div> <div class="mt-10 pt-6 border-t border-surface-border text-xs text-ink-muted flex items-center justify-center gap-2 tracking-wide uppercase font-semibold"><span>Prinsip Inti:</span> <strong class="text-ink-primary font-bold text-sm">ACCESS OVER OWNERSHIP.</strong></div></section>  <section id="why-common" class="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-sm"><div class="max-w-3xl mx-auto text-center mb-12"><span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">Why COMMON Exists</span> <h2 class="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-3 tracking-tight">Most things are used less than we think.</h2> <p class="text-xs sm:text-sm text-ink-secondary mt-3 leading-relaxed">Many household and community resources are only used occasionally: electric drills, projectors, cameras, printers, ladders, and event equipment. COMMON turns underused capacity into shared neighborhood access.</p></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="p-6 rounded-2xl bg-[#F7F6F2] border border-surface-border flex flex-col justify-between"><div><div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">`);
    Dollar_sign($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></div> <h3 class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">LOWER COST</h3> <h4 class="text-base font-bold text-ink-primary tracking-tight">Not everyone needs to buy the same thing.</h4> <p class="text-xs text-ink-secondary mt-2 leading-relaxed">Warga menghemat pengeluaran rumah tangga dengan meminjam alat yang sudah ada di lingkungan tetangga, alih-alih membeli baru untuk keperluan sesaat.</p></div></div> <div class="p-6 rounded-2xl bg-[#F7F6F2] border border-surface-border flex flex-col justify-between"><div><div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">`);
    Boxes($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></div> <h3 class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">BETTER UTILIZATION</h3> <h4 class="text-base font-bold text-ink-primary tracking-tight">Underused resources can help more people.</h4> <p class="text-xs text-ink-secondary mt-2 leading-relaxed">Barang fisik yang mengendap di garasi mendapatkan nilai guna maksimal ketika disirkulasikan secara aman kepada sesama anggota komunitas.</p></div></div> <div class="p-6 rounded-2xl bg-[#F7F6F2] border border-surface-border flex flex-col justify-between"><div><div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">`);
    Heart_handshake($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></div> <h3 class="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">STRONGER COMMUNITIES</h3> <h4 class="text-base font-bold text-ink-primary tracking-tight">Sharing creates trust and collaboration.</h4> <p class="text-xs text-ink-secondary mt-2 leading-relaxed">Interaksi pinjam-meminjam menumbuhkan keakraban sosial nyata, memperkuat rasa saling percaya, dan menghidupkan kembali budaya gotong royong.</p></div></div></div></section>  <section class="bg-[#1E4432] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden"><div class="max-w-3xl mx-auto text-center mb-10"><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">`);
    Sparkles($$renderer2, { class: "w-3.5 h-3.5 text-emerald-300" });
    $$renderer2.push(`<!----> Defining Experience</div> <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">"I NEED" ↔ "I HAVE"</h2> <p class="text-xs sm:text-sm text-emerald-100/80 mt-2 max-w-xl mx-auto leading-relaxed">Sampaikan apa yang sedang Anda butuhkan, dan tetangga yang memilikinya dapat langsung merespons dan menawarkan alat mereka.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-center"><div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4"><div class="flex items-center justify-between"><span class="px-2.5 py-1 rounded-lg bg-amber-400 text-amber-950 text-xs font-black tracking-wider uppercase">I NEED</span> <span class="text-xs text-emerald-200 font-medium">21–23 September</span></div> <div><h3 class="text-lg font-extrabold text-white">Projector</h3> <p class="text-xs text-emerald-100/70 mt-1">Purpose: Community event</p></div> <div class="pt-3 border-t border-white/10 text-xs text-emerald-200 flex items-center justify-between"><span>Posted by Dian</span> <span class="text-amber-300 font-semibold">• Awaiting offers</span></div></div> <div class="bg-white text-ink-primary rounded-2xl p-6 border border-white shadow-xl space-y-4"><div class="flex items-center justify-between"><span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black tracking-wider uppercase">I HAVE</span> <span class="text-xs text-brand-700 font-bold">Available: Sept 21–23</span></div> <div><h3 class="text-lg font-extrabold text-ink-primary">Epson Projector</h3> <p class="text-xs text-ink-secondary mt-1">Shared by Raka • Lengkap kabel HDMI &amp; tas jinjing</p></div> <a href="/needs" class="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"><span>[Offer This Item]</span> `);
    Arrow_right($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----></a></div></div></section>  <section id="how-it-works" class="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-sm"><div class="max-w-2xl mx-auto text-center mb-10"><span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">Alur Berbagi</span> <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-3 tracking-tight">How COMMON Works</h2> <p class="text-xs sm:text-sm text-ink-secondary mt-2">Empat langkah sederhana untuk meminjam dan mengembalikan sumber daya di komunitas Anda.</p></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between"><div><div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm mb-4">01</div> <h3 class="font-bold text-base text-ink-primary">Discover</h3> <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">Find resources available in your community. Telusuri katalog alat pertukangan, hobi, dan perlengkapan warga sekitar.</p></div> <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-brand-700 flex items-center gap-1">`);
    Compass($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> <span>Cari barang yang dibutuhkan</span></div></div> <div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between"><div><div class="w-10 h-10 rounded-xl bg-earth-sand/40 text-earth-deep flex items-center justify-center font-bold text-sm mb-4">02</div> <h3 class="font-bold text-base text-ink-primary">Request</h3> <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">Send a borrowing request. Ajukan durasi peminjaman dan maksud penggunaan kepada tetangga pemilik barang.</p></div> <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-earth-deep flex items-center gap-1">`);
    Calendar($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> <span>Pilih durasi tanggal pinjam</span></div></div> <div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between"><div><div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm mb-4">03</div> <h3 class="font-bold text-base text-ink-primary">Borrow</h3> <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">Use the resource after owner approves. Ambil barang sesuai petunjuk lokasi aman dari pemilik (pos satpam/rumah).</p></div> <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-brand-700 flex items-center gap-1">`);
    Circle_check($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> <span>Persetujuan langsung pemilik</span></div></div> <div class="p-5 rounded-2xl bg-surface-base border border-surface-border flex flex-col justify-between"><div><div class="w-10 h-10 rounded-xl bg-earth-sand/40 text-earth-deep flex items-center justify-center font-bold text-sm mb-4">04</div> <h3 class="font-bold text-base text-ink-primary">Return</h3> <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">Return it so another member can use it. Kembalikan tepat waktu dalam keadaan bersih untuk warga berikutnya.</p></div> <div class="mt-4 pt-3 border-t border-surface-border text-[11px] font-semibold text-earth-deep flex items-center gap-1">`);
    Repeat($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> <span>Sirkulasi alat terjaga rapi</span></div></div></div> <div class="mt-8 text-center pt-6 border-t border-surface-border text-xs sm:text-sm font-semibold text-ink-secondary"><span>"No marketplace. No unnecessary ownership. Just shared access."</span></div></section>  <section class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><span class="text-xs font-bold uppercase tracking-wider text-brand-600">Fondasi Platform</span> <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-1 tracking-tight">Communities are the foundation.</h2> <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl">Setiap komunitas memiliki ruangnya sendiri untuk berbagi resource, mengajukan kebutuhan, dan saling membantu.</p></div> <div class="flex items-center gap-2 self-start sm:self-auto"><a href="/create-community" class="px-3.5 py-2 rounded-xl bg-white hover:bg-surface-muted text-ink-primary text-xs font-bold border border-surface-border transition-colors">Create Your Community</a> <a href="/communities" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors"><span>Explore All Communities</span> `);
    Arrow_right($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></a></div></div> `);
    {
      $$renderer2.push(`<!--[0--><div class="py-12 text-center">`);
      Refresh_cw($$renderer2, { class: "w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" });
      $$renderer2.push(`<!----> <p class="text-xs text-ink-secondary font-medium">Memuat data komunitas...</p></div>`);
    }
    $$renderer2.push(`<!--]--></section>  <section class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><span class="text-xs font-bold uppercase tracking-wider text-brand-600">Inventaris Warga</span> <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-1 tracking-tight">Things ready to be borrowed.</h2> <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl">Alat pertukangan, hobi, dan perlengkapan rumah tangga milik warga sekitar yang siap dipinjam pakai hari ini.</p></div> <a href="/discover" class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors self-start sm:self-auto"><span>Lihat Katalog Lengkap</span> `);
    Arrow_right($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></a></div> `);
    {
      $$renderer2.push(`<!--[0--><div class="py-12 text-center">`);
      Refresh_cw($$renderer2, { class: "w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" });
      $$renderer2.push(`<!----> <p class="text-xs text-ink-secondary font-medium">Memuat inventaris barang...</p></div>`);
    }
    $$renderer2.push(`<!--]--></section>  <section class="bg-[#F3EFE6] rounded-3xl border border-[#E2DDD3] p-8 sm:p-10 shadow-sm"><div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8"><div class="max-w-xl"><span class="text-xs font-bold uppercase tracking-wider text-earth-deep bg-white px-3 py-1 rounded-full border border-earth-sand/50">Fitur Pembeda COMMON</span> <h2 class="text-2xl sm:text-3xl font-extrabold text-ink-primary mt-2 tracking-tight">Can't find what you need?</h2> <p class="text-xs sm:text-sm text-ink-secondary mt-1.5 leading-relaxed">Papan kebutuhan warga memungkinkan komunitas menemukan resource yang sedang dibutuhkan sebelum seseorang memutuskan untuk membeli baru.</p></div> <div class="flex items-center gap-2 self-start md:self-auto"><a href="/needs" class="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-surface-border text-ink-primary text-xs font-bold shadow-sm transition-all">Buka Papan Kebutuhan</a></div></div> `);
    {
      $$renderer2.push(`<!--[0--><div class="py-8 text-center">`);
      Refresh_cw($$renderer2, { class: "w-6 h-6 text-brand-500 animate-spin mx-auto mb-2" });
      $$renderer2.push(`<!----> <p class="text-xs text-ink-secondary font-medium">Memuat papan kebutuhan...</p></div>`);
    }
    $$renderer2.push(`<!--]--></section>  <section class="bg-white rounded-3xl border border-surface-border p-8 sm:p-10 shadow-sm"><div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6"><div><span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">Sirkulasi Langsung</span> <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-2 tracking-tight">What's happening in your communities?</h2> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Aktivitas sirkulasi alat dan interaksi gotong royong warga terkini yang bersumber dari sistem.</p></div> <div class="text-xs font-semibold text-ink-muted flex items-center gap-1.5 self-start sm:self-auto">`);
    Clock($$renderer2, { class: "w-3.5 h-3.5 text-stone-400" });
    $$renderer2.push(`<!----> <span>Pembaruan Real-Time</span></div></div> `);
    if (recentActivities.length > 0) {
      $$renderer2.push(`<!--[0--><div class="divide-y divide-surface-border"><!--[-->`);
      const each_array_3 = ensure_array_like(recentActivities);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let act = each_array_3[$$index_3];
        $$renderer2.push(`<div class="py-3.5 flex items-center justify-between gap-4"><div class="flex items-center gap-3 min-w-0"><div class="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">`);
        if (act.type === "item_shared") {
          $$renderer2.push("<!--[0-->");
          Package($$renderer2, { class: "w-4 h-4" });
        } else {
          $$renderer2.push("<!--[-1-->");
          Hand_helping($$renderer2, { class: "w-4 h-4" });
        }
        $$renderer2.push(`<!--]--></div> <div class="truncate text-xs sm:text-sm"><span class="font-bold text-ink-primary">${escape_html(act.actor)}</span> <span class="text-ink-secondary">${escape_html(act.type === "item_shared" ? "membagikan barang:" : "mengajukan kebutuhan:")}</span> <a${attr("href", act.link)} class="font-semibold text-brand-700 hover:underline">${escape_html(act.title)}</a> <span class="text-ink-muted text-xs hidden sm:inline">di ${escape_html(act.community)}</span></div></div> <div class="text-[11px] text-ink-muted whitespace-nowrap flex-shrink-0">${escape_html(formatRelativeTime(act.timestamp))}</div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><p class="text-xs text-ink-muted text-center py-6">Belum ada aktivitas sirkulasi barang terbaru di komunitas.</p>`);
    }
    $$renderer2.push(`<!--]--></section>  <section id="trust-safety" class="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-sm"><div class="max-w-2xl mx-auto text-center mb-10"><span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">Keamanan &amp; Etika Warga</span> <h2 class="text-2xl sm:text-3xl font-bold text-ink-primary mt-3 tracking-tight">Built on trust, not transactions.</h2> <p class="text-xs sm:text-sm text-ink-secondary mt-2">Berbagi pakai alat fisik menuntut rasa aman. COMMON mengintegrasikan prinsip transparansi dan konteks sosial nyata.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5"><div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">`);
    Users($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h4 class="font-bold text-sm text-ink-primary">VERIFIED MEMBERS</h4> <p class="text-xs text-ink-secondary leading-relaxed">Warga tergabung dalam komunitas lingkungan nyata (RT/komplek) dengan identitas yang saling dikenal, bukan profil anonim.</p></div> <div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5"><div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">`);
    Clock($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h4 class="font-bold text-sm text-ink-primary">BORROW HISTORY</h4> <p class="text-xs text-ink-secondary leading-relaxed">Riwayat persetujuan, durasi tanggal pakai, serta konfirmasi serah-terima dicatat transparan di dalam platform.</p></div> <div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5"><div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">`);
    Shield($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h4 class="font-bold text-sm text-ink-primary">COMMUNITY MODERATION</h4> <p class="text-xs text-ink-secondary leading-relaxed">Pengurus dan admin komunitas memiliki wewenang untuk menjaga etika peminjaman dan membantu penyelesaian kendala bersama.</p></div> <div class="p-5 rounded-2xl bg-surface-base border border-surface-border space-y-2.5"><div class="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">`);
    Circle_check($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <h4 class="font-bold text-sm text-ink-primary">CLEAR OWNERSHIP</h4> <p class="text-xs text-ink-secondary leading-relaxed">Setiap barang memiliki pemilik sah dengan aturan pakai (*borrowing rules*) dan lokasi pengambilan yang disepakati bersama.</p></div></div></section>  <section class="bg-surface-base rounded-3xl border border-surface-border p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs"><span class="text-xs font-bold uppercase tracking-wider text-brand-700">Dampak Nyata Komunitas</span> <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-surface-border"><div><div class="text-3xl sm:text-4xl font-black text-ink-primary tracking-tight">${escape_html("12+")}</div> <div class="text-xs font-semibold text-ink-secondary mt-1">Resources Shared</div></div> <div><div class="text-3xl sm:text-4xl font-black text-ink-primary tracking-tight">${escape_html("3+")}</div> <div class="text-xs font-semibold text-ink-secondary mt-1">Active Communities</div></div> <div><div class="text-3xl sm:text-4xl font-black text-ink-primary tracking-tight">${escape_html("50+")}</div> <div class="text-xs font-semibold text-ink-secondary mt-1">Connected Neighbors</div></div></div> <p class="mt-8 text-xs sm:text-sm text-ink-secondary italic max-w-lg mx-auto leading-relaxed">"Every shared item starts with someone choosing access over ownership."</p></section>  <section class="bg-brand-500 rounded-3xl text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl shadow-brand-900/10"><div class="max-w-2xl mx-auto relative z-10 space-y-4"><span class="inline-block px-3 py-1 rounded-full bg-brand-600 text-brand-100 text-[11px] font-bold uppercase tracking-wider">Mulai Sekarang</span> <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">Your community already has more than you think.</h2> <p class="text-xs sm:text-sm text-brand-100 leading-relaxed max-w-lg mx-auto">Gabungkan resource yang jarang digunakan, kebutuhan warga, dan orang-orang yang siap berbagi dalam satu tempat.</p> <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5"><a href="/communities" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-sm transition-colors">Join a Community</a> <a href="/create-community" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs border border-brand-400/40 transition-colors">Create a Community</a></div></div></section> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
