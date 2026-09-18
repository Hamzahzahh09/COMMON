import { k as head, i as attr_class, e as escape_html } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import "../../../chunks/Icon.js";
import { M as Message_square } from "../../../chunks/message-square.js";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let myRequests = [];
    let incomingRequests = [];
    [
      ...myRequests.map((r) => ({ ...r, role: "borrower" })),
      ...incomingRequests.map((r) => ({ ...r, role: "owner" }))
    ].filter((t) => {
      return true;
    });
    head("1iamj51", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Pesan &amp; Koordinasi — COMMON</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Message_square($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Komunikasi &amp; Koordinasi</div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Pesan Antar Warga</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Koordinasikan jadwal pengambilan, titik temu, dan kondisi barang langsung dengan tetangga.</p></div> <div class="inline-flex p-1 rounded-2xl bg-surface-muted border border-surface-border text-xs font-semibold"><button type="button"${attr_class(`px-4 py-2 rounded-xl transition-all ${"bg-white text-ink-primary shadow-sm font-bold"}`)}>Semua Percakapan (${escape_html(myRequests.length + incomingRequests.length)})</button> <button type="button"${attr_class(`px-4 py-2 rounded-xl transition-all ${"text-ink-secondary hover:text-ink-primary"}`)}>Barang yang Saya Pinjam (${escape_html(myRequests.length)})</button> <button type="button"${attr_class(`px-4 py-2 rounded-xl transition-all ${"text-ink-secondary hover:text-ink-primary"}`)}>Barang Milik Saya (${escape_html(incomingRequests.length)})</button></div> `);
    {
      $$renderer2.push(`<!--[0--><div class="py-24 text-center">`);
      Refresh_cw($$renderer2, { class: "w-7 h-7 text-brand-500 animate-spin mx-auto mb-3" });
      $$renderer2.push(`<!----> <p class="text-xs font-semibold text-ink-secondary">Memuat daftar koordinasi...</p></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
