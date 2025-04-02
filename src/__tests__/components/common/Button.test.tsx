import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '@/components/common/Button'

describe('Button', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it('renders button with text', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant styles', () => {
    render(<Button variant="primary" onClick={mockOnClick}>Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-blue-600', 'text-white')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary" onClick={mockOnClick}>Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('bg-gray-200', 'text-gray-900')
  })

  it('applies outline variant styles', () => {
    render(<Button variant="outline" onClick={mockOnClick}>Outline</Button>)
    const button = screen.getByText('Outline')
    expect(button).toHaveClass('border', 'border-gray-300', 'text-gray-700')
  })

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost" onClick={mockOnClick}>Ghost</Button>)
    const button = screen.getByText('Ghost')
    expect(button).toHaveClass('text-gray-700', 'hover:bg-gray-100')
  })

  it('applies destructive variant styles', () => {
    render(<Button variant="destructive" onClick={mockOnClick}>Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-red-600', 'text-white')
  })

  it('applies size styles', () => {
    render(<Button size="sm" onClick={mockOnClick}>Small</Button>)
    const button = screen.getByText('Small')
    expect(button).toHaveClass('px-2', 'py-1', 'text-sm')
  })

  it('applies full width styles', () => {
    render(<Button fullWidth onClick={mockOnClick}>Full Width</Button>)
    const button = screen.getByText('Full Width')
    expect(button).toHaveClass('w-full')
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled onClick={mockOnClick}>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('does not trigger onClick when disabled', () => {
    render(<Button disabled onClick={mockOnClick}>Disabled</Button>)
    fireEvent.click(screen.getByText('Disabled'))
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('renders with icon', () => {
    render(
      <Button onClick={mockOnClick}>
        <span className="mr-2">Icon</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
    )
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class" onClick={mockOnClick}>Custom</Button>)
    const button = screen.getByText('Custom')
    expect(button).toHaveClass('custom-class')
  })
}) 