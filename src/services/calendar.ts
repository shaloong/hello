
import dayjs, { Dayjs } from 'dayjs';
import type { CalendarDay, CalendarMonth, HolidaySummary } from '@/types/portal';

const WEEK_START = 1; // Monday

const buildHolidayMap = (summaries: HolidaySummary[]): Map<string, HolidaySummary> => {
	const map = new Map<string, HolidaySummary>();
	for (const summary of summaries) {
		map.set(summary.date, summary);
	}
	return map;
};

const buildCalendarDay = (date: Dayjs, holidayMap: Map<string, HolidaySummary>): CalendarDay => {
	const isoDate = date.format('YYYY-MM-DD');
	const metadata = holidayMap.get(isoDate);
	const isWeekend = [0, 6].includes(date.day());
	const isHoliday = Boolean(metadata?.isHoliday);
	const isWorkdayOverride = isWeekend && metadata?.isWorkday === true;
	const isRestDay = isHoliday || (!isWorkdayOverride && isWeekend);
	return {
		date: isoDate,
		isToday: date.isSame(dayjs(), 'day'),
		isWeekend,
		isHoliday,
		isRestDay,
		holidayName: isHoliday ? metadata?.name : undefined,
		isWorkdayOverride,
		schedules: []
	};
};

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
	holidaySummaries: HolidaySummary[] = []
): CalendarMonth => {
	const startCursor = getCalendarStartCursor(reference);
	const days: CalendarDay[] = [];
	const holidayMap = buildHolidayMap(holidaySummaries);

	for (let i = 0; i < 42; i += 1) {
		const current = startCursor.add(i, 'day');
		days.push(buildCalendarDay(current, holidayMap));
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
