
"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchDefinition } from '@/lib/apiClient';
import type { DictionaryEntry, ApiError } from '@/types';
import { Search, Volume2, AlertCircle, Loader2, BookText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function DictionaryTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const definitionMutation = useMutation<DictionaryEntry[], Error, string>({
    mutationFn: fetchDefinition,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      definitionMutation.mutate(searchTerm.trim());
    }
  };
  
  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.error("Failed to play audio:", err));
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden border border-border/60">
        <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-border/60">
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-primary">
            <BookText className="h-7 w-7" />
            English Dictionary
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">Enter an English word to find its definition, phonetics, and usage examples.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="e.g., 'serendipity'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow text-base py-3 px-4 h-12 rounded-lg border-input focus:ring-primary"
              aria-label="Search term"
            />
            <Button type="submit" disabled={definitionMutation.isPending || !searchTerm.trim()} className="text-base px-8 py-3 h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              {definitionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" /> Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {definitionMutation.isError && (
        <Alert variant="destructive" className="shadow-md rounded-lg border-destructive/70">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Error Fetching Definition</AlertTitle>
          <AlertDescription>{(definitionMutation.error as ApiError)?.message || 'An unexpected error occurred. Please try again.'}</AlertDescription>
        </Alert>
      )}

      {definitionMutation.isPending && (
        <Card className="shadow-lg rounded-xl border border-border/60">
          <CardHeader className="p-6">
            <Skeleton className="h-9 w-3/5 rounded-md bg-muted/70" />
            <Skeleton className="h-7 w-2/5 mt-2.5 rounded-md bg-muted/70" />
          </CardHeader>
          <CardContent className="space-y-5 p-6 pt-0">
            <Skeleton className="h-6 w-full rounded-md bg-muted/70" />
            <Skeleton className="h-6 w-5/6 rounded-md bg-muted/70" />
            <div className="pt-4">
              <Skeleton className="h-7 w-1/4 rounded-md bg-muted/70" />
              <Skeleton className="h-6 w-full mt-2.5 rounded-md bg-muted/70" />
              <Skeleton className="h-6 w-full mt-2 rounded-md bg-muted/70" />
            </div>
          </CardContent>
        </Card>
      )}

      {definitionMutation.isSuccess && definitionMutation.data && definitionMutation.data.length > 0 && (
        <>
          <Card className="shadow-xl rounded-xl overflow-hidden border border-border/60">
            <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-border/60 p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-4xl font-bold text-primary">{definitionMutation.data[0].word}</CardTitle>
                  {definitionMutation.data[0].phonetic && (
                    <CardDescription className="text-2xl text-muted-foreground mt-1.5">{definitionMutation.data[0].phonetic}</CardDescription>
                  )}
                </div>
                {definitionMutation.data[0].phonetics?.find(p => p.audio)?.audio && (
                    <Button variant="outline" size="icon" onClick={() => playAudio(definitionMutation.data[0].phonetics.find(p => p.audio)?.audio)} className="mt-1 ml-2 flex-shrink-0 rounded-full h-12 w-12 border-2 border-primary/50 hover:bg-primary/10">
                        <Volume2 className="h-6 w-6 text-primary" />
                        <span className="sr-only">Listen to pronunciation</span>
                    </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {definitionMutation.data[0].meanings.map((meaning, index) => (
                <div key={index} className="p-5 border border-border/50 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-semibold text-accent capitalize mb-3.5">{meaning.partOfSpeech}</h3>
                  <Separator className="mb-4 border-border/70"/>
                  {meaning.definitions.map((def, i) => (
                    <div key={i} className="mb-4 pb-2 last:mb-0 last:pb-0">
                      <p className="text-foreground/90 leading-relaxed text-base">{i+1}. {def.definition}</p>
                      {def.example && <p className="text-sm text-muted-foreground italic mt-2 pl-4 border-l-2 border-accent/40 py-0.5">E.g.: "{def.example}"</p>}
                      {def.synonyms && def.synonyms.length > 0 && <p className="text-sm text-primary/90 font-medium mt-2 pl-4">Synonyms: <span className="font-normal text-foreground/80">{def.synonyms.join(', ')}</span></p>}
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
      
      {definitionMutation.isSuccess && (!definitionMutation.data || definitionMutation.data.length === 0) && (
         <Alert className="shadow-md rounded-lg border-border/70">
            <Search className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold text-primary">No Definition Found</AlertTitle>
            <AlertDescription>The word "{searchTerm}" could not be found. Please check the spelling or try another word.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
