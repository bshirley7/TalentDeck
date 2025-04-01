import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const skills = store.getSkills();
    const categories = Array.from(new Set(skills.map(skill => skill.category)));
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Add a new skill with the category to persist it
    const newSkill = store.addSkill({
      name: `Category: ${name}`, // Temporary skill to persist category
      category: name,
      proficiency: 'Intermediate',
    });

    return NextResponse.json({ category: name });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const oldName = searchParams.get('oldName');
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    if (!oldName) {
      return NextResponse.json(
        { error: 'Old category name is required' },
        { status: 400 }
      );
    }

    const data = await getSkillsData();
    const categories = Array.from(new Set(data.skills.map(skill => skill.category)));

    if (!categories.includes(oldName)) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    if (categories.includes(validatedData.name) && oldName !== validatedData.name) {
      return NextResponse.json(
        { error: 'New category name already exists' },
        { status: 400 }
      );
    }

    // Update all skills with this category
    data.skills = data.skills.map(skill => {
      if (skill.category === oldName) {
        return {
          ...skill,
          category: validatedData.name,
          name: skill.name === oldName ? validatedData.name : skill.name,
        };
      }
      return skill;
    });

    await saveSkillsData(data);
    return NextResponse.json(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid category data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const success = store.deleteCategory(category);
    if (!success) {
      return NextResponse.json(
        { error: 'Category not found or has associated skills' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 