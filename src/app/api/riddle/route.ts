
import { NextResponse, type NextRequest } from 'next/server';
import type { ApiError, Riddle } from '@/types';

const EXTERNAL_RIDDLE_API_URL = 'https://riddles-api.vercel.app/random';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(EXTERNAL_RIDDLE_API_URL);

    if (!response.ok) {
      // Try to parse error from external API, if available
      const errorText = await response.text();
      console.error(`External Riddle API Error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { message: `Error fetching riddle from external source: ${response.statusText}` } as ApiError,
        { status: response.status }
      );
    }

    const data: Riddle = await response.json();
    
    // Validate that the response has the expected structure
    if (typeof data.riddle !== 'string' || typeof data.answer !== 'string') {
        console.error('External Riddle API returned unexpected data format:', data);
        return NextResponse.json(
            { message: 'Received malformed data from external riddle source.' } as ApiError,
            { status: 502 } // Bad Gateway, as we got an invalid response from upstream
        );
    }
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Riddle API proxy error:', error);
    let message = 'Internal server error while fetching riddle.';
    if (error instanceof Error) {
        message = error.message.includes('fetch failed') 
            ? 'Could not connect to the external riddle service. Please check network connectivity.'
            : message;
    }
    return NextResponse.json({ message } as ApiError, { status: 500 });
  }
}
