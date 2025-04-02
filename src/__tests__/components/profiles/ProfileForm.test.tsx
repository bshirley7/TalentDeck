import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProfileForm } from '@/components/profiles/ProfileForm'
import { TalentProfile } from '@/types'

describe('ProfileForm', () => {
  const mockOnSubmit = jest.fn()
  const mockProfile: TalentProfile = {
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
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<ProfileForm onSubmit={mockOnSubmit} />)

    // Check if all form fields are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/hourly rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/availability status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/next available/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/preferred hours/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/timezone/i)).toBeInTheDocument()
  })

  it('pre-fills form fields when editing an existing profile', () => {
    render(<ProfileForm onSubmit={mockOnSubmit} initialData={mockProfile} />)

    // Check if form fields are pre-filled
    expect(screen.getByLabelText(/name/i)).toHaveValue(mockProfile.name)
    expect(screen.getByLabelText(/title/i)).toHaveValue(mockProfile.title)
    expect(screen.getByLabelText(/department/i)).toHaveValue(mockProfile.department)
    expect(screen.getByLabelText(/hourly rate/i)).toHaveValue(mockProfile.hourlyRate.toString())
    expect(screen.getByLabelText(/email/i)).toHaveValue(mockProfile.contact.email)
    expect(screen.getByLabelText(/phone/i)).toHaveValue(mockProfile.contact.phone)
    expect(screen.getByLabelText(/availability status/i)).toHaveValue(mockProfile.availability.status)
    expect(screen.getByLabelText(/next available/i)).toHaveValue(mockProfile.availability.nextAvailable)
    expect(screen.getByLabelText(/preferred hours/i)).toHaveValue(mockProfile.availability.preferredHours)
    expect(screen.getByLabelText(/timezone/i)).toHaveValue(mockProfile.availability.timezone)
  })

  it('validates required fields', async () => {
    render(<ProfileForm onSubmit={mockOnSubmit} />)

    // Try to submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    // Check if validation messages are shown
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/department is required/i)).toBeInTheDocument()
      expect(screen.getByText(/hourly rate is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
    })

    // Check if onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    render(<ProfileForm onSubmit={mockOnSubmit} />)

    // Fill in the email field with an invalid format
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    // Check if validation message is shown
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })

    // Check if onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('validates phone number format', async () => {
    render(<ProfileForm onSubmit={mockOnSubmit} />)

    // Fill in the phone field with an invalid format
    const phoneInput = screen.getByLabelText(/phone/i)
    fireEvent.change(phoneInput, { target: { value: '123' } })
    fireEvent.blur(phoneInput)

    // Check if validation message is shown
    await waitFor(() => {
      expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument()
    })

    // Check if onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    render(<ProfileForm onSubmit={mockOnSubmit} />)

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Senior Developer' } })
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'Engineering' } })
    fireEvent.change(screen.getByLabelText(/hourly rate/i), { target: { value: '150' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } })
    fireEvent.change(screen.getByLabelText(/availability status/i), { target: { value: 'Available' } })
    fireEvent.change(screen.getByLabelText(/next available/i), { target: { value: '2024-04-01' } })
    fireEvent.change(screen.getByLabelText(/preferred hours/i), { target: { value: 'Full-time' } })
    fireEvent.change(screen.getByLabelText(/timezone/i), { target: { value: 'UTC' } })

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    // Check if onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        title: 'Senior Developer',
        department: 'Engineering',
        hourlyRate: 150,
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
        skills: [],
      })
    })
  })

  it('handles skill selection and removal', async () => {
    render(<ProfileForm onSubmit={mockOnSubmit} />)

    // Add a skill
    const skillSelect = screen.getByLabelText(/select skill/i)
    fireEvent.change(skillSelect, { target: { value: 'JavaScript' } })
    fireEvent.click(screen.getByRole('button', { name: /add skill/i }))

    // Check if skill was added
    expect(screen.getByText('JavaScript')).toBeInTheDocument()

    // Remove the skill
    fireEvent.click(screen.getByRole('button', { name: /remove JavaScript/i }))

    // Check if skill was removed
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
  })
}) 