import { d as attr, e as escape_html } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import "../../../chunks/client.js";
import "../../../chunks/Icon.js";
import { U as Users } from "../../../chunks/users.js";
import { A as Arrow_right } from "../../../chunks/arrow-right.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let name = "";
    let slug = "";
    let description = "";
    let location = "";
    let submitting = false;
    $$renderer2.push(`<div class="max-w-xl mx-auto space-y-8 animate-in fade-in duration-200 py-4"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Users($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Ruang Berbagi Baru</div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Buat Komunitas Baru</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Ciptakan ruang bersama untuk tetangga RT/RW, komplek perumahan, atau komunitas hobi Anda.</p></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form class="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 space-y-5 shadow-sm"><div><label for="community-name" class="block text-xs font-bold text-ink-primary mb-1.5">Nama Komunitas *</label> <input id="community-name" type="text"${attr("value", name)} required="" placeholder="Contoh: Jakarta Makers, Green Valley, RT 05 Commons..." class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"/></div> <div><div class="flex items-center justify-between mb-1.5"><label for="community-slug" class="block text-xs font-bold text-ink-primary">Slug / URL Komunitas *</label> <span class="text-[11px] text-ink-muted">Huruf kecil, angka &amp; strip (-)</span></div> <input id="community-slug" type="text"${attr("value", slug)} required="" placeholder="jakarta-makers" class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base font-mono"/> <div class="mt-2 text-[11px] text-ink-secondary bg-surface-muted px-3 py-1.5 rounded-lg border border-surface-border flex items-center gap-1.5"><span class="text-ink-muted">URL Pratinjau:</span> <code class="text-brand-700 font-semibold font-mono">common.app/c/${escape_html("nama-komunitas")}</code></div></div> <div><label for="community-desc" class="block text-xs font-bold text-ink-primary mb-1.5">Deskripsi Komunitas</label> <textarea id="community-desc" rows="3" placeholder="Jelaskan tujuan komunitas ini dan jenis alat/sumber daya apa yang akan dibagikan bersama..." class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted resize-none">`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div><label for="community-loc" class="block text-xs font-bold text-ink-primary mb-1.5">Lokasi (Opsional)</label> <input id="community-loc" type="text"${attr("value", location)} placeholder="Contoh: Komp. Griya Harmoni, Jakarta Selatan" class="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-xs font-medium text-ink-primary bg-surface-base placeholder:text-ink-muted"/></div> <div class="p-3.5 rounded-2xl bg-earth-light border border-earth-sand/50 text-[11px] text-earth-deep leading-relaxed">💡 <strong>Catatan:</strong> Sebagai pembuat, Anda akan otomatis menjadi Administrator dan anggota pertama dari komunitas ini.</div> <div class="pt-2"><button type="submit"${attr("disabled", submitting, true)} class="w-full py-3 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2">`);
    {
      $$renderer2.push(`<!--[-1--><span>Buat &amp; Buka Komunitas</span> `);
      Arrow_right($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]--></button></div></form></div>`);
  });
}
export {
  _page as default
};
