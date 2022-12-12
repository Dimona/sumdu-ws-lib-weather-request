import { WeatherRequestStatus } from './enums';

export type TRequest<T extends Record<string, any>> = {
  id: string;
  email: string;
  targetDate: string;
  status: WeatherRequestStatus;
  payload: T;
  createdAt: number;
  updatedAt: number;
  nextTime: number;
  expireAt: number;
};

export type WeatherPayload = {
  longitude: number;
  latitude: number;
};

export type WeatherInfo = {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  precipitation: string;
  sunrise: string;
  sunset: string;
  icon: string;
};
