import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Card } from '@/components/common/Card'

describe('Card', () => {
  it('renders card with content', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders card with header', () => {
    render(<Card header="Card Header">Card content</Card>)
    expect(screen.getByText('Card Header')).toBeInTheDocument()
  })

  it('renders card with footer', () => {
    render(<Card footer="Card Footer">Card content</Card>)
    expect(screen.getByText('Card Footer')).toBeInTheDocument()
  })

  it('applies default styles', () => {
    render(<Card>Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow')
  })

  it('applies hover styles when hoverable is true', () => {
    render(<Card hoverable>Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow')
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('custom-class')
  })

  it('renders with padding', () => {
    render(<Card>Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('p-6')
  })

  it('renders header with correct styles', () => {
    render(<Card header="Card Header">Card content</Card>)
    const header = screen.getByText('Card Header')
    expect(header).toHaveClass('px-6', 'py-4', 'border-b', 'font-semibold')
  })

  it('renders footer with correct styles', () => {
    render(<Card footer="Card Footer">Card content</Card>)
    const footer = screen.getByText('Card Footer')
    expect(footer).toHaveClass('px-6', 'py-4', 'border-t', 'text-gray-500')
  })

  it('renders with custom padding', () => {
    render(<Card padding="p-8">Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('p-8')
  })

  it('renders with custom shadow', () => {
    render(<Card shadow="shadow-xl">Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('shadow-xl')
  })

  it('renders with custom background color', () => {
    render(<Card bgColor="bg-gray-100">Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('bg-gray-100')
  })

  it('renders with custom border radius', () => {
    render(<Card borderRadius="rounded-xl">Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('rounded-xl')
  })

  it('renders with custom border color', () => {
    render(<Card borderColor="border-blue-500">Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('border-blue-500')
  })

  it('renders with custom border width', () => {
    render(<Card borderWidth="border-2">Card content</Card>)
    const card = screen.getByText('Card content').parentElement
    expect(card).toHaveClass('border-2')
  })

  it('renders with custom header styles', () => {
    render(<Card header="Card Header" headerClassName="bg-blue-500 text-white">Card content</Card>)
    const header = screen.getByText('Card Header')
    expect(header).toHaveClass('bg-blue-500', 'text-white')
  })

  it('renders with custom footer styles', () => {
    render(<Card footer="Card Footer" footerClassName="bg-gray-100 text-gray-900">Card content</Card>)
    const footer = screen.getByText('Card Footer')
    expect(footer).toHaveClass('bg-gray-100', 'text-gray-900')
  })
}) 