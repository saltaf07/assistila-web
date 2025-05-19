import { NextResponse, type NextRequest } from 'next/server';
import type { ApiError } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  const word = params.word;

  if (!word) {
    return NextResponse.json({ message: 'Word parameter is required' } as ApiError, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      // Dictionary API returns error details in JSON format
      const errorData = await response.json().catch(() => null); // Try to parse error, default to null
      if (response.status === 404 && errorData) {
         return NextResponse.json(errorData as ApiError, { status: 404 });
      }
      return NextResponse.json(
        { message: `Error fetching definition from external API: ${response.statusText}`, ...errorData } as ApiError,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Dictionary API proxy error:', error);
    return NextResponse.json({ message: 'Internal server error while fetching definition' } as ApiError, { status: 500 });
  }
}
