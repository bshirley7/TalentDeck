import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { z } from 'zod';
import { Skill } from '@/types';

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

export async function GET() {
  try {
    const skills = store.getSkills();
    return NextResponse.json(skills);
  } catch (error) {
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

    const newSkill = store.addSkill(validatedData);
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

    const data = await getSkillsData();
    const skillIndex = data.skills.findIndex((s) => s.id === validatedData.id);

    if (skillIndex === -1) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    data.skills[skillIndex] = validatedData;
    await saveSkillsData(data);

    return NextResponse.json(validatedData);
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

    const data = await getSkillsData();
    const skillIndex = data.skills.findIndex((s) => s.id === id);

    if (skillIndex === -1) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    data.skills.splice(skillIndex, 1);
    await saveSkillsData(data);

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
} 