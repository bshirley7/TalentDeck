'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileSkill } from '@/types';

type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface ProfileSkillsSectionProps {
  skills: ProfileSkill[];
  onChange: (skills: ProfileSkill[]) => void;
}

export function ProfileSkillsSection({ skills, onChange }: ProfileSkillsSectionProps) {
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    proficiency: 'Intermediate' as SkillProficiency
  });

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.category) {
      onChange([
        ...skills,
        {
          id: Date.now().toString(),
          name: newSkill.name,
          category: newSkill.category,
          proficiency: newSkill.proficiency,
        } as ProfileSkill
      ]);
      setNewSkill({ name: '', category: '', proficiency: 'Intermediate' as SkillProficiency });
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    onChange(skills.filter(skill => skill.id !== skillId));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Skills</h3>
      
      <div className="grid gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium">{skill.name}</p>
              <p className="text-sm text-gray-500">{skill.category} - {skill.proficiency}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveSkill(skill.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        <Input
          placeholder="Skill name"
          value={newSkill.name}
          onChange={e => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
        />
        
        <Input
          placeholder="Category"
          value={newSkill.category}
          onChange={e => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
        />
        
        <Select
          value={newSkill.proficiency}
          onValueChange={(value: SkillProficiency) => setNewSkill(prev => ({ ...prev, proficiency: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select proficiency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleAddSkill} className="bg-gradient-primary hover:bg-gradient-primary-hover text-white transition-all duration-200">Add Skill</Button>
      </div>
    </div>
  );
} 