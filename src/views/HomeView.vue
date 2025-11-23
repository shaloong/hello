<template>
  <AppLayout :theme="activeTheme">
    <template #header>
      <div class="header-top">
        <div class="logo-section">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 919.4 263.31" alt="Shaloong" class="logo">
            <path fill="currentColor"
              d="m369.89,124.51c0-27.62-22.39-50-50-50s-50,22.38-50,50,22.38,50,50,50c9.52,0,18.42-2.67,26-7.29,1.98,4.3,6.32,7.29,11.37,7.29,6.9,0,12.5-5.6,12.5-12.5,0-.39-.02-.78-.05-1.17h.18v-36.33Zm-50,25c-13.81,0-25-11.19-25-25s11.19-25,25-25,25,11.19,25,25-11.19,25-25,25Z" />
            <path fill="currentColor"
              d="m484.89,74.51c-27.62,0-50,22.38-50,50s22.38,50,50,50,50-22.39,50-50-22.39-50-50-50Zm0,75c-13.81,0-25-11.2-25-25s11.19-25,25-25,25,11.19,25,25-11.2,25-25,25Z" />
            <path fill="currentColor"
              d="m604.89,74.51c-27.62,0-50,22.38-50,50s22.38,50,50,50,50-22.39,50-50-22.39-50-50-50Zm0,75c-13.81,0-25-11.2-25-25s11.19-25,25-25,25,11.19,25,25-11.2,25-25,25Z" />
            <path fill="currentColor"
              d="m774.89,124.51v37.06c0,6.9-5.6,12.5-12.5,12.5s-12.5-5.6-12.5-12.5v-37.06c0-13.81-11.2-25-25-25s-25,11.19-25,25v37.5c0,6.91-5.6,12.5-12.5,12.5s-12.5-5.59-12.5-12.5v-37.5c0-27.62,22.38-50,50-50s49.76,22.14,49.99,49.56c.01.15.01.29.01.44Z" />
            <path fill="currentColor" d="m794.66,128.09v.44c0-.15,0-.29-.01-.44h.01Z" />
            <path fill="currentColor"
              d="m249.89,124.51v37.5c0,6.9-5.6,12.5-12.5,12.5s-12.5-5.6-12.5-12.5v-37.5c0-13.81-11.2-25-25-25s-25,11.19-25,25v37.5c0,6.9-5.59,12.5-12.5,12.5s-12.5-5.6-12.5-12.5V37.01c0-6.9,5.6-12.5,12.5-12.5,3.45,0,6.58,1.4,8.84,3.66s3.66,5.39,3.66,8.84v44.19c7.35-4.25,15.89-6.69,25-6.69,27.61,0,50,22.38,50,50Z" />
            <rect fill="currentColor" x="389.89" y="24.51" width="25" height="150" rx="12.5" ry="12.5" />
            <path fill="currentColor"
              d="m894.88,126.36c-.23-27.42-22.53-49.56-49.99-49.56s-50,22.38-50,50,22.38,50,50,50c9.11,0,17.65-2.44,25-6.69v18.75c-.03,13.78-11.21,24.94-25,24.94s-25-11.19-25-25c0-6.9-5.59-12.5-12.5-12.5s-12.5,5.6-12.5,12.5c0,27.62,22.39,50,50,50s49.97-22.35,50-49.94v-62.06c0-.15,0-.29-.01-.44Zm-49.99,25.44c-13.81,0-25-11.2-25-25s11.19-25,25-25,25,11.19,25,25-11.2,25-25,25Z" />
            <path fill="currentColor"
              d="m124.78,128.12c0,26.22-23.36,46.79-49.89,46.79s-47.05-19.56-49.71-44.67c-.07-.7-.13-1.41-.18-2.12,0-6.9,5.6-12.5,12.5-12.5s12.6,4.85,12.6,12.5c0,11.92,12.07,21.79,24.79,21.79s24.79-9.23,24.79-21.79c0-.25-.1-15.71-24.79-15.71s-50-12.5-49.89-40.71c1.65-26.12,23.35-46.79,49.89-46.79s47.05,19.56,49.71,44.67c.07.7.13,1.41.18,2.12,0,6.9-5.6,12.5-12.5,12.5s-12.6-8.41-12.6-12.5c0-8.25-9.62-21.79-24.79-21.79-12.72,0-23.22,9.5-24.79,21.79,0,.25.1,15.71,24.79,15.71s49.89,12.5,49.89,40.71Z" />
            <path fill="currentColor" d="m124.78,71.7c-.05-.71-.11-1.42-.18-2.12.12.69.18,1.4.18,2.12Z" />
            <path fill="currentColor" d="m.29,130.24c-.12-.69-.18-1.4-.18-2.12.05.71.11,1.42.18,2.12Z" />
          </svg>
          <h1 class="brand-name">Hello</h1>
        </div>
        <div class="header-actions">
          <AppSearchBar v-model="searchTerm" placeholder="搜索系统、标签或关键字…" />
          <div class="action-buttons">
            <button type="button" class="icon-toggle" @click="prefs.toggleTheme()"
              :aria-label="activeTheme === 'dark' ? '切换至浅色模式' : '切换至深色模式'">
              <SunIcon v-if="activeTheme === 'dark'" class="icon-toggle__glyph" aria-hidden="true" />
              <MoonIcon v-else class="icon-toggle__glyph" aria-hidden="true" />
            </button>
            <button type="button" :class="{ active: showFavoritesOnly && hasFavorites }"
              @click="prefs.toggleFavoritesOnly()" :disabled="!hasFavorites">
              仅看收藏
            </button>
          </div>
        </div>
      </div>
      <nav class="category-filter">
        <button v-for="option in categoryFilterOptions" :key="option.key" type="button"
          :class="{ active: activeCategory === option.key }" @click="activeCategory = option.key">
          {{ option.label }}
        </button>
        <button type="button" class="ghost" @click="resetFilters">重置</button>
      </nav>
    </template>

    <CategoryGrid v-if="hasResults" :categories="visibleCategories" :favorite-ids="favoritesSerialized"
      @toggle-favorite="prefs.toggleFavorite" />
    <div v-else class="empty-state">
      <h3>暂无匹配的应用</h3>
      <p>尝试调整搜索条件或取消收藏筛选。</p>
      <button type="button" class="ghost" @click="resetFilters">重置筛选</button>
    </div>

    <template #aside>
      <WeatherWidget />
      <CalendarWidget />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import AppLayout from '@/components/layout/AppLayout.vue';
