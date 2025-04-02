import { DataStore } from '@/lib/DataStore'
import { Skill, TalentProfile, ProfileSkill } from '@/types'

describe('DataStore', () => {
  let dataStore: DataStore

  beforeEach(() => {
    dataStore = new DataStore()
  })

  describe('Skills Management', () => {
    it('adds a new skill', () => {
      const skill: Skill = {
        id: '1',
        name: 'JavaScript',
        category: 'Programming Languages',
      }

      dataStore.addSkill(skill)
      const skills = dataStore.getSkills()
      expect(skills).toContainEqual(skill)
    })

    it('prevents duplicate skills', () => {
      const skill: Skill = {
        id: '1',
        name: 'JavaScript',
        category: 'Programming Languages',
      }

      dataStore.addSkill(skill)
      dataStore.addSkill(skill)
      const skills = dataStore.getSkills()
      expect(skills.filter((s: Skill) => s.id === skill.id)).toHaveLength(1)
    })

    it('updates an existing skill', () => {
      const skill: Skill = {
        id: '1',
        name: 'JavaScript',
        category: 'Programming Languages',
      }

      dataStore.addSkill(skill)
      const updatedSkill: Skill = {
        ...skill,
        name: 'TypeScript',
      }

      dataStore.updateSkill(updatedSkill)
      const skills = dataStore.getSkills()
      expect(skills.find((s: Skill) => s.id === skill.id)).toEqual(updatedSkill)
    })

    it('deletes a skill', () => {
      const skill: Skill = {
        id: '1',
        name: 'JavaScript',
        category: 'Programming Languages',
      }

      dataStore.addSkill(skill)
      dataStore.deleteSkill(skill.id)
      const skills = dataStore.getSkills()
      expect(skills.find((s: Skill) => s.id === skill.id)).toBeUndefined()
    })
  })

  describe('Profile Management', () => {
    it('adds a new profile', () => {
      const profile: TalentProfile = {
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

      dataStore.addProfile(profile)
      const profiles = dataStore.getProfiles()
      expect(profiles).toContainEqual(profile)
    })

    it('prevents duplicate profiles', () => {
      const profile: TalentProfile = {
        id: '1',
        name: 'John Doe',
        title: 'Senior Developer',
        department: 'Engineering',
        hourlyRate: 150,
        skills: [],
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

      dataStore.addProfile(profile)
      dataStore.addProfile(profile)
      const profiles = dataStore.getProfiles()
      expect(profiles.filter((p: TalentProfile) => p.id === profile.id)).toHaveLength(1)
    })

    it('updates an existing profile', () => {
      const profile: TalentProfile = {
        id: '1',
        name: 'John Doe',
        title: 'Senior Developer',
        department: 'Engineering',
        hourlyRate: 150,
        skills: [],
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

      dataStore.addProfile(profile)
      const updatedProfile: TalentProfile = {
        ...profile,
        title: 'Lead Developer',
      }

      dataStore.updateProfile(updatedProfile)
      const profiles = dataStore.getProfiles()
      expect(profiles.find((p: TalentProfile) => p.id === profile.id)).toEqual(updatedProfile)
    })

    it('deletes a profile', () => {
      const profile: TalentProfile = {
        id: '1',
        name: 'John Doe',
        title: 'Senior Developer',
        department: 'Engineering',
        hourlyRate: 150,
        skills: [],
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

      dataStore.addProfile(profile)
      dataStore.deleteProfile(profile.id)
      const profiles = dataStore.getProfiles()
      expect(profiles.find((p: TalentProfile) => p.id === profile.id)).toBeUndefined()
    })

    it('gets a profile by ID', () => {
      const profile: TalentProfile = {
        id: '1',
        name: 'John Doe',
        title: 'Senior Developer',
        department: 'Engineering',
        hourlyRate: 150,
        skills: [],
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

      dataStore.addProfile(profile)
      const foundProfile = dataStore.getProfileById(profile.id)
      expect(foundProfile).toEqual(profile)
    })
  })

  describe('Category Management', () => {
    it('adds a new category', () => {
      const category = 'New Category'
      dataStore.addCategory(category)
      const categories = dataStore.getCategories()
      expect(categories).toContain(category)
    })

    it('prevents duplicate categories', () => {
      const category = 'New Category'
      dataStore.addCategory(category)
      dataStore.addCategory(category)
      const categories = dataStore.getCategories()
      expect(categories.filter((c: string) => c === category)).toHaveLength(1)
    })

    it('deletes a category', () => {
      const category = 'New Category'
      dataStore.addCategory(category)
      dataStore.deleteCategory(category)
      const categories = dataStore.getCategories()
      expect(categories).not.toContain(category)
    })

    it('moves skills to Uncategorized when their category is deleted', () => {
      const category = 'New Category'
      const skill: Skill = {
        id: '1',
        name: 'Test Skill',
        category,
      }

      dataStore.addCategory(category)
      dataStore.addSkill(skill)
      dataStore.deleteCategory(category)

      const skills = dataStore.getSkills()
      const updatedSkill = skills.find((s: Skill) => s.id === skill.id)
      expect(updatedSkill?.category).toBe('Uncategorized')
    })
  })
}) 