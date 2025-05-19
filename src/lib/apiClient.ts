

import type { DictionaryEntry, PrayerTimesResponse, TranslationResult, ApiError, QiblaResponse, Riddle, FreeToGameEntry } from '@/types';

const API_BASE_URL = '/api';

export async function fetchDefinition(word: string): Promise<DictionaryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/dictionary/define/${encodeURIComponent(word)}`);
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ message: 'Failed to fetch definition. Unknown error.' }));
    throw new Error(errorData.message || 'Failed to fetch definition');
  }
  return response.json();
}

export async function fetchTranslation(word: string, targetLanguage: string): Promise<TranslationResult> {
  const response = await fetch(`${API_BASE_URL}/dictionary/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ word, targetLanguage }),
  });
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ message: 'Failed to fetch translation. Unknown error.' }));
    throw new Error(errorData.message || 'Failed to fetch translation');
  }
  return response.json();
}

export async function fetchPrayerTimes(city: string, country: string): Promise<PrayerTimesResponse> {
  const response = await fetch(`${API_BASE_URL}/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
  if (!response.ok) {
     const errorData: ApiError = await response.json().catch(() => ({ message: 'Failed to fetch prayer times. Unknown error.' }));
    throw new Error(errorData.details?.data && typeof errorData.details.data === 'string' ? errorData.details.data : errorData.message || 'Failed to fetch prayer times');
  }
  return response.json();
}

export async function fetchQiblaDirection(latitude: number, longitude: number): Promise<QiblaResponse> {
  const response = await fetch(`${API_BASE_URL}/qibla-direction?latitude=${latitude}&longitude=${longitude}`);
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ message: 'Failed to fetch Qibla direction. Unknown error.' }));
    throw new Error(errorData.details?.data && typeof errorData.details.data === 'string' ? errorData.details.data : errorData.message || 'Failed to fetch Qibla direction');
  }
  return response.json();
}

export async function fetchRiddle(): Promise<Riddle> {
  const response = await fetch(`${API_BASE_URL}/riddle`);
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ message: 'Failed to fetch riddle. Unknown error.' }));
    throw new Error(errorData.message || 'Failed to fetch riddle');
  }
  return response.json();
}

export async function fetchFreeToPlayGames(platform?: string, category?: string, sortBy?: string): Promise<FreeToGameEntry[]> {
  const params = new URLSearchParams();
  if (platform) params.append('platform', platform);
  if (category) params.append('category', category);
  if (sortBy) params.append('sort-by', sortBy);

  const response = await fetch(`${API_BASE_URL}/free-games?${params.toString()}`);
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ message: 'Failed to fetch free-to-play games. Unknown error.' }));
    throw new Error(errorData.message || 'Failed to fetch free-to-play games');
  }
  // The API might return an error object even with a 200 status if no games are found for certain filters or if there's an issue.
  // However, the provided API typically returns an empty array or a limited set for bad filters,
  // and relies on HTTP status codes for actual errors.
  // So, we'll directly return response.json() and let react-query handle potential empty arrays.
  return response.json();
}
