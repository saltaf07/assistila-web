
import { NextResponse, type NextRequest } from 'next/server';
import type { ApiError } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return NextResponse.json({ message: 'Latitude and Longitude parameters are required' } as ApiError, { status: 400 });
  }

  try {
    const apiUrl = `http://api.aladhan.com/v1/qibla/${latitude}/${longitude}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = (errorData && errorData.data && typeof errorData.data === 'string')
                        ? errorData.data
                        : `Error fetching Qibla direction: ${response.statusText}. The API might not be able to calculate Qibla for the provided coordinates.`;
      return NextResponse.json(
        { message, details: errorData } as ApiError,
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.code !== 200) {
      const errorMessage = (data.data && typeof data.data === 'string')
                            ? data.data
                            : (data.status && typeof data.status === 'string')
                                ? data.status
                                : 'Failed to retrieve Qibla direction from Aladhan API.';
      return NextResponse.json(
        { message: errorMessage, details: data.data } as ApiError,
        { status: (data.code >= 400 && data.code < 500) ? data.code : 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Qibla Direction API proxy error:', error);
    return NextResponse.json({ message: 'Internal server error while fetching Qibla direction.' } as ApiError, { status: 500 });
  }
}
