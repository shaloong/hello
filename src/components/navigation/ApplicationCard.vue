<template>
  <article class="app-card">
    <button class="favorite-btn" type="button" :aria-pressed="isFavorite"
      @click="emit('toggle-favorite', application.id)" aria-label="切换收藏">
      <span>{{ isFavorite ? '★' : '☆' }}</span>
    </button>
    <a class="card-surface" :href="application.url" target="_blank" rel="noopener noreferrer"
      :aria-label="`打开 ${application.name}`">
      <div class="card-header">
        <h3>{{ application.name }}</h3>
      </div>
      <p class="card-desc">
        {{ application.description }}
      </p>
      <div class="card-meta">
        <span v-for="tag in application.tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
      <span class="card-link-arrow" aria-hidden="true">➜</span>
    </a>
  </article>
</template>

<script setup lang="ts">
import type { PortalApplication } from '@/types/portal';

defineProps<{
  application: PortalApplication;
  isFavorite: boolean;
}>();

const emit = defineEmits<{ 'toggle-favorite': [id: string] }>();
</script>

<style scoped>
.app-card {
  position: relative;
  transition: transform 0.2s ease;
}

.app-card:hover,
.app-card:focus-within {
  transform: translateY(-4px);
}

.card-surface {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-light);
  box-shadow: 0 20px 36px rgba(10, 53, 101, 0.08);
  text-decoration: none;
  color: inherit;
  min-height: 180px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.app-card:hover .card-surface,
.app-card:focus-within .card-surface {
  box-shadow: 0 24px 48px rgba(10, 53, 101, 0.12);
  border-color: rgba(0, 110, 255, 0.28);
}

.favorite-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: transparent;
  color: var(--color-primary-deep);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
  z-index: 1;
}

.favorite-btn:hover {
  background: rgba(0, 110, 255, 0.1);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.card-header {
  padding-right: 46px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text-light);
}

.card-desc {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-muted);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(0, 110, 255, 0.14);
  color: var(--color-primary-deep);
  font-size: 12px;
}

.card-link-arrow {
  margin-top: auto;
  align-self: flex-end;
  font-size: 26px;
  color: rgba(10, 53, 101, 0.45);
  transition: color 0.2s ease, transform 0.2s ease;
}

.card-surface:hover .card-link-arrow,
.card-surface:focus-visible .card-link-arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}

:deep(body[data-theme='dark']) .card-surface {
  background: var(--color-surface-dark);
  border-color: var(--color-border);
  box-shadow: 0 24px 52px rgba(0, 0, 0, 0.45);
}

:deep(body[data-theme='dark']) .favorite-btn {
  color: var(--color-secondary);
}

:deep(body[data-theme='dark']) .favorite-btn:hover {
  background: rgba(90, 200, 250, 0.22);
  color: var(--color-text-dark);
}

:deep(body[data-theme='dark']) .card-header h3,
:deep(body[data-theme='dark']) .card-desc {
  color: var(--color-text-dark);
}

:deep(body[data-theme='dark']) .tag-chip {
  background: rgba(90, 200, 250, 0.26);
  color: var(--color-secondary);
}

:deep(body[data-theme='dark']) .card-link-arrow {
  color: rgba(242, 242, 242, 0.55);
}

:deep(body[data-theme='dark']) .card-surface:hover .card-link-arrow,
:deep(body[data-theme='dark']) .card-surface:focus-visible .card-link-arrow {
  color: var(--color-secondary);
}
</style>
