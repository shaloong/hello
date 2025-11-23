import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'hello-preferences';

const applyTheme = (mode: ThemeMode) => {
	if (typeof document === 'undefined') {
		return;
	}
	document.documentElement.dataset.theme = mode;
	document.body.dataset.theme = mode;
};

export const usePreferencesStore = defineStore('preferences', () => {
	const favorites = ref<Set<string>>(new Set());
	const theme = ref<ThemeMode>('light');
	const showFavoritesOnly = ref(false);

	const favoritesSerialized = computed(() => Array.from(favorites.value));
	const activeTheme = computed(() => theme.value);

	const toggleFavorite = (id: string) => {
		const next = new Set(favorites.value);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		favorites.value = next;
	};

	const toggleTheme = () => {
		theme.value = theme.value === 'light' ? 'dark' : 'light';
	};

	const toggleFavoritesOnly = () => {
		showFavoritesOnly.value = !showFavoritesOnly.value;
	};

	if (typeof window !== 'undefined') {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved) as {
					favorites?: string[];
					theme?: ThemeMode;
					showFavoritesOnly?: boolean;
				};
				if (parsed.favorites?.length) {
					favorites.value = new Set(parsed.favorites);
				}
				if (parsed.theme) {
					theme.value = parsed.theme;
				}
				if (typeof parsed.showFavoritesOnly === 'boolean') {
					showFavoritesOnly.value = parsed.showFavoritesOnly;
				}
			} catch {
				window.localStorage.removeItem(STORAGE_KEY);
			}
		}

		watch(
			[favoritesSerialized, theme, showFavoritesOnly],
			([favList, themeMode, onlyFavs]) => {
				window.localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({
						favorites: favList,
						theme: themeMode,
						showFavoritesOnly: onlyFavs
					})
				);
			},
			{ deep: true }
		);
	}

	watch(
		theme,
		mode => {
			applyTheme(mode);
		},
		{ immediate: true }
	);

	return {
		favorites,
		favoritesSerialized,
		activeTheme,
		theme,
		toggleTheme,
		toggleFavorite,
		showFavoritesOnly,
		toggleFavoritesOnly
	};
});
