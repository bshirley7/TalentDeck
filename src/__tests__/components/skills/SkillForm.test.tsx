import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SkillForm } from '@/components/skills/SkillForm'
import { Skill } from '@/types'

describe('SkillForm', () => {
  const mockOnSubmit = jest.fn()
  const mockSkill: Skill = {
    id: '1',
    name: 'JavaScript',
    category: 'Programming Languages',
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<SkillForm onSubmit={mockOnSubmit} />)

    // Check if all form fields are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
  })

  it('pre-fills form fields when editing an existing skill', () => {
    render(<SkillForm onSubmit={mockOnSubmit} initialData={mockSkill} />)

    // Check if form fields are pre-filled
    expect(screen.getByLabelText(/name/i)).toHaveValue(mockSkill.name)
    expect(screen.getByLabelText(/category/i)).toHaveValue(mockSkill.category)
  })

  it('validates required fields', async () => {
    render(<SkillForm onSubmit={mockOnSubmit} />)

    // Try to submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    // Check if validation messages are shown
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/category is required/i)).toBeInTheDocument()
    })

    // Check if onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    render(<SkillForm onSubmit={mockOnSubmit} />)

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'TypeScript' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Programming Languages' } })

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    // Check if onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'TypeScript',
        category: 'Programming Languages',
      })
    })
  })

  it('prevents duplicate skill names', async () => {
    render(<SkillForm onSubmit={mockOnSubmit} />)

    // Fill in the form with a duplicate skill name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'JavaScript' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Programming Languages' } })

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    // Check if validation message is shown
    await waitFor(() => {
      expect(screen.getByText(/skill name already exists/i)).toBeInTheDocument()
    })

    // Check if onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('handles category selection', async () => {
    render(<SkillForm onSubmit={mockOnSubmit} />)

    // Select a category
    const categorySelect = screen.getByLabelText(/category/i)
    fireEvent.change(categorySelect, { target: { value: 'Frontend' } })

    // Check if the category was selected
    expect(categorySelect).toHaveValue('Frontend')
  })

  it('allows creating a new category', async () => {
    render(<SkillForm onSubmit={mockOnSubmit} />)

    // Fill in the form with a new category
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Skill' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'New Category' } })

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    // Check if onSubmit was called with the new category
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Skill',
        category: 'New Category',
      })
    })
  })
}) 