
import { NextResponse, type NextRequest } from 'next/server';
import type { ApiError, FreeToGameEntry } from '@/types';

const EXTERNAL_FREETOGAME_API_URL = 'https://www.freetogame.com/api/games';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const category = searchParams.get('category');
  const sortBy = searchParams.get('sort-by');

  const apiParams = new URLSearchParams();
  if (platform) apiParams.append('platform', platform);
  if (category) apiParams.append('category', category);
  if (sortBy) apiParams.append('sort-by', sortBy);

  try {
    const apiUrl = `${EXTERNAL_FREETOGAME_API_URL}?${apiParams.toString()}`;
    const response = await fetch(apiUrl, {
      // FreeToGame API sometimes blocks requests without a common user-agent
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      // Try to parse error from external API, if available
      const errorText = await response.text();
      console.error(`External FreeToGame API Error (${response.status}): ${errorText}`);
      let message = `Error fetching games from external source: ${response.statusText}`;
      if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
        message = `The game service is temporarily unavailable (Status: ${response.status}). Please try again later.`;
      }
      return NextResponse.json(
        { message } as ApiError,
        { status: response.status }
      );
    }

    const data: FreeToGameEntry[] | { status: number; status_message: string } = await response.json();
    
    // The API might return an error object with a 200 OK status if no games are found or other issues.
    // Example: { "status": 0, "status_message": "failed to fetch results - check query parameters" } -> this seems to be if parameters are bad
    // However, testing shows it usually returns an empty array for valid but no-result queries.
    // And for server errors, it returns non-200.
    // We will assume if it's 200 and an array, it's good. If it's 200 and an object with status_message, it's an API-level error.
    if (!Array.isArray(data) && 'status_message' in data) {
        console.error('FreeToGame API returned an error object with 200 OK:', data);
        return NextResponse.json(
            { message: data.status_message || 'Failed to retrieve games from FreeToGame API due to an unexpected API response.' } as ApiError,
            { status: 400 } // Treat as a client error from our perspective
        );
    }
    
    return NextResponse.json(data as FreeToGameEntry[]);

  } catch (error) {
    console.error('Free-to-Play Games API proxy error:', error);
    let message = 'Internal server error while fetching games.';
    if (error instanceof Error) {
        message = error.message.includes('fetch failed') 
            ? 'Could not connect to the external game service. Please check network connectivity.'
            : message;
    }
    return NextResponse.json({ message } as ApiError, { status: 500 });
  }
}
