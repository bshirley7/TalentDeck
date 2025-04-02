import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProfileTable } from '@/components/profiles/ProfileTable'
import { TalentProfile, ProfileSkill } from '@/types'

describe('ProfileTable', () => {
  const mockProfiles: TalentProfile[] = [
    {
      id: '1',
      name: 'John Doe',
      title: 'Senior Developer',
      department: 'Engineering',
      hourlyRate: 150,
      skills: [
        {
          id: '1',
          name: 'JavaScript',
          category: 'Programming Languages',
          proficiency: 'Expert',
        },
        {
          id: '2',
          name: 'React',
          category: 'Frontend',
          proficiency: 'Expert',
        },
      ],
      contact: {
        email: 'john@example.com',
        phone: '123-456-7890',
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-04-01',
        preferredHours: 'Full-time',
        timezone: 'UTC',
      },
    },
    {
      id: '2',
      name: 'Jane Smith',
      title: 'UI Designer',
      department: 'Design',
      hourlyRate: 120,
      skills: [
        {
          id: '3',
          name: 'UI Design',
          category: 'Design',
          proficiency: 'Expert',
        },
      ],
      contact: {
        email: 'jane@example.com',
        phone: '098-765-4321',
      },
      availability: {
        status: 'Busy',
        nextAvailable: '2024-04-15',
        preferredHours: 'Part-time',
        timezone: 'UTC',
      },
    },
  ]

  it('renders all profiles', () => {
    render(<ProfileTable profiles={mockProfiles} />)

    // Check if profile names are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()

    // Check if titles are rendered
    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    expect(screen.getByText('UI Designer')).toBeInTheDocument()
  })

  it('displays skills with correct styling', () => {
    render(<ProfileTable profiles={mockProfiles} />)

    // Check if skills have the correct badge styling
    const skillBadges = screen.getAllByText(/JavaScript|React|UI Design/)
    skillBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'rounded-full')
    })
  })

  it('displays hourly rates correctly', () => {
    render(<ProfileTable profiles={mockProfiles} />)

    expect(screen.getByText('$150')).toBeInTheDocument()
    expect(screen.getByText('$120')).toBeInTheDocument()
  })

  it('displays availability status correctly', () => {
    render(<ProfileTable profiles={mockProfiles} />)

    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.getByText('Busy')).toBeInTheDocument()
  })

  it('handles empty profiles array', () => {
    render(<ProfileTable profiles={[]} />)
    
    // Check if no profiles are rendered
    expect(screen.queryByRole('row')).not.toBeInTheDocument()
  })

  it('sorts profiles by name when clicking name header', () => {
    render(<ProfileTable profiles={mockProfiles} />)

    // Click the name header to sort
    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader)

    // Get all profile names in order
    const profileNames = screen.getAllByRole('row').slice(1).map(row => row.textContent)
    
    // Check if profiles are sorted alphabetically
    expect(profileNames[0]).toContain('Jane Smith')
    expect(profileNames[1]).toContain('John Doe')
  })

  it('filters profiles by department', () => {
    render(<ProfileTable profiles={mockProfiles} />)

    // Find and click the department filter
    const departmentFilter = screen.getByLabelText('Department')
    fireEvent.change(departmentFilter, { target: { value: 'Engineering' } })

    // Check if only Engineering profiles are shown
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('filters profiles by availability status', () => {
    render(<ProfileTable profiles={mockProfiles} />)

    // Find and click the availability filter
    const availabilityFilter = screen.getByLabelText('Availability')
    fireEvent.change(availabilityFilter, { target: { value: 'Available' } })

    // Check if only available profiles are shown
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })
}) 