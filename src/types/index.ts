

// Dictionary API Types
export interface Phonetic {
  text: string;
  audio?: string;
  sourceUrl?: string;
  license?: {
    name: string;
    url: string;
  };
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface License {
  name: string;
  url: string;
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
}

// Prayer Times API Types (Aladhan)
export interface PrayerTimeDesignation {
  abbreviation: string;
  name: string;
}

export interface PrayerTimeMethod {
  id: number;
  name: string;
  params: Record<string, number>;
  location: {
    latitude: number;
    longitude: number;
  }
}

export interface PrayerTimeOffset {
  Imsak: number;
  Fajr: number;
  Sunrise: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Sunset: number;
  Isha: number;
  Midnight: number;
}

export interface PrayerDateReadable {
  readable: string;
  timestamp: string;
  gregorian: GregorianDate;
  hijri: HijriDate;
}

export interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
  };
  month: {
    number: number;
    en: string;
  };
  year: string;
  designation: PrayerTimeDesignation;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: PrayerTimeDesignation;
  holidays: string[];
}

export interface PrayerTimesData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
    Firstthird: string;
    Lastthird: string;
  };
  date: PrayerDateReadable;
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: PrayerTimeMethod;
    latitudeAdjustmentMethod: string;
    midnightMode: string;
    school: string;
    offset: PrayerTimeOffset;
  };
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: PrayerTimesData;
}

// Qibla Direction API Types (Aladhan)
export interface QiblaData {
  latitude: number;
  longitude: number;
  direction: number;
}

export interface QiblaResponse {
  code: number;
  status: string;
  data: QiblaData;
}


// Translation
export interface TranslationResult {
  translatedText: string;
}

// Riddle API Type
export interface Riddle {
  riddle: string;
  answer: string;
}

// FreeToGame API Types
export interface FreeToGameEntry {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
}


// Common API Error
export interface ApiError {
  message: string;
  title?: string;
  resolution?: string;
  details?: any; // To store additional error details from the API
}
