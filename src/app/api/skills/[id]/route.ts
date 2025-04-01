import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SKILLS_FILE_PATH = path.join(process.cwd(), 'data', 'skills.json');

// Helper function to read skills data
async function getSkillsData() {
  try {
    const jsonData = await fs.promises.readFile(SKILLS_FILE_PATH, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return { skills: [], categories: [] };
  }
}

// Helper function to save skills data
async function saveSkillsData(data: { skills: any[]; categories: string[] }) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    await fs.promises.mkdir(dataDir, { recursive: true });
  }

  await fs.promises.writeFile(
    SKILLS_FILE_PATH,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getSkillsData();
    const skillToDelete = data.skills.find((skill: any) => skill.id === params.id);

    if (!skillToDelete) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Remove the skill
    data.skills = data.skills.filter((skill: any) => skill.id !== params.id);

    // Check if we need to remove the category
    const categoryStillInUse = data.skills.some(
      (skill: any) => skill.category === skillToDelete.category
    );

    if (!categoryStillInUse) {
      data.categories = data.categories.filter(
        (category: string) => category !== skillToDelete.category
      );
    }

    await saveSkillsData(data);
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
} 