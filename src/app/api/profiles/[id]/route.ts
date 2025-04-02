import { NextRequest, NextResponse } from 'next/server';
import { getProfilesData, saveProfilesData } from '@/lib/server/data';
import { z } from 'zod';
import { TalentProfile } from '@/types';

const profileSchema = z.object({
  name: z.string().min(1),
  department: z.string().min(1),
  title: z.string().min(1),
  hourlyRate: z.number().min(0).optional(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(1),
    website: z.string().url(),
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getProfilesData();
    const profile = data.profiles.find((p) => p.id === params.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const data = await getProfilesData();
    const profileIndex = data.profiles.findIndex((p) => p.id === params.id);

    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const updatedProfile: TalentProfile = {
      ...data.profiles[profileIndex],
      ...validatedData,
    };

    data.profiles[profileIndex] = updatedProfile;
    await saveProfilesData(data);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getProfilesData();
    const profileIndex = data.profiles.findIndex((p) => p.id === params.id);

    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    data.profiles.splice(profileIndex, 1);
    await saveProfilesData(data);

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
} 