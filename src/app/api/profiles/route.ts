import { NextRequest, NextResponse } from 'next/server';
import { getProfilesData, saveProfilesData } from '@/lib/server/data';
import { z } from 'zod';
import { TalentProfile } from '@/types';

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
    const data = await getProfilesData();
    return NextResponse.json(data.profiles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const data = await getProfilesData();
    const newProfile: TalentProfile = {
      id: Math.random().toString(36).substr(2, 9),
      ...validatedData,
    };

    data.profiles.push(newProfile);
    await saveProfilesData(data);

    return NextResponse.json(newProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add profile' },
      { status: 500 }
    );
  }
} 