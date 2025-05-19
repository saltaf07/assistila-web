
import { NextResponse, type NextRequest } from 'next/server';
import type { ApiError } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const country = searchParams.get('country');
  // Using ISNA method by default, can be made configurable
  const method = searchParams.get('method') || '2';

  if (!city || !country) {
    return NextResponse.json({ message: 'City and Country parameters are required' } as ApiError, { status: 400 });
  }

  try {
    const apiUrl = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      // Aladhan API returns specific error messages in `data` field for 400/404 errors
      // or sometimes in a top-level `status` field for other errors.
      const message = (errorData && errorData.data && typeof errorData.data === 'string')
                        ? errorData.data
                        : (errorData && errorData.status && typeof errorData.status === 'string')
                            ? errorData.status
                            : `Error fetching prayer times: ${response.statusText}. The API might not recognize the provided city/country combination.`;
      return NextResponse.json(
        { message, details: errorData } as ApiError, // Keep original errorData for potential details
        { status: response.status }
      );
    }

    const data = await response.json();

    // Aladhan API might return 200 OK but with an error status code internally
    if (data.code !== 200) {
      // Prefer `data.data` or `data.status` if they are strings, otherwise provide a generic message.
      const errorMessage = (data.data && typeof data.data === 'string')
                            ? data.data
                            : (data.status && typeof data.status === 'string')
                                ? data.status
                                : 'Failed to retrieve prayer times from Aladhan API. The city/country may not be supported or an unknown error occurred.';
      return NextResponse.json(
        { message: errorMessage, details: data.data } as ApiError,
        // Use Aladhan's code if it's a client error (4xx), otherwise default to 500
        { status: (data.code >= 400 && data.code < 500) ? data.code : 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Prayer Times API proxy error:', error);
    return NextResponse.json({ message: 'Internal server error while fetching prayer times. Please try again later.' } as ApiError, { status: 500 });
  }
}
