import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProfileSearch } from '../ProfileSearch';
import { TalentProfile } from '@/types';

// Mock fetch globally
global.fetch = jest.fn();

const mockProfiles: TalentProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    title: 'Software Engineer',
    department: 'Engineering',
    bio: 'Experienced developer',
    skills: [
      { id: 's1', name: 'JavaScript', category: 'Programming', proficiency: 'Expert' }
    ],
    availability: { status: 'Available' },
    contact: { 
      email: 'john@example.com',
      phone: '+1-555-0123'
    }
  }
];

const mockAllSkills = [
  { id: '1', name: 'JavaScript', category: 'Programming', proficiency: 'Expert' },
  { id: '2', name: 'Python', category: 'Programming', proficiency: 'Advanced' },
  { id: '3', name: 'React', category: 'Frontend', proficiency: 'Expert' },
  { id: '4', name: 'Machine Learning', category: 'AI', proficiency: 'Intermediate' }
];

describe('ProfileSearch', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch all available skills from API, not just profile-attached skills', async () => {
    // Mock the API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAllSkills
    });

    const mockOnSearch = jest.fn();
    
    render(
      <ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />
    );

    // Wait for skills to be fetched
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/skills');
    });

    // Click on the skills input to open dropdown
    const skillsInput = screen.getByPlaceholderText('Search skills...');
    fireEvent.focus(skillsInput);

    // Wait for dropdown to appear and check that ALL skills are available
    // Note: In the old implementation, only "JavaScript" would be available 
    // because it's the only skill attached to a profile
    await waitFor(() => {
      // Skills should be available in dropdown (when typing)
      fireEvent.change(skillsInput, { target: { value: 'Python' } });
    });

    // Python should be available even though no profile has it
    await waitFor(() => {
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    // React should also be available
    fireEvent.change(skillsInput, { target: { value: 'React' } });
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    // Machine Learning should also be available
    fireEvent.change(skillsInput, { target: { value: 'Machine' } });
    await waitFor(() => {
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    });
  });

  it('should show loading state while fetching skills', async () => {
    // Mock a delayed API response
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => mockAllSkills
        }), 100)
      )
    );

    const mockOnSearch = jest.fn();
    
    render(
      <ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />
    );

    // Should show loading placeholder
    expect(screen.getByPlaceholderText('Loading skills...')).toBeInTheDocument();
    
    // Input should be disabled while loading
    const skillsInput = screen.getByPlaceholderText('Loading skills...');
    expect(skillsInput).toBeDisabled();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search skills...')).toBeInTheDocument();
    });

    // Input should be enabled after loading
    const enabledInput = screen.getByPlaceholderText('Search skills...');
    expect(enabledInput).not.toBeDisabled();
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const mockOnSearch = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />
    );

    // Wait for error to be handled
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching skills:', expect.any(Error));
    });

    // Should still render the component with empty skills
    expect(screen.getByPlaceholderText('Search skills...')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('should fetch all available domains from API, not just profile-attached domains', async () => {
    const mockAllDomains = ['Engineering', 'Design', 'Government', 'Marketing'];
    
    // Mock the API responses
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAllSkills
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAllDomains
      });

    const mockOnSearch = jest.fn();
    
    render(
      <ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />
    );

    // Wait for domains to be fetched
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/domains');
    });

    // Check that ALL domains are available in the dropdown
    // Note: In the old implementation, only "Engineering" would be available 
    // because it's the only domain attached to a profile
    const domainSelect = screen.getByLabelText('Domain');
    
    // The select should not be disabled after loading
    await waitFor(() => {
      expect(domainSelect).not.toBeDisabled();
    });

    // All domains should be available as options, including those not in profiles
    await waitFor(() => {
      expect(screen.getByText('Government')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
    });
  });

  it('should show loading state for domains while fetching', async () => {
    // Mock delayed API responses
    (fetch as jest.Mock)
      .mockImplementation((url) => {
        if (url === '/api/skills') {
          return Promise.resolve({
            ok: true,
            json: async () => mockAllSkills
          });
        }
        if (url === '/api/domains') {
          return new Promise(resolve => 
            setTimeout(() => resolve({
              ok: true,
              json: async () => ['Engineering', 'Design', 'Government']
            }), 100)
          );
        }
      });

    const mockOnSearch = jest.fn();
    
    render(
      <ProfileSearch profiles={mockProfiles} onSearch={mockOnSearch} />
    );

    // Should show loading state for domains
    const domainSelect = screen.getByLabelText('Domain');
    expect(domainSelect).toBeDisabled();
    expect(screen.getByText('Loading domains...')).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() => {
      expect(domainSelect).not.toBeDisabled();
      expect(screen.getByText('All Domains')).toBeInTheDocument();
    });
  });
}); 