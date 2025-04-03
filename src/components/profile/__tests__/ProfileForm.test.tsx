import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '../ProfileForm';
import { TalentProfile } from '@/lib/types';

const mockProfile: TalentProfile = {
  id: '1',
  name: 'John Doe',
  title: 'Senior Developer',
  department: 'Engineering',
  bio: 'Experienced developer',
  contact: {
    email: 'john@example.com',
    phone: '1234567890',
    location: 'New York',
    social: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
  },
  skills: [
    {
      id: '1',
      name: 'React',
      category: 'Frontend',
      proficiency: 'Expert',
    },
  ],
  availability: {
    status: 'Available',
    nextAvailable: '2024-03-01',
    preferredHours: '9-5',
    timezone: 'UTC',
  },
  hourlyRate: 100,
  dayRate: 800,
  yearlySalary: 150000,
};

describe('ProfileForm', () => {
  it('renders all form fields', () => {
    render(<ProfileForm profile={mockProfile} />);

    // Check if all form fields are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/domain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hourly rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/day rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/yearly salary/i)).toBeInTheDocument();
  });

  it('pre-fills form with profile data', () => {
    render(<ProfileForm profile={mockProfile} />);

    // Check if form fields are pre-filled with profile data
    expect(screen.getByLabelText(/name/i)).toHaveValue(mockProfile.name);
    expect(screen.getByLabelText(/title/i)).toHaveValue(mockProfile.title);
    expect(screen.getByLabelText(/domain/i)).toHaveValue(mockProfile.department);
    expect(screen.getByLabelText(/bio/i)).toHaveValue(mockProfile.bio);
    expect(screen.getByLabelText(/email/i)).toHaveValue(mockProfile.contact.email);
    expect(screen.getByLabelText(/phone/i)).toHaveValue(mockProfile.contact.phone);
    expect(screen.getByLabelText(/location/i)).toHaveValue(mockProfile.contact.location);
    expect(screen.getByLabelText(/hourly rate/i)).toHaveValue(mockProfile.hourlyRate.toString());
    expect(screen.getByLabelText(/day rate/i)).toHaveValue(mockProfile.dayRate.toString());
    expect(screen.getByLabelText(/yearly salary/i)).toHaveValue(mockProfile.yearlySalary.toString());
  });

  it('validates required fields', async () => {
    render(<ProfileForm profile={mockProfile} />);

    // Clear required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });

    // Submit form
    fireEvent.click(screen.getByText(/save changes/i));

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('calls onSuccess callback after successful submission', async () => {
    const onSuccess = jest.fn();
    render(<ProfileForm profile={mockProfile} onSuccess={onSuccess} />);

    // Submit form
    fireEvent.click(screen.getByText(/save changes/i));

    // Check if onSuccess was called
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
}); 