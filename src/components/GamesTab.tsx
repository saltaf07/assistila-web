
"use client";

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchFreeToPlayGames } from '@/lib/apiClient';
import type { ApiError, FreeToGameEntry } from '@/types';
import { XCircle, Gamepad2, ExternalLink, ListFilter, FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FreeToPlayGamesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <Card key={index} className="shadow-lg rounded-xl overflow-hidden border border-border/60">
        <CardHeader className="p-0">
          <Skeleton className="h-48 w-full bg-muted/70" />
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <Skeleton className="h-6 w-3/4 rounded-md bg-muted/70" />
          <Skeleton className="h-4 w-1/2 rounded-md bg-muted/70" />
          <Skeleton className="h-4 w-1/3 rounded-md bg-muted/70" />
          <Skeleton className="h-10 w-full rounded-md bg-muted/70" />
        </CardContent>
        <CardFooter className="p-4">
          <Skeleton className="h-10 w-1/2 rounded-md bg-muted/70" />
        </CardFooter>
      </Card>
    ))}
  </div>
);


function FreeToPlayGames() {
  const [platform, setPlatform] = useState('all'); // 'all', 'pc', 'browser'
  const [category, setCategory] = useState('all'); // e.g., 'shooter', 'moba', 'strategy', 'all'
  const [sortBy, setSortBy] = useState('relevance'); // e.g., 'release-date', 'popularity', 'alphabetical', 'relevance'
  const queryClient = useQueryClient();


  const { data: games, isLoading, isError, error, refetch } = useQuery<FreeToGameEntry[], Error>({
    queryKey: ['freeToPlayGames', platform, category, sortBy],
    queryFn: () => fetchFreeToPlayGames(
      platform === 'all' ? undefined : platform,
      category === 'all' ? undefined : category,
      sortBy === 'relevance' ? undefined : sortBy
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleFilterChange = () => {
    // Invalidate and refetch the query
    queryClient.invalidateQueries({ queryKey: ['freeToPlayGames', platform, category, sortBy] });
    refetch();
  }
  
  const clearFilters = () => {
    setPlatform('all');
    setCategory('all');
    setSortBy('relevance');
    // queryClient.invalidateQueries({ queryKey: ['freeToPlayGames']}); // More generic invalidation
    // refetch will be called by the useEffect in useQuery when state changes, 
    // or we can call it manually if preferred.
  }

  const gameCategories = [
    {value: 'all', label: 'All Categories'}, {value: 'mmorpg', label: 'MMORPG'}, {value: 'shooter', label: 'Shooter'}, 
    {value: 'strategy', label: 'Strategy'}, {value: 'moba', label: 'MOBA'}, {value: 'racing', label: 'Racing'},
    {value: 'sports', label: 'Sports'}, {value: 'social', label: 'Social'}, {value: 'sandbox', label: 'Sandbox'},
    {value: 'open-world', label: 'Open World'}, {value: 'survival', label: 'Survival'}, {value: 'pvp', label: 'PvP'},
    {value: 'pve', label: 'PvE'}, {value: 'pixel', label: 'Pixel'}, {value: 'voxel', label: 'Voxel'}, 
    {value: 'zombie', label: 'Zombie'}, {value: 'turn-based', label: 'Turn-Based'}, {value: 'first-person', label: 'First-Person'},
    {value: 'third-Person', label: 'Third-Person'}, {value: 'top-down', label: 'Top-Down'}, {value: 'tank', label: 'Tank'},
    {value: 'space', label: 'Space'}, {value: 'sailing', label: 'Sailing'}, {value: 'side-scroller', label: 'Side-Scroller'},
    {value: 'superhero', label: 'Superhero'}, {value: 'permadeath', label: 'Permadeath'}, {value: 'card', label: 'Card Games'},
    {value: 'battle-royale', label: 'Battle Royale'}, {value: 'mmo', label: 'MMO'}, {value: 'mmofps', label: 'MMOFPS'},
    {value: 'mmotps', label: 'MMOTPS'}, {value: '3d', label: '3D Graphics'}, {value: '2d', label: '2D Graphics'},
    {value: 'anime', label: 'Anime'}, {value: 'fantasy', label: 'Fantasy'}, {value: 'sci-fi', label: 'Sci-Fi'},
    {value: 'fighting', label: 'Fighting'}, {value: 'action-rpg', label: 'Action RPG'}, {value: 'action', label: 'Action'},
    {value: 'military', label: 'Military'}, {value: 'martial-arts', label: 'Martial Arts'}, {value: 'flight', label: 'Flight'},
    {value: 'low-spec', label: 'Low-spec'}, {value: 'tower-defense', label: 'Tower Defense'}, {value: 'horror', label: 'Horror'},
    {value: 'mmorts', label: 'MMORTS'}
  ];

  return (
    <Card className="shadow-xl rounded-xl overflow-hidden border border-border/60">
      <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-border/60">
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-primary">
          <Gamepad2 className="h-7 w-7" />
          Discover Free-to-Play Games
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-1">
          Browse a list of free-to-play games. Click to visit their page and play!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 p-4 border border-border/40 rounded-lg bg-background shadow">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="platform-select" className="text-xs font-medium text-muted-foreground">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform-select" className="h-10 rounded-md border-input focus:ring-primary">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="pc">PC (Windows)</SelectItem>
                <SelectItem value="browser">Web Browser</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1.5">
            <label htmlFor="category-select" className="text-xs font-medium text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category-select" className="h-10 rounded-md border-input focus:ring-primary">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {gameCategories.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1.5">
            <label htmlFor="sortby-select" className="text-xs font-medium text-muted-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sortby-select" className="h-10 rounded-md border-input focus:ring-primary">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="release-date">Release Date</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2 pt-1 sm:pt-0">
             <Button onClick={handleFilterChange} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md">
                <ListFilter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button onClick={clearFilters} variant="outline" className="h-10 rounded-md">
                <FilterX className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
        
        {isLoading && <FreeToPlayGamesSkeleton />}
        {isError && (
          <Alert variant="destructive" className="shadow-sm rounded-lg border-destructive/70">
            <XCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Error Fetching Games</AlertTitle>
            <AlertDescription>{(error as ApiError)?.message || 'Could not fetch free-to-play games. Please try again later.'}</AlertDescription>
          </Alert>
        )}
        {games && games.length === 0 && !isLoading && (
           <Alert className="shadow-sm rounded-lg border-border/70">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold text-primary">No Games Found</AlertTitle>
            <AlertDescription>No games matched your current filter criteria. Try broadening your search!</AlertDescription>
          </Alert>
        )}
        {games && games.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="shadow-lg rounded-xl overflow-hidden flex flex-col border border-border/60 hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="p-0 relative">
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    width={400}
                    height={225}
                    className="object-cover w-full h-48"
                    unoptimized={false}
                  />
                </CardHeader>
                <CardContent className="p-4 space-y-2 flex-grow">
                  <CardTitle className="text-xl font-semibold text-primary hover:underline">
                    <a href={game.freetogame_profile_url} target="_blank" rel="noopener noreferrer">{game.title}</a>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-3">{game.short_description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary" className="text-xs">{game.genre}</Badge>
                    <Badge variant="outline" className="text-xs">{game.platform}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 border-t border-border/50">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg">
                    <a href={game.game_url} target="_blank" rel="noopener noreferrer">
                      Play Game <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function GamesTab() {
  return (
    <div className="space-y-10">
      <FreeToPlayGames />
    </div>
  );
}
