import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const categories = store.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);
    
    const success = store.addCategory(validatedData.name);
    if (!success) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: 'Category added successfully',
      category: validatedData.name
    });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json(
      { error: 'Failed to add category', details: error instanceof Error ? error.message : 'Unknown error' },
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

    // Check if old category exists
    const categories = store.getCategories();
    if (!categories.includes(oldName)) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if new name already exists
    if (categories.includes(validatedData.name) && oldName !== validatedData.name) {
      return NextResponse.json(
        { error: 'New category name already exists' },
        { status: 400 }
      );
    }

    // Update the category name
    const success = store.updateCategory(oldName, validatedData.name);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Category updated successfully',
      oldName,
      newName: validatedData.name
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category', details: error instanceof Error ? error.message : 'Unknown error' },
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
        { error: 'Category not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Category deleted successfully',
      category
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 