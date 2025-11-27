<template>
  <div class="app-layout" :class="[`theme-${theme}`]">
    <header class="app-header">
      <slot name="header" />
    </header>
    <div class="app-main">
      <section class="app-content">
        <slot />
      </section>
      <aside class="app-aside">
        <slot name="aside" />
      </aside>
    </div>
    <footer class="app-footer">
      <slot name="footer">
        <span>Shaloong Hello · 科技赋能生产力</span>
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
defineProps<{ theme: string }>();
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
}

.app-header {
  background: var(--color-panel);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  padding: 24px;
  box-shadow: 0 18px 40px rgba(10, 53, 101, 0.08);
}

.app-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}

.app-content {
  background: var(--color-panel);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  padding: 24px;
  min-height: 480px;
  box-shadow: 0 18px 40px rgba(10, 53, 101, 0.08);
}

.app-aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.app-footer {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
}

.theme-dark .app-header,
.theme-dark .app-content {
  background: var(--color-panel);
  border-color: var(--color-border);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
}

.theme-dark .app-footer {
  color: var(--color-text-muted-dark);
}

@media (max-width: 1100px) {
  .app-main {
    grid-template-columns: 1fr;
  }

  .app-aside {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .app-layout {
    padding: 16px;
    gap: 16px;
  }

  .app-header,
  .app-content {
    padding: 16px;
    border-radius: 16px;
  }

  .app-aside {
    flex-direction: column;
  }
}
</style>
