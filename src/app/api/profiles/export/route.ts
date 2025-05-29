import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { profilesToCSV } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const ids = searchParams.get('ids'); // Comma-separated profile IDs

    const storeInstance = await store;
    let profiles = await storeInstance.getProfiles();

    // Filter by specific IDs if provided
    if (ids) {
      const idArray = ids.split(',').map(id => id.trim());
      profiles = profiles.filter(profile => idArray.includes(profile.id));
    }

    if (format === 'csv') {
      const csvContent = profilesToCSV(profiles);
      const timestamp = new Date().toISOString().split('T')[0];
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="talent-profiles-${timestamp}.csv"`,
        },
      });
    }

    // Default to JSON if format is not CSV
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error exporting profiles:', error);
    return NextResponse.json(
      { error: 'Failed to export profiles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 