import type { HolidaySummary } from '@/types/portal';

const HOLIDAY_API_URL = 'https://date.nager.at/api/v3/PublicHolidays';
const CN_YEAR_API_URL = 'https://timor.tech/api/holiday/year/';
const memoryCache = new Map<string, HolidaySummary[]>();
const DEFAULT_COUNTRY = 'US';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 400;

interface HolidayApiResponse {
	date: string;
	localName: string;
	name: string;
	countryCode: string;
	counties?: string[] | null;
	fixed?: boolean;
	globe?: boolean;
	type?: string;
}

interface TimorYearResponse {
	code: number;
	holiday?: Record<string, TimorHolidayEntry>;
}

interface TimorHolidayEntry {
	date: string;
	name: string;
	holiday: boolean;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeLocale = (locale?: string | null) => locale?.replace('_', '-').trim();

export const detectCountryCode = (): string => {
	if (typeof navigator === 'undefined') {
		return DEFAULT_COUNTRY;
	}

	const locale = normalizeLocale(navigator.language || navigator.languages?.[0]) || DEFAULT_COUNTRY;
	const parts = locale.split('-');
	const region = parts[parts.length - 1];

	if (region && region.length === 2) {
		return region.toUpperCase();
	}

	const intlLocale = normalizeLocale(Intl.DateTimeFormat().resolvedOptions().locale);
	const intlRegion = intlLocale?.split('-').pop();

	return intlRegion && intlRegion.length === 2 ? intlRegion.toUpperCase() : DEFAULT_COUNTRY;
};

const fetchWithRetry = async <T>(request: () => Promise<T>): Promise<T | null> => {
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
		try {
			return await request();
		} catch (error) {
			if (attempt === MAX_RETRIES) {
				console.warn('[holidays] request failed', error);
				return null;
			}
			await wait(RETRY_DELAY_MS * (attempt + 1));
		}
	}
	return null;
};

const fetchHolidayYear = async (year: number, countryCode: string): Promise<HolidaySummary[]> => {
	const url = `${HOLIDAY_API_URL}/${year}/${countryCode}`;
	const response = await fetchWithRetry(async () => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Holiday API responded with ${res.status}`);
		}
		return (await res.json()) as HolidayApiResponse[];
	});

	return (
		response?.map((holiday) => ({
			date: holiday.date,
			name: holiday.localName || holiday.name,
			isHoliday: true,
			isWorkday: false
		})) ?? []
	);
};

const fetchCnHolidayYear = async (year: number): Promise<HolidaySummary[]> => {
	const url = `${CN_YEAR_API_URL}${year}`;
	const response = await fetchWithRetry(async () => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`CN holiday API responded with ${res.status}`);
		}
		return (await res.json()) as TimorYearResponse;
	});

	if (!response || response.code !== 0 || !response.holiday) {
		return [];
	}

	return Object.values(response.holiday).map((entry) => ({
		date: entry.date,
		name: entry.name,
		isHoliday: Boolean(entry.holiday),
		isWorkday: !entry.holiday
	}));
};

const getCacheKey = (countryCode: string, year: number) => `${countryCode}-${year}`;

const fetchByCountry = async (year: number, countryCode: string): Promise<HolidaySummary[]> => {
	const cacheKey = getCacheKey(countryCode, year);
	if (memoryCache.has(cacheKey)) {
		return memoryCache.get(cacheKey)!;
	}

	let data: HolidaySummary[] = [];
	if (countryCode === 'CN') {
		const cnData = await fetchCnHolidayYear(year);
		if (cnData.length) {
			data = cnData;
		}
	}

	if (!data.length) {
		data = await fetchHolidayYear(year, countryCode);
	}

	memoryCache.set(cacheKey, data);
	return data;
};

export const loadPublicHolidays = async (
	years: number[],
	countryCode: string
): Promise<HolidaySummary[]> => {
	const uniqueYears = Array.from(new Set(years));
	const holidayLists = await Promise.all(uniqueYears.map((year) => fetchByCountry(year, countryCode)));
	return holidayLists.flat();
};
