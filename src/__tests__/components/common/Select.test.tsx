import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Select } from '@/components/common/Select'

describe('Select', () => {
  const mockOnChange = jest.fn()
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders select with label', () => {
    render(<Select label="Select Option" options={options} onChange={mockOnChange} />)
    expect(screen.getByLabelText('Select Option')).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(<Select options={options} onChange={mockOnChange} />)
    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  it('handles option selection', () => {
    render(<Select options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option2' } })
    expect(mockOnChange).toHaveBeenCalledWith('option2')
  })

  it('displays placeholder when no option is selected', () => {
    render(<Select placeholder="Select an option" options={options} onChange={mockOnChange} />)
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Select error="Invalid selection" options={options} onChange={mockOnChange} />)
    expect(screen.getByText('Invalid selection')).toBeInTheDocument()
  })

  it('applies error styles when error is present', () => {
    render(<Select error="Invalid selection" options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('border-red-500', 'focus:ring-red-500')
  })

  it('disables select when disabled prop is true', () => {
    render(<Select disabled options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
    expect(select).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('does not trigger onChange when disabled', () => {
    render(<Select disabled options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option1' } })
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Select className="custom-class" options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('custom-class')
  })

  it('handles required validation', () => {
    render(<Select required options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeRequired()
  })

  it('handles value prop', () => {
    render(<Select value="option1" options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('option1')
  })

  it('handles empty options array', () => {
    render(<Select options={[]} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    expect(select.children).toHaveLength(1) // Only placeholder option
  })

  it('handles option groups', () => {
    const groupedOptions = [
      {
        label: 'Group 1',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      },
      {
        label: 'Group 2',
        options: [
          { value: 'option3', label: 'Option 3' },
          { value: 'option4', label: 'Option 4' },
        ],
      },
    ]

    render(<Select options={groupedOptions} onChange={mockOnChange} />)
    
    // Check if groups are rendered
    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.getByText('Group 2')).toBeInTheDocument()
    
    // Check if options are rendered
    groupedOptions.forEach(group => {
      group.options.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument()
      })
    })
  })

  it('handles keyboard navigation', () => {
    render(<Select options={options} onChange={mockOnChange} />)
    const select = screen.getByRole('combobox')
    
    // Focus the select
    fireEvent.focus(select)
    
    // Press arrow down
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    expect(select).toHaveFocus()
    
    // Press arrow up
    fireEvent.keyDown(select, { key: 'ArrowUp' })
    expect(select).toHaveFocus()
  })
}) 