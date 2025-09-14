import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'global';
    
    // Fetch outbreak data from disease.sh API
    const response = await fetch(`https://disease.sh/v3/covid-19/countries/${country}`);
    
    if (!response.ok) {
      // Fallback to global data if country-specific data fails
      const globalResponse = await fetch('https://disease.sh/v3/covid-19/all');
      if (!globalResponse.ok) {
        throw new Error('Failed to fetch outbreak data');
      }
      const globalData = await globalResponse.json();
      
      return NextResponse.json({
        country: 'Global',
        covid19: {
          cases: globalData.cases,
          deaths: globalData.deaths,
          recovered: globalData.recovered,
          active: globalData.active,
          todayCases: globalData.todayCases,
          todayDeaths: globalData.todayDeaths,
          updated: globalData.updated
        },
        flu: {
          // Mock flu data - in production, integrate with actual flu tracking APIs
          cases: Math.floor(Math.random() * 1000),
          trend: 'stable',
          season: 'active'
        },
        dengue: {
          // Mock dengue data - in production, integrate with WHO/CDC APIs
          cases: Math.floor(Math.random() * 100),
          trend: 'increasing',
          season: 'active'
        }
      });
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      country: data.country,
      covid19: {
        cases: data.cases,
        deaths: data.deaths,
        recovered: data.recovered,
        active: data.active,
        todayCases: data.todayCases,
        todayDeaths: data.todayDeaths,
        updated: data.updated
      },
      flu: {
        cases: Math.floor(Math.random() * 1000),
        trend: 'stable',
        season: 'active'
      },
      dengue: {
        cases: Math.floor(Math.random() * 100),
        trend: 'increasing',
        season: 'active'
      }
    });
    
  } catch (error) {
    console.error('Error fetching outbreak data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outbreak data' },
      { status: 500 }
    );
  }
}
