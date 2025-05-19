
"use client";

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { fetchPrayerTimes, fetchQiblaDirection } from '@/lib/apiClient';
import type { PrayerTimesResponse, QiblaResponse, ApiError } from '@/types';
import { MapPin, Sunrise, Sunset, AlertCircle, Loader2, CalendarDays, Moon, Clock, Coffee, Star, CloudSun, CloudMoon, Info, Compass } from 'lucide-react';

const prayerOrder = ["Imsak", "Fajr", "Sunrise", "Dhuhr", "Asr", "Sunset", "Maghrib", "Isha", "Midnight"];

// Curated list of countries
const countriesData = [
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'India', label: 'India' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'South Africa', label: 'South Africa' },
  // Add other commonly requested countries as needed
];

// Curated list of cities for selected countries
const citiesData: Record<string, { value: string; label: string }[]> = {
  'United States': [ { value: 'New York', label: 'New York' }, { value: 'Los Angeles', label: 'Los Angeles' }, { value: 'Chicago', label: 'Chicago' }, { value: 'Houston', label: 'Houston'}, { value: 'Dearborn', label: 'Dearborn' }, { value: 'Washington D.C.', label: 'Washington D.C.'} ],
  'United Kingdom': [ { value: 'London', label: 'London' }, { value: 'Manchester', label: 'Manchester' }, { value: 'Birmingham', label: 'Birmingham' }],
  'Canada': [ { value: 'Toronto', label: 'Toronto' }, { value: 'Montreal', label: 'Montreal' }, { value: 'Vancouver', label: 'Vancouver' }],
  'Saudi Arabia': [ { value: 'Riyadh', label: 'Riyadh' }, { value: 'Jeddah', label: 'Jeddah' }, { value: 'Mecca', label: 'Mecca' }, { value: 'Medina', label: 'Medina' }],
  'UAE': [ { value: 'Dubai', label: 'Dubai' }, { value: 'Abu Dhabi', label: 'Abu Dhabi' }, { value: 'Sharjah', label: 'Sharjah' }],
  'Egypt': [ { value: 'Cairo', label: 'Cairo' }, { value: 'Alexandria', label: 'Alexandria' }, { value: 'Giza', label: 'Giza' }],
  'Pakistan': [ { value: 'Karachi', label: 'Karachi' }, { value: 'Lahore', label: 'Lahore' }, { value: 'Islamabad', label: 'Islamabad' }],
  'India': [ { value: 'Delhi', label: 'Delhi' }, { value: 'Mumbai', label: 'Mumbai' }, { value: 'Bangalore', label: 'Bangalore' }, { value: 'Hyderabad', label: 'Hyderabad'} ],
  'Bangladesh': [ { value: 'Dhaka', label: 'Dhaka' }, { value: 'Chittagong', label: 'Chittagong' }],
  'Indonesia': [ { value: 'Jakarta', label: 'Jakarta' }, { value: 'Surabaya', label: 'Surabaya' }],
  'Malaysia': [ { value: 'Kuala Lumpur', label: 'Kuala Lumpur' }, { value: 'Johor Bahru', label: 'Johor Bahru' }],
  'Turkey': [ { value: 'Istanbul', label: 'Istanbul' }, { value: 'Ankara', label: 'Ankara' }, { value: 'Izmir', label: 'Izmir' }],
  'Germany': [ { value: 'Berlin', label: 'Berlin' }, { value: 'Hamburg', label: 'Hamburg' }, { value: 'Munich', label: 'Munich' }],
  'France': [ { value: 'Paris', label: 'Paris' }, { value: 'Marseille', label: 'Marseille' }],
  'Australia': [ { value: 'Sydney', label: 'Sydney' }, { value: 'Melbourne', label: 'Melbourne' }],
  'Nigeria': [ { value: 'Lagos', label: 'Lagos' }, { value: 'Abuja', label: 'Abuja' }],
  'South Africa': [ { value: 'Johannesburg', label: 'Johannesburg' }, { value: 'Cape Town', label: 'Cape Town' }],
};

