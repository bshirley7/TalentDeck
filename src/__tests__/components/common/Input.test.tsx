import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '@/components/common/Input'

describe('Input', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders input with label', () => {
    render(<Input label="Username" onChange={mockOnChange} />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter username" onChange={mockOnChange} />)
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
  })

  it('handles input changes', () => {
    render(<Input onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(mockOnChange).toHaveBeenCalledWith('test')
  })

  it('displays error message', () => {
    render(<Input error="Invalid input" onChange={mockOnChange} />)
    expect(screen.getByText('Invalid input')).toBeInTheDocument()
  })

  it('applies error styles when error is present', () => {
    render(<Input error="Invalid input" onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500', 'focus:ring-red-500')
  })

  it('disables input when disabled prop is true', () => {
    render(<Input disabled onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('does not trigger onChange when disabled', () => {
    render(<Input disabled onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('renders with icon', () => {
    render(
      <Input
        onChange={mockOnChange}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('handles keyboard events', () => {
    render(<Input onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('handles focus and blur events', () => {
    render(<Input onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    expect(input).toHaveClass('ring-2', 'ring-blue-500')

    fireEvent.blur(input)
    expect(input).not.toHaveClass('ring-2', 'ring-blue-500')
  })

  it('handles required validation', () => {
    render(<Input required onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('handles type prop', () => {
    render(<Input type="password" onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('handles value prop', () => {
    render(<Input value="test" onChange={mockOnChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test')
  })
}) 