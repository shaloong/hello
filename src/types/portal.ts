export type ApplicationCategory =
  | 'intranet'
  | 'communication'
  | 'development'
  | 'design'
  | 'management'
  | 'productivity'
  | 'analytics';

export interface PortalApplication {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ApplicationCategory;
  tags: string[];
  icon?: string;
}

export interface ApplicationCategoryGroup {
  key: ApplicationCategory;
  label: string;
  applications: PortalApplication[];
}

export interface ApplicationFilter {
  searchTerm?: string;
  category?: ApplicationCategory | 'all';
  favorites?: Set<string>;
}

export interface WeatherSnapshot {
  location: string;
  temperature: number;
  feelsLike: number;
  weatherCode: number;
  description: string;
  windSpeed: number;
  humidity: number;
  observationTime: string;
}

export interface CalendarDay {
  date: string;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  schedules: string[];
}

export interface CalendarMonth {
  monthLabel: string;
  weeks: CalendarDay[][];
}
