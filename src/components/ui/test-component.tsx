'use client';

export interface SelectedSkill {
  value: string;
  label: string;
  category?: string;
}

interface TestComponentProps {
  value: SelectedSkill[];
  onChange: (value: SelectedSkill[]) => void;
}

export function SkillsDropdown({ value, onChange }: TestComponentProps) {
  return (
    <div style={{ 
      border: '10px solid red', 
      padding: '20px', 
      backgroundColor: 'yellow',
      margin: '10px'
    }}>
      <h1 style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>
        🚨 TEST COMPONENT LOADED! 🚨
      </h1>
      <p>This proves the component system is working!</p>
      <button 
        onClick={() => {
          console.log('🔥 TEST BUTTON CLICKED!');
          const testSkill = { value: 'test', label: 'Test Skill', category: 'Test' };
          onChange([...value, testSkill]);
        }}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: 'red', 
          color: 'white', 
          border: 'none',
          cursor: 'pointer'
        }}
      >
        CLICK ME - ADD TEST SKILL
      </button>
      <p>Selected skills: {value.length}</p>
    </div>
  );
} 