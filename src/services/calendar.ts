import dayjs, { Dayjs } from 'dayjs';
import type { CalendarDay, CalendarMonth } from '@/types/portal';

const HOLIDAYS = new Set<string>(['01-01', '05-01', '10-01', '10-02', '10-03']);

const buildCalendarDay = (date: Dayjs): CalendarDay => ({
	date: date.format('YYYY-MM-DD'),
	isToday: date.isSame(dayjs(), 'day'),
	isWeekend: [0, 6].includes(date.day()),
	isHoliday: HOLIDAYS.has(date.format('MM-DD')),
	schedules: []
});

export const buildCalendarMonth = (reference: Dayjs = dayjs()): CalendarMonth => {
	const start = reference.startOf('month');
	const startCursor = start.startOf('week');
	const days: CalendarDay[] = [];

	for (let i = 0; i < 42; i += 1) {
		const current = startCursor.add(i, 'day');
		days.push(buildCalendarDay(current));
	}

	const weeks: CalendarDay[][] = [];
	for (let i = 0; i < days.length; i += 7) {
		weeks.push(days.slice(i, i + 7));
	}

	return {
		monthLabel: reference.format('YYYY年MM月'),
		weeks
	};
};
