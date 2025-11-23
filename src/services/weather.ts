import type { WeatherSnapshot } from '@/types/portal';

export interface GeoPoint {
	latitude: number;
	longitude: number;
}

const WEATHER_BASE = import.meta.env.VITE_WEATHER_BASE_URL ?? 'https://api.open-meteo.com';

const WEATHER_DESCRIPTION: Record<number, string> = {
	0: '晴朗',
	1: '大部多云',
	2: '局部多云',
	3: '多云',
	45: '有雾',
	51: '细雨',
	61: '小雨',
	63: '中雨',
	65: '大雨',
	71: '小雪',
	95: '雷阵雨'
};

export const fetchWeatherSnapshot = async (point: GeoPoint): Promise<WeatherSnapshot> => {
	const url = new URL('/v1/forecast', WEATHER_BASE);
	url.searchParams.set('latitude', point.latitude.toString());
	url.searchParams.set('longitude', point.longitude.toString());
	url.searchParams.set('current_weather', 'true');
	url.searchParams.set('hourly', 'relativehumidity_2m,apparent_temperature');

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error('天气服务请求失败');
	}

	const data = await response.json();
	const current = data.current_weather;
	const humidity = data.hourly?.relativehumidity_2m?.[0] ?? 0;
	const feelsLike = data.hourly?.apparent_temperature?.[0] ?? current.temperature;

	return {
		location: `${point.latitude.toFixed(2)}, ${point.longitude.toFixed(2)}`,
		temperature: current.temperature,
		feelsLike,
		weatherCode: current.weathercode,
		description: WEATHER_DESCRIPTION[current.weathercode] ?? '天气更新中',
		windSpeed: current.windspeed,
		humidity,
		observationTime: current.time
	};
};
