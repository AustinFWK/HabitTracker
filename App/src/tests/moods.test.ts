import { describe, it, expect } from 'vitest'
import { getMoodLabel, MOODS } from './moods'

describe('moods utility', () => {
  describe('getMoodLabel', () => {
    it('should return "Very Bad" for mood value 1', () => {
      const result = getMoodLabel(1)
      expect(result).toBe('Very Bad')
    })

    it('should return "Bad" for mood value 2', () => {
      const result = getMoodLabel(2)
      expect(result).toBe('Bad')
    })

    it('should return "Neutral" for mood value 3', () => {
      const result = getMoodLabel(3)
      expect(result).toBe('Neutral')
    })

    it('should return "Good" for mood value 4', () => {
      const result = getMoodLabel(4)
      expect(result).toBe('Good')
    })

    it('should return "Very Good" for mood value 5', () => {
      const result = getMoodLabel(5)
      expect(result).toBe('Very Good')
    })

    it('should return "Unknown" for invalid mood value', () => {
      const result = getMoodLabel(999)
      expect(result).toBe('Unknown')
    })

    it('should return "Unknown" for negative mood value', () => {
      const result = getMoodLabel(-1)
      expect(result).toBe('Unknown')
    })

    it('should return "Unknown" for zero', () => {
      const result = getMoodLabel(0)
      expect(result).toBe('Unknown')
    })
  })

  describe('MOODS constant', () => {
    it('should have 5 mood values', () => {
      expect(MOODS).toHaveLength(5)
    })

    it('should have correct structure for each mood', () => {
      MOODS.forEach(mood => {
        expect(mood).toHaveProperty('value')
        expect(mood).toHaveProperty('label')
        expect(typeof mood.value).toBe('number')
        expect(typeof mood.label).toBe('string')
      })
    })

    it('should have unique values', () => {
      const values = MOODS.map(m => m.value)
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(MOODS.length)
    })
  })
})
