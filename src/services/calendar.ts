
import dayjs, { Dayjs } from 'dayjs';
import type { CalendarDay, CalendarMonth } from '@/types/portal';

const WEEK_START = 1; // Monday

const buildCalendarDay = (date: Dayjs, holidays: Set<string>): CalendarDay => ({
	date: date.format('YYYY-MM-DD'),
	isToday: date.isSame(dayjs(), 'day'),
	isWeekend: [0, 6].includes(date.day()),
	isHoliday: holidays.has(date.format('YYYY-MM-DD')),
	schedules: []
});

const getCalendarStartCursor = (reference: Dayjs): Dayjs => {
	const start = reference.startOf('month');
	const offset = (start.day() - WEEK_START + 7) % 7;
	return start.subtract(offset, 'day');
};

export const getCalendarYearSpan = (reference: Dayjs = dayjs()): { startYear: number; endYear: number } => {
	const startCursor = getCalendarStartCursor(reference);
	const endCursor = startCursor.add(41, 'day');
	return {
		startYear: startCursor.year(),
		endYear: endCursor.year()
	};
};

export const buildCalendarMonth = (
	reference: Dayjs = dayjs(),
	holidaySet: Set<string> = new Set()
): CalendarMonth => {
	const startCursor = getCalendarStartCursor(reference);
	const days: CalendarDay[] = [];

	for (let i = 0; i < 42; i += 1) {
		const current = startCursor.add(i, 'day');
		days.push(buildCalendarDay(current, holidaySet));
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
