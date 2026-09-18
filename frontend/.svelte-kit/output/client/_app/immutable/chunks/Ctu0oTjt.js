import{T as d,Q as l,i as f}from"./DFjUdaBa.js";import{c as u,a as m}from"./Dgiyn77L.js";import{I as p,d as g}from"./DaED1CEB.js";import{l as v,b as _}from"./X5mKuWns.js";const i="common_saved_items_v1";function $(){if(typeof window>"u")return[];try{const e=localStorage.getItem(i);return e?JSON.parse(e):[]}catch{return[]}}const s=d($());typeof window<"u"&&s.subscribe(e=>{try{localStorage.setItem(i,JSON.stringify(e))}catch{}});function b(e){return l(s).some(r=>r.id===e)}function k(e){let t=!1;return s.update(r=>r.some(o=>o.id===e.id)?(t=!1,r.filter(o=>o.id!==e.id)):(t=!0,[e,...r])),t}function N(e,t){const r=v(t,["children","$$slots","$$events","$$legacy"]);/**
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
 */const a=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"}]];p(e,_({name:"bookmark"},()=>r,{get iconNode(){return a},children:(o,S)=>{var n=u(),c=f(n);g(c,t,"default",{},null),m(o,n)},$$slots:{default:!0}}))}export{N as B,b as i,s,k as t};
