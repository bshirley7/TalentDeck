import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ProfileService } from '@/services/profiles.service';

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Use ProfileService instead of JSON file storage
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    
    const profile = await profileService.getProfileById(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    // Use ProfileService instead of JSON file storage
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    
    const updatedProfile = await profileService.updateProfile(id, validatedData);

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Use ProfileService instead of JSON file storage
    const profileService = ProfileService.getInstance();
    await profileService.initialize();
    
    const deleted = await profileService.deleteProfile(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
} 