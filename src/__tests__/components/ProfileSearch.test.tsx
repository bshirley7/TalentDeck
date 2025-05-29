import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileSearch } from '@/components/profiles/display/ProfileSearch';
import { TalentProfile } from '@/types';

const mockProfiles: TalentProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    department: 'Engineering',
    title: 'Senior Developer',
    hourlyRate: 100,
    dayRate: 800,
    yearlySalary: 120000,
    contact: {
      email: 'john@example.com',
      phone: '+1234567890',
    },
    skills: [
      { id: 'skill1', name: 'JavaScript', category: 'Programming', proficiency: 'Expert' },
      { id: 'skill2', name: 'React', category: 'Frontend', proficiency: 'Advanced' },
    ],
    availability: {
      status: 'Available'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    department: 'Design',
    title: 'UX Designer',
    hourlyRate: 80,
    dayRate: 640,
    yearlySalary: 100000,
    contact: {
      email: 'jane@example.com',
      phone: '+1234567891',
    },
    skills: [
      { id: 'skill3', name: 'Figma', category: 'Design', proficiency: 'Expert' },
      { id: 'skill4', name: 'JavaScript', category: 'Programming', proficiency: 'Intermediate' },
    ],
    availability: {
      status: 'On Project'
    }
  }
];

describe('ProfileSearch', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('should filter profiles by skill selection', () => {
    render(<ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />);
    
    // Should initially call with all profiles
    expect(mockOnSearch).toHaveBeenCalledWith(mockProfiles);
    
    // Search for JavaScript skill
    const skillInput = screen.getByPlaceholderText('Search skills...');
    fireEvent.change(skillInput, { target: { value: 'JavaScript' } });
    fireEvent.focus(skillInput);
    
    // Should show JavaScript in dropdown
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    
    // Click to select JavaScript
    fireEvent.click(screen.getByText('JavaScript'));
    
    // Should filter to both profiles since both have JavaScript
    expect(mockOnSearch).toHaveBeenCalledWith(mockProfiles);
  });

  it('should filter profiles by department', () => {
    render(<ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />);
    
    const departmentSelect = screen.getByDisplayValue('All Domains');
    fireEvent.change(departmentSelect, { target: { value: 'Engineering' } });
    
    // Should filter to only John Doe
    expect(mockOnSearch).toHaveBeenCalledWith([mockProfiles[0]]);
  });

  it('should show skill filter mode toggle when multiple skills selected', () => {
    render(<ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />);
    
    // Select first skill
    const skillInput = screen.getByPlaceholderText('Search skills...');
    fireEvent.change(skillInput, { target: { value: 'JavaScript' } });
    fireEvent.focus(skillInput);
    fireEvent.click(screen.getByText('JavaScript'));
    
    // Select second skill
    fireEvent.change(skillInput, { target: { value: 'React' } });
    fireEvent.focus(skillInput);
    fireEvent.click(screen.getByText('React'));
    
    // Should show filter mode toggle
    expect(screen.getByText('Any skill')).toBeInTheDocument();
    expect(screen.getByText('All skills')).toBeInTheDocument();
  });

  it('should clear all filters', () => {
    render(<ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />);
    
    // Set some filters
    const searchInput = screen.getByPlaceholderText('Search by name or title...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Clear all filters
    const clearButton = screen.getByText('Clear all');
    fireEvent.click(clearButton);
    
    // Should reset to all profiles
    expect(mockOnSearch).toHaveBeenCalledWith(mockProfiles);
    expect(searchInput).toHaveValue('');
  });
}); 