import AppSearchBar from '@/components/search/AppSearchBar.vue';
import CategoryGrid from '@/components/navigation/CategoryGrid.vue';
import WeatherWidget from '@/components/widgets/WeatherWidget.vue';
import CalendarWidget from '@/components/widgets/CalendarWidget.vue';
import { useApplicationsStore } from '@/stores/applications';
import { usePreferencesStore } from '@/stores/preferences';
import type { ApplicationCategory } from '@/types/portal';

const appStore = useApplicationsStore();
const prefs = usePreferencesStore();

const { categoryOptions } = storeToRefs(appStore);
const { favoritesSerialized, showFavoritesOnly, activeTheme } = storeToRefs(prefs);

const hasFavorites = computed(() => favoritesSerialized.value.length > 0);

const searchTerm = ref('');
const activeCategory = ref<ApplicationCategory | 'all'>('all');

onMounted(() => {
  void appStore.loadApplications();
});

const favoriteSet = computed(() => new Set<string>(favoritesSerialized.value));

const visibleCategories = computed(() =>
  appStore.groupApplications({
    searchTerm: searchTerm.value,
    category: activeCategory.value,
    favorites: showFavoritesOnly.value ? favoriteSet.value : undefined
  })
);

const hasResults = computed(() => visibleCategories.value.some(group => group.applications.length > 0));
const categoryFilterOptions = computed(() => [
  { key: 'all' as const, label: '全部' },
  ...categoryOptions.value
]);

const resetFilters = () => {
  searchTerm.value = '';
  activeCategory.value = 'all';
  if (showFavoritesOnly.value) {
    prefs.toggleFavoritesOnly();
  }
};

watch(hasFavorites, value => {
  if (!value && showFavoritesOnly.value) {
    prefs.toggleFavoritesOnly();
  }
});
</script>

<style scoped>
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  -moz-user-select: none;
}

.logo {
  height: 40px;
  width: auto;
  color: var(--color-primary);
  margin-top: 10px;
}

.brand-name {
  font-size: 28px;
  margin: 0;
  font-weight: 600;
  color: var(--color-text-light);
  letter-spacing: 0.02em;
}

.header-top p {
  margin: 0;
  color: var(--color-text-muted);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons button {
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-light);
  color: var(--color-text-light);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.action-buttons button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.icon-toggle {
  padding: 0 !important;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.icon-toggle__glyph {
  width: 22px;
  height: 22px;
}

.icon-toggle:hover {
  border-color: rgba(0, 110, 255, 0.28);
  color: var(--color-primary);
}

.action-buttons button:hover {
  border-color: rgba(0, 110, 255, 0.2);
  color: var(--color-primary);
}

.action-buttons button.active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-color: rgba(0, 110, 255, 0.32);
}

.category-filter {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-filter button {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.category-filter button:hover {
  border-color: rgba(0, 110, 255, 0.2);
  color: var(--color-primary);
}

.category-filter button.active {
  background: var(--color-primary-soft);
  border-color: rgba(0, 110, 255, 0.4);
  color: var(--color-primary);
}

.category-filter .ghost,
.empty-state .ghost {
  border: 1px dashed var(--color-border);
  background: transparent;
  color: var(--color-text-light);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 320px;
  color: var(--color-text-muted);
}

.empty-state h3 {
  margin: 0;
  color: var(--color-text-light);
}

.empty-state button {
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
}

:deep(body[data-theme='dark']) .header-top p,
:deep(body[data-theme='dark']) .empty-state {
  color: var(--color-text-muted-dark);
}

:deep(body[data-theme='dark']) .action-buttons button {
  background: var(--color-surface-dark);
  border-color: var(--color-border-dark);
  color: var(--color-text-dark);
}

:deep(body[data-theme='dark']) .icon-toggle:hover {
  color: var(--color-secondary);
}

:deep(body[data-theme='dark']) .category-filter button {
  border-color: var(--color-border-dark);
  color: var(--color-text-dark);
}

:deep(body[data-theme='dark']) .logo {
  color: var(--color-text-dark);
}

:deep(body[data-theme='dark']) .brand-name {
  color: var(--color-text-dark);
  text-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

:deep(body[data-theme='dark']) .category-filter .ghost,
:deep(body[data-theme='dark']) .empty-state .ghost {
  color: var(--color-text-dark);
  border-color: var(--color-border-dark);
}
</style>
