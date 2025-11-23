<template>
  <section class="widget">
    <header>
      <h3>实时天气</h3>
      <button type="button" @click="refresh" title="刷新天气">
        ⟳
      </button>
    </header>
    <div v-if="isLoading" class="widget-body muted">定位并获取天气数据…</div>
    <div v-else-if="error" class="widget-body error">天气服务暂不可用</div>
    <div v-else class="widget-body weather">
      <div class="primary">
        <strong>{{ snapshot?.temperature ?? '--' }}°C</strong>
        <span>{{ snapshot?.description ?? '等待更新' }}</span>
      </div>
      <ul class="metrics">
        <li>
          <label>体感</label>
          <span>{{ snapshot?.feelsLike ?? '--' }}°C</span>
        </li>
        <li>
          <label>湿度</label>
          <span>{{ snapshot?.humidity ?? '--' }}%</span>
        </li>
        <li>
          <label>风速</label>
          <span>{{ snapshot?.windSpeed ?? '--' }} km/h</span>
        </li>
      </ul>
      <footer>
        <span>{{ snapshot?.location ?? '未知位置' }}</span>
        <time>{{ formatTime(snapshot?.observationTime) }}</time>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { fetchWeatherSnapshot, type GeoPoint } from '@/services/weather';

const point = ref<GeoPoint>({ latitude: 22.55, longitude: 114.05 });
const loader = () => fetchWeatherSnapshot(point.value);

const { state, isLoading, error, refresh } = useAsyncData('weather-snapshot', loader, 180_000);
const snapshot = computed(() => state.value);

const formatTime = (value?: string) =>
  value ? new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '--:--';

onMounted(() => {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return;
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      point.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      void refresh();
    },
    () => { }
  );
});
</script>

<style scoped>
.widget {
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-panel);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

header h3 {
  margin: 0;
  font-size: 16px;
}

header button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}

.widget-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
}

.weather .primary {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.weather strong {
  font-size: 32px;
  line-height: 1;
}

.weather span {
  color: var(--color-text-muted);
}

.metrics {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
}

.metrics li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 12px;
  background: var(--color-secondary-soft);
}

.metrics label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.metrics span {
  font-weight: 600;
}

.footer,
footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-muted);
}

.muted {
  color: var(--color-text-muted);
}

.error {
  color: #d93025;
}

:deep(body[data-theme='dark']) .widget {
  background: var(--color-panel);
  border-color: var(--color-border);
}

:deep(body[data-theme='dark']) .metrics li {
  background: rgba(90, 200, 250, 0.24);
}

:deep(body[data-theme='dark']) .weather span,
:deep(body[data-theme='dark']) footer,
:deep(body[data-theme='dark']) .muted {
  color: var(--color-text-muted-dark);
}

:deep(body[data-theme='dark']) header button {
  color: var(--color-secondary);
}

:deep(body[data-theme='dark']) .weather strong {
  color: var(--color-secondary);
}
</style>
