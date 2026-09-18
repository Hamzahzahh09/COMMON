
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/communities" | "/create-community" | "/c" | "/c/[slug]" | "/dashboard" | "/discover" | "/incoming" | "/items" | "/items/[id]" | "/login" | "/messages" | "/my-communities" | "/needs" | "/profile" | "/requests" | "/saved";
		RouteParams(): {
			"/c/[slug]": { slug: string };
			"/items/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { slug?: string | undefined; id?: string | undefined };
			"/communities": Record<string, never>;
			"/create-community": Record<string, never>;
			"/c": { slug?: string | undefined };
			"/c/[slug]": { slug: string };
			"/dashboard": Record<string, never>;
			"/discover": Record<string, never>;
			"/incoming": Record<string, never>;
			"/items": { id?: string | undefined };
			"/items/[id]": { id: string };
			"/login": Record<string, never>;
			"/messages": Record<string, never>;
			"/my-communities": Record<string, never>;
			"/needs": Record<string, never>;
			"/profile": Record<string, never>;
			"/requests": Record<string, never>;
			"/saved": Record<string, never>
		};
		Pathname(): "/" | "/communities" | "/create-community" | `/c/${string}` & {} | "/dashboard" | "/discover" | "/incoming" | `/items/${string}` & {} | "/login" | "/messages" | "/my-communities" | "/needs" | "/profile" | "/requests" | "/saved";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}