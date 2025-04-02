import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import { availabilitySchema, projectCommitmentSchema, seasonalAvailabilitySchema, capacitySchema } from '@/lib/validation';
import { Availability, ProjectCommitment } from '@/types';

describe('Availability Validation', () => {
  describe('ProjectCommitment', () => {
    it('should validate a valid project commitment', () => {
      const validCommitment: ProjectCommitment = {
        projectId: '123',
        projectName: 'Test Project',
        role: 'Developer',
        startDate: '2024-03-01',
        endDate: '2024-04-01',
        commitmentPercentage: 80,
        notes: 'Part-time commitment'
      };

      const result = projectCommitmentSchema.safeParse(validCommitment);
      expect(result.success).toBe(true);
    });

    it('should reject invalid commitment percentage', () => {
      const invalidCommitment = {
        projectId: '123',
        projectName: 'Test Project',
        role: 'Developer',
        startDate: '2024-03-01',
        endDate: '2024-04-01',
        commitmentPercentage: 150, // Invalid percentage
        notes: 'Part-time commitment'
      };

      const result = projectCommitmentSchema.safeParse(invalidCommitment);
      expect(result.success).toBe(false);
    });
  });

  describe('SeasonalAvailability', () => {
    it('should validate valid seasonal availability', () => {
      const validSeasonal = {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        status: 'Available',
        notes: 'Summer availability'
      };

      const result = seasonalAvailabilitySchema.safeParse(validSeasonal);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidSeasonal = {
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        status: 'InvalidStatus', // Invalid status
        notes: 'Summer availability'
      };

      const result = seasonalAvailabilitySchema.safeParse(invalidSeasonal);
      expect(result.success).toBe(false);
    });
  });

  describe('Capacity', () => {
    it('should validate valid capacity', () => {
      const validCapacity = {
        weeklyHours: 40,
        maxConcurrentProjects: 2,
        preferredProjectDuration: {
          min: 30,
          max: 90
        }
      };

      const result = capacitySchema.safeParse(validCapacity);
      expect(result.success).toBe(true);
    });

    it('should reject invalid weekly hours', () => {
      const invalidCapacity = {
        weeklyHours: 200, // Invalid hours
        maxConcurrentProjects: 2,
        preferredProjectDuration: {
          min: 30,
          max: 90
        }
      };

      const result = capacitySchema.safeParse(invalidCapacity);
      expect(result.success).toBe(false);
    });
  });

  describe('Availability', () => {
    it('should validate complete availability profile', () => {
      const validAvailability: Availability = {
        status: 'Available',
        availableFrom: '2024-03-01',
        nextAvailable: '2024-04-01',
        preferredHours: '9 AM - 5 PM',
        timezone: 'EST',
        bookingLeadTime: 14,
        currentCommitments: [{
          projectId: '123',
          projectName: 'Test Project',
          role: 'Developer',
          startDate: '2024-03-01',
          endDate: '2024-04-01',
          commitmentPercentage: 80
        }],
        seasonalAvailability: [{
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          status: 'Available',
          notes: 'Summer availability'
        }],
        capacity: {
          weeklyHours: 40,
          maxConcurrentProjects: 2,
          preferredProjectDuration: {
            min: 30,
            max: 90
          }
        }
      };

      const result = availabilitySchema.safeParse(validAvailability);
      expect(result.success).toBe(true);
    });

    it('should validate minimal availability profile', () => {
      const minimalAvailability: Availability = {
        status: 'Available'
      };

      const result = availabilitySchema.safeParse(minimalAvailability);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidAvailability = {
        status: 'InvalidStatus', // Invalid status
        availableFrom: '2024-03-01'
      };

      const result = availabilitySchema.safeParse(invalidAvailability);
      expect(result.success).toBe(false);
    });
  });
}); 