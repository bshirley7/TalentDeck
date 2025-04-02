import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SearchBar } from '@/components/common/SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()
  const mockOnFilterChange = jest.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
    mockOnFilterChange.mockClear()
  })

  it('renders search input and filter select', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={['All', 'Engineering', 'Design']}
      />
    )

    // Check if search input and filter select are rendered
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('handles search input changes', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={['All', 'Engineering', 'Design']}
      />
    )

    // Type in the search input
    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    // Check if onSearch was called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('handles filter selection', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={['All', 'Engineering', 'Design']}
      />
    )

    // Select a filter
    const filterSelect = screen.getByRole('combobox')
    fireEvent.change(filterSelect, { target: { value: 'Engineering' } })

    // Check if onFilterChange was called with the correct value
    expect(mockOnFilterChange).toHaveBeenCalledWith('Engineering')
  })

  it('displays all filter options', () => {
    const filters = ['All', 'Engineering', 'Design']
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={filters}
      />
    )

    // Check if all filter options are rendered
    filters.forEach(filter => {
      expect(screen.getByText(filter)).toBeInTheDocument()
    })
  })

  it('clears search input when filter changes', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={['All', 'Engineering', 'Design']}
      />
    )

    // Type in the search input
    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    // Change the filter
    const filterSelect = screen.getByRole('combobox')
    fireEvent.change(filterSelect, { target: { value: 'Engineering' } })

    // Check if search input was cleared
    expect(searchInput).toHaveValue('')
  })

  it('handles empty search input', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={['All', 'Engineering', 'Design']}
      />
    )

    // Clear the search input
    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: '' } })

    // Check if onSearch was called with an empty string
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  it('handles keyboard events', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={['All', 'Engineering', 'Design']}
      />
    )

    // Type in the search input and press Enter
    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    // Check if onSearch was called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })
}) 