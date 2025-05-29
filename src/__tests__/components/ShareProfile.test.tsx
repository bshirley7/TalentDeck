import { render, screen, fireEvent } from '@testing-library/react';
import { ShareProfile } from '@/components/profiles/ShareProfile';
import { TalentProfile } from '@/types';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock window.open
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});

// Mock window.location.href
delete (window as any).location;
(window as any).location = { href: '' };

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

describe('ShareProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).location.href = '';
  });

  it('should render share buttons', () => {
    render(<ShareProfile profile={mockProfile} />);
    
    expect(screen.getByText('Send Email')).toBeInTheDocument();
    expect(screen.getByText('Copy HTML')).toBeInTheDocument();
    expect(screen.getByText('Print/PDF')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should handle print functionality', () => {
    const mockPrintWindow = {
      document: {
        write: jest.fn(),
        close: jest.fn(),
      },
      print: jest.fn(),
    };
    
    mockOpen.mockReturnValue(mockPrintWindow);
    
    render(<ShareProfile profile={mockProfile} />);
    
    fireEvent.click(screen.getByText('Print/PDF'));
    
    expect(mockOpen).toHaveBeenCalledWith('', '_blank');
    expect(mockPrintWindow.document.write).toHaveBeenCalled();
    expect(mockPrintWindow.document.close).toHaveBeenCalled();
  });

  it('should copy email HTML to clipboard', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValue(undefined);
    
    // Mock window.alert
    window.alert = jest.fn();
    
    render(<ShareProfile profile={mockProfile} />);
    
    fireEvent.click(screen.getByText('Copy HTML'));
    
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('<!DOCTYPE html>'));
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('John Doe'));
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(window.alert).toHaveBeenCalledWith('Email HTML copied to clipboard! You can paste this into your email client.');
  });

  it('should generate mailto link when sending email', () => {
    render(<ShareProfile profile={mockProfile} />);
    
    fireEvent.click(screen.getByText('Send Email'));
    
    expect((window as any).location.href).toContain('mailto:');
    expect((window as any).location.href).toContain('Professional%20Profile%3A%20John%20Doe');
    expect((window as any).location.href).toContain('john%40example.com');
  });

  it('should generate HTML download with profile information', () => {
    render(<ShareProfile profile={mockProfile} />);
    
    // Test HTML download functionality by checking if it creates a download link
    const downloadButton = screen.getByText('Download');
    
    // Mock URL.createObjectURL and URL.revokeObjectURL
    const mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
    const mockRevokeObjectURL = jest.fn();
    
    Object.defineProperty(global.URL, 'createObjectURL', {
      writable: true,
      value: mockCreateObjectURL,
    });
    
    Object.defineProperty(global.URL, 'revokeObjectURL', {
      writable: true,
      value: mockRevokeObjectURL,
    });
    
    // Mock document.createElement and related methods
    const mockLink = {
      href: '',
      download: '',
      click: jest.fn(),
    };
    
    const originalCreateElement = document.createElement;
    document.createElement = jest.fn().mockReturnValue(mockLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    fireEvent.click(downloadButton);
    
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockLink.download).toBe('John_Doe_Profile.html');
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
    
    // Restore original createElement
    document.createElement = originalCreateElement;
  });
}); 