import { NextRequest, NextResponse } from 'next/server';
import { addProfile } from '@/lib/data';
import { talentProfileSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const content = await file.text();
    let data;

    // Handle different file types
    if (file.name.endsWith('.json')) {
      data = JSON.parse(content);
    } else if (file.name.endsWith('.csv')) {
      // Parse CSV data
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {} as Record<string, string>);
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // Validate and transform data
    const profiles = Array.isArray(data) ? data : [data];
    const validatedProfiles = profiles.map(profile => {
      // Transform data to match our schema
      const transformedProfile = {
        id: profile.id || Math.random().toString(36).substr(2, 9),
        name: profile.name,
        department: profile.department,
        title: profile.title,
        contact: {
          email: profile.email,
          phone: profile.phone,
          website: profile.website,
          social: {
            linkedin: profile.linkedin,
            twitter: profile.twitter,
            facebook: profile.facebook,
            instagram: profile.instagram,
            tiktok: profile.tiktok,
            bluesky: profile.bluesky,
            youtube: profile.youtube,
            vimeo: profile.vimeo,
            behance: profile.behance,
            dribbble: profile.dribbble,
          },
        },
        skills: profile.skills || [],
        availability: {
          status: profile.availability?.status || 'Available',
          availableFrom: profile.availability?.availableFrom,
          notes: profile.availability?.notes,
        },
      };

      // Validate the transformed profile
      const validated = talentProfileSchema.parse(transformedProfile);
      return validated;
    });

    // Add profiles to the data store
    for (const profile of validatedProfiles) {
      await addProfile(profile);
    }

    return NextResponse.json(
      { message: `Successfully imported ${validatedProfiles.length} profiles` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    );
  }
} 