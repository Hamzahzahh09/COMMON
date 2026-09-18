import { c as store_get, k as head, j as ensure_array_like, i as attr_class, e as escape_html, u as unsubscribe_stores } from "../../../chunks/index.js";
import { s as savedItems } from "../../../chunks/saved.js";
import { R as ResourceCard, B as BorrowModal } from "../../../chunks/BorrowModal.js";
import { E as EmptyState } from "../../../chunks/EmptyState.js";
import { B as Bookmark } from "../../../chunks/bookmark.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let filteredItems;
    let borrowingItem = null;
    let selectedCategory = "Semua";
    const CATEGORIES = ["Semua", "Tools", "Home", "Events", "Outdoor", "Electronics"];
    filteredItems = store_get($$store_subs ??= {}, "$savedItems", savedItems).filter((i) => {
      return true;
    });
    head("9wavdg", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Barang Tersimpan — COMMON</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8 animate-in fade-in duration-200 max-w-7xl mx-auto"><div><div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#1E4432] text-xs font-semibold mb-2">`);
    Bookmark($$renderer2, { class: "w-3.5 h-3.5 text-brand-500" });
    $$renderer2.push(`<!----> Koleksi Tersimpan</div> <h1 class="text-3xl font-extrabold text-ink-primary tracking-tight">Barang yang Anda Simpan</h1> <p class="text-xs sm:text-sm text-ink-secondary mt-1">Akses cepat ke alat dan peralatan komunitas yang sewaktu-waktu ingin Anda pinjam.</p></div> `);
    if (store_get($$store_subs ??= {}, "$savedItems", savedItems).length === 0) {
      $$renderer2.push("<!--[0-->");
      EmptyState($$renderer2, {
        title: "Belum Ada Barang yang Disimpan",
        description: "Jelajahi inventaris komunitas dan klik ikon bookmark pada barang yang menarik untuk menyimpannya di sini.",
        actionText: "Jelajahi Inventaris",
        actionHref: "/discover"
      });
    } else {
      $$renderer2.push(`<!--[-1--><div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"><!--[-->`);
      const each_array = ensure_array_like(CATEGORIES);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        $$renderer2.push(`<button type="button"${attr_class(`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-brand-500 text-white font-bold shadow-sm" : "bg-white border border-surface-border text-ink-secondary hover:text-ink-primary"}`)}>${escape_html(cat)}</button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"><!--[-->`);
      const each_array_1 = ensure_array_like(filteredItems);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        ResourceCard($$renderer2, { item, onBorrow: (i) => borrowingItem = i });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (borrowingItem) {
      $$renderer2.push("<!--[0-->");
      BorrowModal($$renderer2, {
        item: borrowingItem,
        onClose: () => borrowingItem = null,
        onSuccess: () => {
          borrowingItem = null;
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
