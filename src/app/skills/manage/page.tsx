'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SkillsManagementTable } from '@/components/skills/SkillsManagementTable';
import { Skill } from '@/types';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
});

type SkillFormData = z.infer<typeof skillSchema>;

export default function ManageSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load skills
        const skillsResponse = await fetch('/api/skills');
        if (!skillsResponse.ok) throw new Error('Failed to fetch skills');
        const skillsData = await skillsResponse.json();
        setSkills(skillsData);

        // Load categories
        const categoriesResponse = await fetch('/api/skills/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    };

    loadData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      // Split skills by comma and trim whitespace
      const skillNames = data.name.split(',').map(name => name.trim()).filter(Boolean);
      
      // Create an array of promises for each skill
      const skillPromises = skillNames.map(skillName => 
        fetch('/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: skillName,
            category: data.category,
          }),
        }).then(res => {
          if (!res.ok) throw new Error(`Failed to add skill: ${skillName}`);
          return res.json();
        })
      );

      // Wait for all skills to be added
      const newSkills = await Promise.all(skillPromises);
      
      setSkills([...skills, ...newSkills]);
      reset();
      setSuccess(`Successfully added ${newSkills.length} skill${newSkills.length > 1 ? 's' : ''}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding skills:', err);
      setError(err instanceof Error ? err.message : 'Failed to add skills');
      setTimeout(() => setError(null), 3000);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('/api/skills/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const { category } = await response.json();
      setCategories([...categories, category]);
      setNewCategory('');
      setSuccess('Category added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err instanceof Error ? err.message : 'Failed to add category');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteCategory = async (category: string) => {
    try {
      const response = await fetch(`/api/skills/categories?category=${encodeURIComponent(category)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories(categories.filter(c => c !== category));
      setSkills(skills.filter(s => s.category !== category));
      setSuccess('Category deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete skill');
      }

      setSkills(skills.filter(skill => skill.id !== id));
      setSuccess('Skill deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete skill');
      setTimeout(() => setError(null), 3000);
    }
  };

  const editSkill = async (skill: Skill, data: SkillFormData) => {
    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          category: data.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update skill');
      }

      const updatedSkill = await response.json();
      setSkills(skills.map(s => s.id === skill.id ? updatedSkill : s));
      setSuccess('Skill updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating skill:', err);
      setError(err instanceof Error ? err.message : 'Failed to update skill');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Skills Directory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add, edit, and manage skills and categories in the directory.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {/* Categories Section */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Categories</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage skill categories.</p>
            </div>
            <div className="mt-5">
              <div className="flex gap-x-4">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="inline-flex items-center rounded-md border border-transparent bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gradient-primary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 whitespace-nowrap"
                >
                  Add Category
                </button>
              </div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3"
                  >
                    <span className="text-sm font-medium text-gray-900">{category}</span>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Skill Form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add Skill</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Add a new skill to the directory.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Skill Names
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  placeholder="Enter skill names (comma-separated)"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gradient-primary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Skills Table */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Current Skills</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage existing skills in the directory.</p>
            </div>
            <div className="mt-5">
              <SkillsManagementTable
                skills={skills}
                onDelete={deleteSkill}
                onEdit={editSkill}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 