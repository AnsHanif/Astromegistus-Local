import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const key = 'n80RiYeFJce90emy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get('cityName');
    const countryID = searchParams.get('countryID');

    if (!cityName || !countryID) {
      return NextResponse.json(
        { error: 'cityName and countryID are required' },
        { status: 400 }
      );
    }

    const url = 'https://astroapp.com/astro/apis/locations/name';
    const params = {
      countryID: countryID,
      cityName: cityName,
      key: key,
    };
    const headers = {
      'User-Agent': 'Axios/1.0',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      key: key,
    };
    const auth = {
      username: 'jw@astromegistus.com',
      password: 'October17!',
    };

    const response = await axios.get(url, {
      params,
      headers,
      auth,
      timeout: 30000,
    });

    return NextResponse.json({
      exists: true,
      location: response.data,
      message: 'Location found in external API',
    });
  } catch (error: any) {
    if (error.response?.status === 404) {
      return NextResponse.json({
        exists: false,
        message: 'Location not found in external API',
      });
    }

    console.error('Error checking external location:', error);
    return NextResponse.json(
      {
        exists: false,
        message: 'Failed to check location',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
