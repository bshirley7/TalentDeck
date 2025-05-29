import { render, screen, fireEvent } from '@testing-library/react';
import { ShareButton } from '@/components/profiles/ShareButton';
import { TalentProfile } from '@/types';

// Mock the ShareProfileModal component
jest.mock('@/components/profiles/ShareProfileModal', () => ({
  ShareProfileModal: ({ isOpen, onClose, profile }: { isOpen: boolean; onClose: () => void; profile: TalentProfile }) => (
    isOpen ? (
      <div data-testid="share-modal">
        <span>Share modal for {profile.name}</span>
        <button onClick={onClose} data-testid="close-modal">Close</button>
      </div>
    ) : null
  )
}));

const mockProfile: TalentProfile = {
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
  },
  bio: 'Experienced developer with expertise in modern web technologies.'
};

describe('ShareButton', () => {
  it('should render the share button', () => {
    render(<ShareButton profile={mockProfile} />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveTextContent('Share');
  });

  it('should open modal when clicked', () => {
    render(<ShareButton profile={mockProfile} />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    expect(screen.getByTestId('share-modal')).toBeInTheDocument();
    expect(screen.getByText('Share modal for John Doe')).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(<ShareButton profile={mockProfile} />);
    
    // Open modal
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    expect(screen.getByTestId('share-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByTestId('close-modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('share-modal')).not.toBeInTheDocument();
  });

  it('should apply correct variant classes', () => {
    const { rerender } = render(<ShareButton profile={mockProfile} variant="default" />);
    
    let shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toHaveClass('bg-gradient-primary');
    
    rerender(<ShareButton profile={mockProfile} variant="outline" />);
    shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toHaveClass('border-gray-300');
  });

  it('should apply correct size classes', () => {
    const { rerender } = render(<ShareButton profile={mockProfile} size="sm" />);
    
    let shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toHaveClass('px-2', 'py-1', 'text-xs');
    
    rerender(<ShareButton profile={mockProfile} size="lg" />);
    shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toHaveClass('px-4', 'py-2.5', 'text-base');
  });
}); 