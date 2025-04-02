import { NextRequest, NextResponse } from 'next/server';
import { getProfilesData, saveProfilesData } from '@/lib/server/data';
import { z } from 'zod';
import { TalentProfile } from '@/types';
import { talentProfileSchema } from '@/lib/validation';
import { store } from '@/lib/store';
import { ZodError } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1),
  department: z.string().min(1),
  title: z.string().min(1),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(1),
    website: z.string().url().optional(),
    social: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
      dribbble: z.string().url().optional(),
    }).default({}),
  }),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  })),
  availability: z.object({
    status: z.enum(['Available', 'Busy', 'Away']),
    availableFrom: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export async function GET() {
  try {
    const dataStore = await store;
    const profiles = await dataStore.getProfiles();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = talentProfileSchema.parse(body);
    const dataStore = await store;
    const profile = await dataStore.addProfile(validatedData);
    return NextResponse.json(profile, { status: 201 });
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