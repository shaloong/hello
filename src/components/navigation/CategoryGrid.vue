<template>
  <div class="category-grid">
    <section v-for="group in categories" :key="group.key" class="category-block">
      <header class="category-header">
        <h2>{{ group.label }}</h2>
        <span class="count-badge">{{ group.applications.length }}</span>
      </header>
      <div class="card-grid">
        <ApplicationCard v-for="app in group.applications" :key="app.id" :application="app"
          :is-favorite="favoriteSet.has(app.id)" @toggle-favorite="emit('toggle-favorite', app.id)" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ApplicationCard from './ApplicationCard.vue';
import type { ApplicationCategoryGroup } from '@/types/portal';

const props = defineProps<{
  categories: ApplicationCategoryGroup[];
  favoriteIds: string[];
}>();

const emit = defineEmits<{ 'toggle-favorite': [id: string] }>();

const favoriteSet = computed(() => new Set(props.favoriteIds));
</script>

<style scoped>
.category-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.category-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-light);
}

.count-badge {
  padding: 2px 12px;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
}

:deep(body[data-theme='dark']) .count-badge {
  background: rgba(0, 110, 255, 0.26);
  color: var(--color-text-dark);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
</style>
