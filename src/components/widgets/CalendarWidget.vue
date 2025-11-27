<template>
  <section class="widget">
    <header>
      <h3>{{ calendar.monthLabel }}</h3>
      <div class="actions">
        <button type="button" @click="goPrev">←</button>
        <button type="button" @click="goNext">→</button>
      </div>
    </header>
    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="weekday">
        {{ day }}
      </div>
      <div v-for="item in flatDays" :key="item.date" class="day-cell" :class="{
        today: item.isToday,
        weekend: item.isWeekend,
        'rest-day': item.isRestDay,
        'workday-override': item.isWorkdayOverride
      }">
        <span class="date">{{ dayLabel(item.date) }}</span>
        <small v-if="item.holidayName" class="holiday-name">{{ item.holidayName }}</small>
        <ul v-if="item.schedules.length" class="schedule">
          <li v-for="schedule in item.schedules" :key="schedule">{{ schedule }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { buildCalendarMonth, getCalendarYearSpan } from '@/services/calendar';
import { detectCountryCode, loadPublicHolidays } from '@/services/holidays';
import type { HolidaySummary } from '@/types/portal';

const reference = ref(dayjs());
const countryCode = ref(detectCountryCode());
const holidays = ref<HolidaySummary[]>([]);
let requestId = 0;

const calendar = computed(() => buildCalendarMonth(reference.value, holidays.value));

const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
const flatDays = computed(() => calendar.value.weeks.flat());

const goPrev = () => {
  reference.value = reference.value.subtract(1, 'month');
};
const goNext = () => {
  reference.value = reference.value.add(1, 'month');
};

const dayLabel = (date: string) => Number.parseInt(date.slice(-2), 10);

const refreshHolidays = async () => {
  const { startYear, endYear } = getCalendarYearSpan(reference.value);
  const years = startYear === endYear ? [startYear] : [startYear, endYear];
  const runId = ++requestId;
  try {
    const result = await loadPublicHolidays(years, countryCode.value);
    if (requestId === runId) {
      holidays.value = result;
    }
  } catch (error) {
    console.warn('[calendar] holiday refresh failed', error);
    if (requestId === runId) {
      holidays.value = [];
    }
  }
};

watch([reference, countryCode], () => {
  refreshHolidays();
}, { immediate: true });
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

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  border: none;
  background: var(--color-secondary-soft);
  color: var(--color-primary-deep);
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.actions button:hover {
  background: rgba(90, 200, 250, 0.24);
  color: var(--color-primary);
}


.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(90px, 1fr));
  gap: 6px;
  font-size: 12px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: var(--color-text-muted);
}

.day-cell {
  min-height: 86px;
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(10, 53, 101, 0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-cell.weekend {
  background: var(--color-secondary-soft);
}

.day-cell.rest-day {
  background: var(--color-secondary-soft);
  border-color: rgba(10, 53, 101, 0.16);
}

.day-cell.workday-override {
  background: var(--color-panel);
}

.day-cell.today {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-soft);
}

.date {
  font-weight: 600;
  font-size: 14px;
}

.holiday-name {
  font-size: 11px;
  color: var(--color-text-muted);
  display: block;
}

.schedule {
  margin: 0;
  padding-left: 12px;
}

.schedule li {
  line-height: 1.4;
}

:deep(body[data-theme='dark']) .widget {
  background: var(--color-panel);
  border-color: var(--color-border);
}

:deep(body[data-theme='dark']) .weekday {
  color: var(--color-text-muted-dark);
}

:deep(body[data-theme='dark']) .day-cell.weekend,
:deep(body[data-theme='dark']) .day-cell.rest-day {
  background: rgba(90, 200, 250, 0.26);
}
</style>
