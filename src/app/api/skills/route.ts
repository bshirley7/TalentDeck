import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { z } from 'zod';
import { Skill } from '@/types';

const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

export async function GET() {
  try {
    const dataStore = await store;
    const skills = await dataStore.getSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = skillSchema.parse(body);

    const dataStore = await store;
    const newSkill = await dataStore.addSkill(validatedData);
    return NextResponse.json(newSkill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid skill data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = skillSchema.parse(body);

    const dataStore = await store;
    const skills = await dataStore.getSkills();
    const skillIndex = skills.findIndex((s: Skill) => s.id === validatedData.id);

    if (skillIndex === -1) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    const updatedSkill = await dataStore.addSkill(validatedData);
    return NextResponse.json(updatedSkill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid skill data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    const dataStore = await store;
    const success = await dataStore.deleteSkill(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
} 