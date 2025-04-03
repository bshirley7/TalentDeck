'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skill, ProfileSkill } from '@/types';
import { getAllSkills } from '@/lib/actions';

interface ProfileSkillsSectionProps {
  skills: ProfileSkill[];
  onChange: (skills: ProfileSkill[]) => void;
}

export function ProfileSkillsSection({ skills, onChange }: ProfileSkillsSectionProps) {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsData = await getAllSkills();
        setAvailableSkills(skillsData);
        setCategories([...new Set(skillsData.map(s => s.category))]);
      } catch (error) {
        console.error('Error loading skills:', error);
      }
    };
    loadSkills();
  }, []);

  const handleAddSkill = () => {
    const newSkill: ProfileSkill = {
      id: crypto.randomUUID(),
      name: '',
      category: categories[0] || '',
      proficiency: 'Intermediate'
    };
    onChange([...skills, newSkill]);
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    onChange(updatedSkills);
  };

  const handleSkillChange = (index: number, field: keyof ProfileSkill, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    onChange(updatedSkills);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Skills & Expertise</Label>
        <Button type="button" variant="outline" onClick={handleAddSkill}>
          Add Skill
        </Button>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={skill.id} className="flex gap-4 items-start">
            <div className="flex-1">
              <Select
                value={skill.name}
                onValueChange={(value) => handleSkillChange(index, 'name', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Select
                value={skill.category}
                onValueChange={(value) => handleSkillChange(index, 'category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Select
                value={skill.proficiency}
                onValueChange={(value) => handleSkillChange(index, 'proficiency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleRemoveSkill(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 