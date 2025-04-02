import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SkillsTable } from '@/components/skills/SkillsTable'
import { Skill } from '@/types'

describe('SkillsTable', () => {
  const mockSkills: Skill[] = [
    {
      id: '1',
      name: 'JavaScript',
      category: 'Programming Languages',
    },
    {
      id: '2',
      name: 'React',
      category: 'Frontend',
    },
    {
      id: '3',
      name: 'UI Design',
      category: 'Design',
    },
    {
      id: '4',
      name: 'Python',
      category: 'Programming Languages',
    },
  ]

  it('renders all skills', () => {
    render(<SkillsTable skills={mockSkills} />)

    // Check if all skills are rendered
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('UI Design')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('displays skills with correct badge styling', () => {
    render(<SkillsTable skills={mockSkills} />)

    // Check if skills have the correct badge styling
    const skillBadges = screen.getAllByText(/JavaScript|React|UI Design|Python/)
    skillBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'rounded-full')
    })
  })

  it('groups skills by category', () => {
    render(<SkillsTable skills={mockSkills} />)

    // Check if categories are rendered
    expect(screen.getByText('Programming Languages')).toBeInTheDocument()
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()

    // Check if skills are under correct categories
    const programmingSection = screen.getByText('Programming Languages').closest('div')
    expect(programmingSection).toHaveTextContent('JavaScript')
    expect(programmingSection).toHaveTextContent('Python')

    const frontendSection = screen.getByText('Frontend').closest('div')
    expect(frontendSection).toHaveTextContent('React')

    const designSection = screen.getByText('Design').closest('div')
    expect(designSection).toHaveTextContent('UI Design')
  })

  it('handles empty skills array', () => {
    render(<SkillsTable skills={[]} />)
    
    // Check if no categories are rendered
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('sorts categories alphabetically', () => {
    render(<SkillsTable skills={mockSkills} />)

    // Get all category headings in order
    const categoryHeadings = screen.getAllByRole('heading')
    
    // Check if categories are sorted alphabetically
    expect(categoryHeadings[0]).toHaveTextContent('Design')
    expect(categoryHeadings[1]).toHaveTextContent('Frontend')
    expect(categoryHeadings[2]).toHaveTextContent('Programming Languages')
  })

  it('sorts skills alphabetically within categories', () => {
    render(<SkillsTable skills={mockSkills} />)

    // Get the Programming Languages section
    const programmingSection = screen.getByText('Programming Languages').closest('div')
    
    // Check if skills are sorted alphabetically
    const skills = programmingSection?.querySelectorAll('span')
    expect(skills?.[0]).toHaveTextContent('JavaScript')
    expect(skills?.[1]).toHaveTextContent('Python')
  })
}) 