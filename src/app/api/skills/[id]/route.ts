import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Attempt to delete the skill
    const success = store.deleteSkill(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Skill not found or could not be deleted' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({ 
      message: 'Skill deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 