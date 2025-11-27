const HOLIDAY_API_URL = 'https://date.nager.at/api/v3/PublicHolidays';
const DEFAULT_COUNTRY = 'US';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 400;

interface HolidayApiResponse {
	date: string;
	localName: string;
	name: string;
	countryCode: string;
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

const fetchHolidayYear = async (year: number, countryCode: string): Promise<string[]> => {
	const url = `${HOLIDAY_API_URL}/${year}/${countryCode}`;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Holiday API responded with ${response.status}`);
			}
			const data = (await response.json()) as HolidayApiResponse[];
			return data.map((holiday) => holiday.date);
		} catch (error) {
			if (attempt === MAX_RETRIES) {
				console.warn('[holidays] Failed to load holidays', { year, countryCode, error });
				return [];
			}
			await wait(RETRY_DELAY_MS * (attempt + 1));
		}
	}

	return [];
};

export const loadPublicHolidays = async (
	years: number[],
	countryCode: string
): Promise<Set<string>> => {
	const uniqueYears = Array.from(new Set(years));
	const results = await Promise.all(uniqueYears.map((year) => fetchHolidayYear(year, countryCode)));
	return new Set(results.flat());
};
