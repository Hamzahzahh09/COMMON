import { s as sanitize_props, a as spread_props, b as slot, i as attr_class, d as attr, j as ensure_array_like, e as escape_html, f as bind_props } from "./index.js";
import "./client.js";
import { I as Icon } from "./Icon.js";
import { X } from "./x.js";
import { S as Sparkles } from "./sparkles.js";
import { P as Plus } from "./plus.js";
function Image($$renderer, $$props) {
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
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2",
        "ry": "2"
      }
    ],
    ["circle", { "cx": "9", "cy": "9", "r": "2" }],
    ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
  ];
  Icon($$renderer, spread_props([
    { name: "image" },
    $$sanitized_props,
    {
      /**
       * @component @name Image
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image
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
function ShareResourceModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let onClose = $$props["onClose"];
    let onSuccess = $$props["onSuccess"];
    let name = "";
    let category = "Tools";
    let condition = "Sangat Bagus";
    let locationHint = "";
    let description = "";
    let borrowingRules = "Harap dikembalikan dalam keadaan bersih dan lengkap.";
    let imageUrl = "";
    let joinedCommunities = [];
    const CATEGORIES = ["Tools", "Home", "Events", "Outdoor", "Electronics"];
    const CONDITIONS = ["Seperti Baru", "Sangat Bagus", "Bagus", "Cukup Layak"];
    $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-in fade-in duration-200"><div class="bg-white rounded-3xl border border-surface-border max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"><button type="button" class="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-muted text-ink-muted transition-colors" aria-label="Tutup modal">`);
    X($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Sparkles($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Inventaris Bersama</div> <h2 class="text-xl font-bold text-ink-primary tracking-tight">Bagikan Barang ke Komunitas</h2> <p class="text-xs text-ink-secondary mt-1">Jadikan alat yang jarang Anda pakai bermanfaat untuk tetangga sekitar.</p></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form class="space-y-4"><div><label for="share-community" class="block text-xs font-bold text-ink-primary mb-1.5">Pilih Komunitas *</label> `);
    {
      $$renderer2.push(`<!--[0--><div class="text-xs text-ink-muted py-2">Memuat daftar komunitas Anda...</div>`);
    }
    $$renderer2.push(`<!--]--></div> <div><span class="block text-xs font-bold text-ink-primary mb-1.5">Model Kepemilikan Barang *</span> <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5"><button type="button"${attr_class(`p-3 rounded-2xl border text-left transition-all ${"border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10"}`)}><div class="flex items-center gap-1.5"><span class="text-sm">🏠</span> <span class="text-xs font-bold text-ink-primary">Personal Resource</span></div> <p class="text-[11px] text-ink-secondary mt-1 leading-snug">Milik pribadi Anda. Setiap permintaan pinjam ditinjau dan disetujui oleh Anda sendiri.</p></button> <button type="button"${attr_class(`p-3 rounded-2xl border text-left transition-all ${"border-surface-border hover:bg-surface-muted"}`)}><div class="flex items-center gap-1.5"><span class="text-sm">🏛️</span> <span class="text-xs font-bold text-ink-primary">Community Resource</span></div> <p class="text-[11px] text-ink-secondary mt-1 leading-snug">Aset bersama komunitas. Permintaan pinjam dapat disetujui bersama oleh admin komunitas.</p></button></div></div> <div><label for="share-name" class="block text-xs font-bold text-ink-primary mb-1.5">Nama Barang *</label> <input id="share-name" type="text"${attr("value", name)} required="" placeholder="Contoh: Bor Listrik Bosch 650W, Tangga Lipat 4M..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"/></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label for="share-category" class="block text-xs font-bold text-ink-primary mb-1.5">Kategori</label> `);
    $$renderer2.select(
      {
        id: "share-category",
        value: category,
        class: "w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(CATEGORIES);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let cat = each_array_1[$$index_1];
          $$renderer3.option({ value: cat }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cat)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label for="share-condition" class="block text-xs font-bold text-ink-primary mb-1.5">Kondisi</label> `);
    $$renderer2.select(
      {
        id: "share-condition",
        value: condition,
        class: "w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(CONDITIONS);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let cond = each_array_2[$$index_2];
          $$renderer3.option({ value: cond }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cond)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div></div> <div><label for="share-location" class="block text-xs font-bold text-ink-primary mb-1.5">Petunjuk Lokasi Pengambilan</label> <input id="share-location" type="text"${attr("value", locationHint)} placeholder="Contoh: Blok B3 No. 7 atau Pos Satpam Utama" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"/></div> <div><label for="share-description" class="block text-xs font-bold text-ink-primary mb-1.5">Deskripsi / Kelengkapan</label> <textarea id="share-description" rows="2" placeholder="Deskripsikan fungsi barang, kelengkapan mata bor/kabel, dll..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted resize-none">`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div><label for="share-rules" class="block text-xs font-bold text-ink-primary mb-1.5">Aturan Peminjaman</label> <input id="share-rules" type="text"${attr("value", borrowingRules)} placeholder="Contoh: Maksimal 3 hari, bersihkan setelah dipakai..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base"/></div> <div><div class="flex items-center justify-between mb-1.5"><label for="share-image" class="block text-xs font-bold text-ink-primary">URL Foto Barang (Opsional)</label> <button type="button" class="text-[11px] text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">`);
    Image($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> Gunakan Foto Contoh</button></div> <input id="share-image" type="url"${attr("value", imageUrl)} placeholder="https://images.unsplash.com/..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"/></div> <div class="pt-3 border-t border-surface-border flex items-center justify-end gap-3"><button type="button" class="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-surface-muted transition-colors">Batal</button> <button type="submit"${attr("disabled", joinedCommunities.length === 0, true)} class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2">`);
    {
      $$renderer2.push("<!--[-1-->");
      Plus($$renderer2, { class: "w-4 h-4 stroke-[2.5]" });
      $$renderer2.push(`<!----> <span>Bagikan Sekarang</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></form></div></div>`);
    bind_props($$props, { onClose, onSuccess });
  });
}
export {
  ShareResourceModal as S
};
