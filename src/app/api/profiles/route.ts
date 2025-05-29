import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ProfileService } from '@/services/profiles.service';
import { initializeDatabase } from '@/lib/db';
import { talentProfileFormSchema } from '@/lib/validation';
import type { TalentProfile } from '@/types';

export async function GET() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Use ProfileService
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    
    const profiles = await profileService.getAllProfiles();
    
    return NextResponse.json({ 
      profiles, 
      total: profiles.length, 
      page: 1, 
      limit: profiles.length 
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize database
    await initializeDatabase();
    
    const body = await request.json();
    const validatedData = talentProfileFormSchema.parse(body) as Omit<TalentProfile, 'id'>;
    
    // Use ProfileService
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    
    const newProfile = await profileService.createProfile(validatedData);
    
    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
} 