export default function PrayerTimesTab() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState<{ value: string; label: string }[]>([]);

  const prayerTimesMutation = useMutation<PrayerTimesResponse, Error, { city: string; country: string }>({
    mutationFn: (variables) => fetchPrayerTimes(variables.city, variables.country),
    onSuccess: (data) => {
      if (data?.data?.meta?.latitude && data?.data?.meta?.longitude) {
        qiblaMutation.mutate({
          latitude: data.data.meta.latitude,
          longitude: data.data.meta.longitude,
        });
      } else {
        qiblaMutation.reset(); 
      }
    },
    onError: () => {
        qiblaMutation.reset(); 
    }
  });

  const qiblaMutation = useMutation<QiblaResponse, Error, { latitude: number; longitude: number }>({
    mutationFn: (variables) => fetchQiblaDirection(variables.latitude, variables.longitude),
  });

  useEffect(() => {
    if (selectedCountry && citiesData[selectedCountry]) {
      setAvailableCities(citiesData[selectedCountry]);
      setSelectedCity(''); 
      prayerTimesMutation.reset();
      qiblaMutation.reset();
    } else if (selectedCountry && !citiesData[selectedCountry]) {
      setAvailableCities([]); 
      setSelectedCity('');
      prayerTimesMutation.reset();
      qiblaMutation.reset();
    } else {
      setAvailableCities([]); 
      setSelectedCity('');
      prayerTimesMutation.reset();
      qiblaMutation.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);


  useEffect(() => {
    if (selectedCity !== prayerTimesMutation.data?.data?.meta?.timezone?.split('/')[1]) { 
        prayerTimesMutation.reset();
        qiblaMutation.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);


  const handleFetchPrayerTimes = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity && selectedCountry) {
      prayerTimesMutation.mutate({ city: selectedCity, country: selectedCountry });
    }
  };

  const prayerTimesData = prayerTimesMutation.data?.data;
  const sortedTimings = prayerTimesData ?
    Object.entries(prayerTimesData.timings)
      .filter(([name]) => prayerOrder.includes(name))
      .sort(([a], [b]) => prayerOrder.indexOf(a) - prayerOrder.indexOf(b))
    : [];

  const getPrayerIcon = (prayerName: string) => {
    switch (prayerName) {
      case "Imsak": return <Coffee className="h-5 w-5 text-amber-600" />;
      case "Fajr": return <Sunrise className="h-5 w-5 text-sky-500" />;
      case "Sunrise": return <Sunrise className="h-5 w-5 text-yellow-500" />;
      case "Dhuhr": return <CloudSun className="h-5 w-5 text-orange-400" />;
      case "Asr": return <Sunset className="h-5 w-5 text-red-500" />;
      case "Sunset": return <Sunset className="h-5 w-5 text-pink-600" />;
      case "Maghrib": return <Moon className="h-5 w-5 text-indigo-500 transform rotate-90" />;
      case "Isha": return <CloudMoon className="h-5 w-5 text-purple-500" />;
      case "Midnight": return <Star className="h-5 w-5 text-slate-400" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden border border-border/60">
        <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-border/60">
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-primary">
            <MapPin className="h-7 w-7" />
            Islamic Prayer Times & Qibla
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Select your country and city to view daily prayer times and Qibla direction.
          </CardDescription>
          <div className="mt-4 flex items-start gap-2.5 text-sm text-muted-foreground p-3 bg-secondary/70 rounded-lg border border-dashed border-border/80">
            <Info className="h-5 w-5 shrink-0 mt-0.5 text-accent" />
            <div>
              <strong>Important Note:</strong> The city lists provided are samples. The prayer times service is very specific about city and country names.
              If your city is not listed or you encounter issues, please ensure the name is an exact match to what the service expects.
              Incorrect names may result in an error or no data. You might need to consult the service provider's documentation for officially supported names.
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleFetchPrayerTimes} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="country-select" className="text-base font-medium text-foreground/90">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger id="country-select" className="w-full mt-1 text-base py-3 px-4 h-12 rounded-lg border-input focus:ring-primary">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-72">
                    {countriesData.map(country => (
                      <SelectItem key={country.value} value={country.value} className="text-base py-2.5">{country.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city-select" className="text-base font-medium text-foreground/90">City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry}>
                  <SelectTrigger id="city-select" className="w-full mt-1 text-base py-3 px-4 h-12 rounded-lg border-input focus:ring-primary">
                     <SelectValue placeholder={selectedCountry && availableCities.length === 0 ? "Verify city name with service" : "Select a city"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-72">
                    {availableCities.length > 0 ? availableCities.map(city => (
                      <SelectItem key={city.value} value={city.value} className="text-base py-2.5">{city.label}</SelectItem>
                    )) :
                    <SelectItem value="no-cities-info" disabled className="text-base py-2.5 text-muted-foreground">
                      {selectedCountry ? "No sample cities. Enter city or check service docs." : "Select a country first."}
                    </SelectItem>
                    }
                  </SelectContent>
                </Select>
                 {selectedCountry && availableCities.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    No sample cities for this country. The service might still support your city if the name is accurate.
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" disabled={prayerTimesMutation.isPending || !selectedCity || !selectedCountry} className="w-full sm:w-auto text-base px-8 py-3 h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              {prayerTimesMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Fetching Data...
                </>
              ) : (
                <>
                 <CalendarDays className="mr-2 h-5 w-5" />
                  Get Times & Qibla
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {prayerTimesMutation.isError && (
        <Alert variant="destructive" className="shadow-md rounded-lg border-destructive/70">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Error Fetching Prayer Times</AlertTitle>
          <AlertDescription>
            {(prayerTimesMutation.error as ApiError)?.message || 'An unexpected error occurred.'}
            <br />
            Please ensure the city and country combination is valid and spelled exactly as expected by the prayer times service.
            Some city names might need to be very specific.
            Refer to the service's documentation for precise location names if you continue to experience issues.
          </AlertDescription>
        </Alert>
      )}

      {prayerTimesMutation.isPending && (
        <Card className="shadow-lg rounded-xl border border-border/60">
          <CardHeader className="p-6">
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted/70" />
            <Skeleton className="h-6 w-3/4 mt-2.5 rounded-md bg-muted/70" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-6 w-28 rounded-md bg-muted/70" /></TableHead>
                  <TableHead><Skeleton className="h-6 w-24 rounded-md bg-muted/70" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32 rounded-md bg-muted/70" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-md bg-muted/70" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6">
                <Skeleton className="h-7 w-1/3 rounded-md bg-muted/70" />
                <Skeleton className="h-6 w-1/2 mt-2.5 rounded-md bg-muted/70" />
            </div>
          </CardContent>
        </Card>
      )}

      {prayerTimesMutation.isSuccess && prayerTimesData && (
        <>
        <Card className="shadow-xl rounded-xl overflow-hidden border border-border/60">
          <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-border/60 p-6">
            <CardTitle className="text-2xl font-semibold text-primary">Prayer Times for {selectedCity}, {selectedCountry}</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2 space-y-1.5">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary/80"/>
                    <span>Gregorian: {prayerTimesData.date.readable}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-primary/80"/>
                    <span>Hijri: {prayerTimesData.date.hijri.day} {prayerTimesData.date.hijri.month.en} {prayerTimesData.date.hijri.year} {prayerTimesData.date.hijri.designation.abbreviation} ({prayerTimesData.date.hijri.weekday.en})</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary/80"/>
                    <span>Timezone: {prayerTimesData.meta.timezone}</span>
                </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] font-semibold text-base text-muted-foreground">Prayer</TableHead>
                  <TableHead className="font-semibold text-base text-muted-foreground">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTimings.map(([name, time]) => (
                  <TableRow key={name} className="text-base hover:bg-muted/30 dark:hover:bg-muted/20">
                    <TableCell className="font-medium flex items-center gap-3 py-3.5">
                      {getPrayerIcon(name)}
                      {name}
                    </TableCell>
                    <TableCell className="py-3.5">{time as string}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-6 pt-4 border-t border-border/60">Calculation Method: {prayerTimesData.meta.method.name}</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-xl overflow-hidden border border-border/60">
            <CardHeader className="bg-accent/5 dark:bg-accent/10 border-b border-border/60 p-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-accent">
                    <Compass className="h-7 w-7" />
                    Qibla Direction
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                    Direction of the Qibla from {selectedCity}, {selectedCountry}.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                {qiblaMutation.isPending && (
                    <div className="flex items-center space-x-3">
                        <Loader2 className="h-6 w-6 animate-spin text-accent" />
                        <p className="text-muted-foreground">Fetching Qibla direction...</p>
                    </div>
                )}
                {qiblaMutation.isError && (
                    <Alert variant="destructive" className="shadow-sm rounded-lg border-destructive/70">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="text-lg font-semibold">Error Fetching Qibla Direction</AlertTitle>
                        <AlertDescription>
                            {(qiblaMutation.error as ApiError)?.message || 'Could not retrieve Qibla direction.'}
                        </AlertDescription>
                    </Alert>
                )}
                {qiblaMutation.isSuccess && qiblaMutation.data?.data && (
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-accent">
                            {qiblaMutation.data.data.direction.toFixed(2)}°
                            <span className="text-xl font-medium text-muted-foreground"> from North</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Latitude: {qiblaMutation.data.data.latitude.toFixed(4)}, Longitude: {qiblaMutation.data.data.longitude.toFixed(4)}
                        </p>
                    </div>
                )}
                {!qiblaMutation.isPending && !qiblaMutation.isError && !qiblaMutation.data && prayerTimesMutation.isSuccess && (
                    <p className="text-muted-foreground">Qibla direction will be shown here.</p>
                )}
            </CardContent>
        </Card>
        </>
      )}
    </div>
  );
}
